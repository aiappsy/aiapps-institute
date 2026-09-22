import { AppraisalInputData } from "@/lib/ai/valuation-rubric";
import { scanGithubRepository, ScannedGithubData } from "./github-scanner";
import { scanLiveUrl, ScannedLiveData } from "./live-url-scanner";

export interface UnifiedScanResult {
  synthesizedInput: AppraisalInputData;
  github?: ScannedGithubData;
  live?: ScannedLiveData;
  scanLog: string[];
}

export async function runUnifiedScan(params: {
  githubUrl?: string;
  liveUrl?: string;
  manualOverrides?: Partial<AppraisalInputData>;
}): Promise<UnifiedScanResult> {
  const scanLog: string[] = [];
  const { githubUrl, liveUrl, manualOverrides = {} } = params;

  if (!githubUrl && !liveUrl) {
    throw new Error("Please provide at least a GitHub repository URL or a Live Application URL.");
  }

  let githubResult: ScannedGithubData | undefined;
  let liveResult: ScannedLiveData | undefined;

  scanLog.push("Initiating autonomous codebase & deployment audit...");

  const tasks: Promise<any>[] = [];

  if (githubUrl?.trim()) {
    scanLog.push(`Queuing GitHub audit for: ${githubUrl.trim()}...`);
    tasks.push(
      scanGithubRepository(githubUrl.trim())
        .then((res) => {
          githubResult = res;
          scanLog.push(`✓ GitHub inspection complete: Found ~${res.estimatedLinesOfCode.toLocaleString()} LOC, ${res.detectedTechStack.length} frameworks/libraries.`);
        })
        .catch((err) => {
          scanLog.push(`⚠ GitHub inspection note: ${err.message || "Using fallback code inference"}`);
        })
    );
  }

  if (liveUrl?.trim()) {
    scanLog.push(`Queuing live endpoint inspection for: ${liveUrl.trim()}...`);
    tasks.push(
      scanLiveUrl(liveUrl.trim())
        .then((res) => {
          liveResult = res;
          scanLog.push(`✓ Live URL scan complete: HTTP ${res.statusCode} (${res.responseTimeMs}ms), SSL ${res.isHttps ? "Active" : "None"}.`);
        })
        .catch((err) => {
          scanLog.push(`⚠ Live URL scan note: ${err.message || "Using fallback web inference"}`);
        })
    );
  }

  await Promise.allSettled(tasks);

  // 1. Synthesize Project Name
  let projectName = manualOverrides.projectName || "";
  if (!projectName) {
    if (liveResult?.ogSiteName) {
      projectName = liveResult.ogSiteName;
    } else if (liveResult?.pageTitle && !liveResult.pageTitle.includes("404") && liveResult.pageTitle.length < 40) {
      projectName = liveResult.pageTitle.split(/[-–|]/)[0].trim();
    } else if (githubResult?.name) {
      // Convert hyphen/camel to Title Case
      projectName = githubResult.name
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
    } else if (liveResult?.domain) {
      projectName = liveResult.domain;
    } else {
      projectName = "Autonomous App Asset";
    }
  }

  // 2. Synthesize Tagline
  let tagline = manualOverrides.tagline || "";
  if (!tagline) {
    if (liveResult?.metaDescription && liveResult.metaDescription.length > 10) {
      tagline = liveResult.metaDescription;
    } else if (liveResult?.ogDescription && liveResult.ogDescription.length > 10) {
      tagline = liveResult.ogDescription;
    } else if (githubResult?.description && githubResult.description.length > 10) {
      tagline = githubResult.description;
    } else if (liveResult?.extractedHeadlines && liveResult.extractedHeadlines.length > 0) {
      tagline = liveResult.extractedHeadlines[0];
    } else {
      tagline = `Production software platform for ${projectName}`;
    }
  }

  // 3. Synthesize Tech Stack
  const mergedStack = new Set<string>();
  if (githubResult?.detectedTechStack) {
    githubResult.detectedTechStack.forEach((t) => mergedStack.add(t));
  }
  if (liveResult?.detectedTechStack) {
    liveResult.detectedTechStack.forEach((t) => mergedStack.add(t));
  }
  if (manualOverrides.techStack) {
    manualOverrides.techStack.forEach((t) => mergedStack.add(t));
  }
  if (mergedStack.size === 0) {
    mergedStack.add("Next.js 14");
    mergedStack.add("TypeScript");
    mergedStack.add("Tailwind CSS");
  }

  // 4. Synthesize Category
  let category: AppraisalInputData["category"] = manualOverrides.category || "SaaS";
  if (!manualOverrides.category) {
    if (githubResult?.suggestedCategory) {
      category = githubResult.suggestedCategory;
    } else if (liveResult?.detectedCategory) {
      category = liveResult.detectedCategory;
    }
  }

  // 5. Synthesize Stage
  let stage: AppraisalInputData["stage"] = manualOverrides.stage || "mvp";
  if (!manualOverrides.stage) {
    if (liveResult && liveResult.statusCode >= 200 && liveResult.statusCode < 400 && liveResult.isHttps) {
      stage = "early-traction";
    } else if (githubResult?.suggestedStage) {
      stage = githubResult.suggestedStage;
    }
  }

  // 6. Synthesize Target Audience
  let targetAudience = manualOverrides.targetAudience || "";
  if (!targetAudience) {
    if (liveResult?.detectedAudience) {
      targetAudience = liveResult.detectedAudience;
    } else if (category === "AI / Machine Learning") {
      targetAudience = "B2B professionals, startup teams, and AI-enabled operators";
    } else if (category === "Developer Tool") {
      targetAudience = "Software developers, DevOps teams, and tech founders";
    } else {
      targetAudience = "Modern digital teams and software consumers";
    }
  }

  // 7. Pricing Model
  const pricingModel = manualOverrides.pricingModel || liveResult?.detectedPricingModel || "Subscription";

  // 8. Financials & Traction (Intelligent conservative defaults if not specified)
  const registeredUsers = manualOverrides.registeredUsers !== undefined
    ? manualOverrides.registeredUsers
    : (stage === "early-traction" ? 380 : 75);

  const monthlyRecurringRevenue = manualOverrides.monthlyRecurringRevenue !== undefined
    ? manualOverrides.monthlyRecurringRevenue
    : (stage === "cash-flow" ? 6200 : stage === "early-traction" ? 450 : 0);

  const payingUsers = manualOverrides.payingUsers !== undefined
    ? manualOverrides.payingUsers
    : (monthlyRecurringRevenue > 0 ? Math.max(1, Math.round(monthlyRecurringRevenue / 49)) : 0);

  const monthlyGrowthRate = manualOverrides.monthlyGrowthRate !== undefined
    ? manualOverrides.monthlyGrowthRate
    : 15;

  const burnRate = manualOverrides.burnRate !== undefined
    ? manualOverrides.burnRate
    : (category === "AI / Machine Learning" ? 85 : 45);

  // 9. Synthesize Architectural Summary
  let architectureSummary = manualOverrides.architectureSummary || "";
  if (!architectureSummary) {
    const parts: string[] = [];
    if (githubResult) {
      parts.push(githubResult.architecturalBreakdown);
    }
    if (liveResult) {
      parts.push(`Live deployment hosted on ${liveResult.detectedHosting} with ${liveResult.isHttps ? "enforced SSL/TLS" : "standard HTTP"}. Average edge response time: ${liveResult.responseTimeMs}ms.`);
    }
    if (parts.length === 0) {
      parts.push(`Production modular application built with ${Array.from(mergedStack).join(", ")}. Standard clean separation of UI components, routing, and data services.`);
    }
    architectureSummary = parts.join(" ");
  }

  // 10. Code Manifest
  const codeSnippetOrManifest = manualOverrides.codeSnippetOrManifest ||
    (githubResult ? githubResult.rawManifestSnippet : `Detected Stack: ${Array.from(mergedStack).join(", ")}`);

  scanLog.push("Synthesizing valuation baseline & code craftsmanship scorecard...");

  const synthesizedInput: AppraisalInputData = {
    projectName,
    tagline,
    category,
    stage,
    targetAudience,
    techStack: Array.from(mergedStack),
    pricingModel,
    monthlyRecurringRevenue,
    monthlyGrowthRate,
    registeredUsers,
    payingUsers,
    burnRate,
    repoUrl: githubUrl || undefined,
    architectureSummary,
    codeSnippetOrManifest,
  };

  return {
    synthesizedInput,
    github: githubResult,
    live: liveResult,
    scanLog,
  };
}
