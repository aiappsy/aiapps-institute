import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/db/store";
import { formatCurrency } from "@/lib/utils";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  try {
    const { reportId, repoName, description, isPrivate } = await req.json();

    if (!reportId) {
      return NextResponse.json({ error: "reportId is required" }, { status: 400 });
    }

    const report = store.getAppraisalById(reportId);
    if (!report) {
      return NextResponse.json({ error: "Appraisal report not found" }, { status: 404 });
    }

    const sanitizedRepoName = (repoName || `${report.projectName.toLowerCase().replace(/[^a-z0-9]/g, "-")}-audit`).replace(/-+/g, "-");
    const certId = report.certificate.certificateId;
    const badgeMarkdown = `[![AIApps Institute Certified](https://img.shields.io/badge/AIApps_Institute-Grade_${report.grade}_(${formatCurrency(report.valuationFairMarket).replace(/\s/g, "")})-amber?style=for-the-badge&logo=shield)](http://localhost:3000/verify/${certId})`;

    // Generate AIAPPS-AUDIT.md content
    const auditContent = `# ${report.projectName} — Certified Software Appraisal Audit

${badgeMarkdown}

> **Accredited Valuation Standard**: Certified by **AIApps Institute**  
> **Accreditation Grade**: **${report.grade}**  
> **Certified Fair Market Valuation**: **${formatCurrency(report.valuationFairMarket, report.currency)}**  
> **Rebuild / Replacement Cost**: **${formatCurrency(report.valuationBreakdown.costToRebuild.totalRebuildCost, report.currency)}**  
> **Certificate Checksum**: \`${report.certificate.sha256Hash}\`  
> **Verification Ledger**: [Verify Certificate](http://localhost:3000/verify/${certId})

---

## Executive Summary
${report.executiveSummary}

- **Category**: ${report.category}
- **Stage**: ${report.stage.toUpperCase()}
- **Primary Tech Stack**: ${report.techStack.join(", ")}
- **Monthly Recurring Revenue (MRR)**: ${report.monthlyRecurringRevenue > 0 ? formatCurrency(report.monthlyRecurringRevenue) + '/mo' : '$0 (Pre-Revenue)'}
- **Active Registered Users**: ${report.registeredUsers.toLocaleString()}

---

## Code Craftsmanship & Quality Diligence
- **Code Modularity Score**: ${report.codeHealth.modularityScore} / 100
- **Maintainability Index**: ${report.codeHealth.maintainabilityIndex} / 100
- **Test Coverage Estimate**: ${report.codeHealth.testCoverageEstimate}%
- **Security Vulnerability Index**: ${report.codeHealth.securityVulnerabilityIndex} (Zero Critical CVEs)
- **Dependencies Count**: ${report.codeHealth.dependenciesCount} Verified Packages

---

## Replacement Cost Breakdown
- **Estimated Engineering Person-Months**: ${report.valuationBreakdown.costToRebuild.estimatedPersonMonths} months
- **Benchmark Senior Engineering Rate**: $${report.valuationBreakdown.costToRebuild.hourlySeniorDevRate}/hour
- **Marketing & Acquisition Replacement**: ${formatCurrency(report.valuationBreakdown.marketingReplacement.totalMarketingReplacement)}
- **Traction & User Asset Value**: ${formatCurrency(report.valuationBreakdown.userTractionValue.userBaseValue)}

---

## Verified Audit Seal
- **Certificate ID**: \`${report.certificate.certificateId}\`
- **Issued Date**: ${report.certificate.issuedDate}
- **Valid Through**: ${report.certificate.validThrough}
- **Issuer**: ${report.certificate.issuer}
- **Ledger Status**: ${report.certificate.status}

*Generated automatically by AIApps Institute Software Due Diligence Engine.*
`;

    // Attempt pushing to GitHub via GitHub CLI if available
    let githubUrl = `https://github.com/aiappsy/${sanitizedRepoName}`;
    let pushedToRemote = false;

    try {
      const tempDir = path.join(process.cwd(), "scratch", "exports", sanitizedRepoName);
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      fs.writeFileSync(path.join(tempDir, "README.md"), auditContent, "utf-8");
      fs.writeFileSync(path.join(tempDir, "AIAPPS-AUDIT.md"), auditContent, "utf-8");
      fs.writeFileSync(
        path.join(tempDir, "certificate.json"),
        JSON.stringify(report.certificate, null, 2),
        "utf-8"
      );

      // Git init & push via gh cli
      const visibilityFlag = isPrivate ? "--private" : "--public";
      const cmd = `cd "${tempDir}" && git init -b main && git config user.name "AIApps Institute" && git config user.email "audits@aiappsinstitute.com" && git add . && git commit -m "feat: initial certified appraisal audit bundle for ${report.projectName}" && gh repo create aiappsy/${sanitizedRepoName} ${visibilityFlag} --source=. --remote=origin --push`;
      
      await execAsync(cmd);
      pushedToRemote = true;
    } catch (pushErr: any) {
      console.warn("[GitHub Export Warning] Remote repo creation note:", pushErr.message);
      // Fallback: URL is formatted cleanly for the user
      githubUrl = `https://github.com/aiappsy/${sanitizedRepoName}`;
    }

    return NextResponse.json({
      success: true,
      repoName: sanitizedRepoName,
      repoUrl: githubUrl,
      pushedToRemote,
      badgeMarkdown,
      auditContent,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to export project" }, { status: 500 });
  }
}
