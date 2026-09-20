import { GoogleGenerativeAI } from "@google/generative-ai";
import { AppraisalReport } from "../db/types";
import { AppraisalInputData, computeDeterministicAppraisal } from "./valuation-rubric";

export async function generateAppraisal(input: AppraisalInputData, userId: string = "user-default"): Promise<AppraisalReport> {
  const baseAppraisal = computeDeterministicAppraisal(input, userId);
  
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "" || apiKey === "your_google_gemini_api_key_here") {
    return baseAppraisal;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const modelName = process.env.GEMINI_MODEL || "gemini-3.8-flash";
    
    // Configure model with Google Search Grounding for live online research
    const modelConfig: any = {
      model: modelName,
    };

    if (process.env.GEMINI_ENABLE_SEARCH_GROUNDING !== "false") {
      modelConfig.tools = [
        {
          // Google Search Grounding enables real-time web research
          googleSearch: {},
        },
      ];
    }

    const model = genAI.getGenerativeModel(modelConfig);

    const prompt = `
You are the Chief Software Asset Valuator and M&A Due Diligence Director for the AIApps Institute.

Perform a rigorous institutional due-diligence appraisal on this project. You have live Google Search web access to research recent competitors, established market incumbents, and market acquisition multiples:

Project Details:
- Name: ${input.projectName}
- Tagline: ${input.tagline}
- Category: ${input.category}
- Stage: ${input.stage}
- Target Audience: ${input.targetAudience}
- Tech Stack: ${input.techStack.join(", ")}
- Monthly Revenue (MRR): $${input.monthlyRecurringRevenue}
- Monthly Growth Rate: ${input.monthlyGrowthRate}%
- Registered Users: ${input.registeredUsers}
- Paying Users: ${input.payingUsers}
- Architecture Summary: ${input.architectureSummary}
- Code Snippet / Manifest: ${input.codeSnippetOrManifest || "Standard production configuration"}

Baseline Quantitative Valuation Bounds:
- Estimated Person-Months: ${baseAppraisal.valuationBreakdown.costToRebuild.estimatedPersonMonths}
- Rebuild Cost: $${baseAppraisal.valuationBreakdown.costToRebuild.totalRebuildCost}
- Base Fair Market Value: $${baseAppraisal.valuationFairMarket}
- Base Grade: ${baseAppraisal.grade}

TASK:
1. Search the web for actual live competitors in this niche (both established market leaders and emerging AI rivals launched recently).
2. Assess market differentiation and feature absorption risk.
3. Validate or adjust the fair market valuation multiplier based on current real-world M&A benchmarks.

Return a valid JSON object ONLY (no markdown fences, no conversational prose) with this exact schema:
{
  "executiveSummary": "string (3-4 sentences of institutional appraisal analysis incorporating competitive context)",
  "strengths": ["string", "string", "string", "string"],
  "riskFactors": ["string", "string", "string"],
  "strategicRecommendations": ["string", "string", "string"],
  "techDebtDiscountPercent": number (between 4 and 25),
  "defensibilityMoatScore": number (between 50 and 99),
  "valuationFairMarketAdjustment": number (multiplier between 0.90 and 1.15),
  "competitiveIntelligence": {
    "establishedIncumbents": ["string", "string", "string"],
    "emergingRivals": ["string", "string", "string"],
    "threatLevel": "Low" | "Moderate" | "High",
    "differentiationAnalysis": "string"
  }
}
`;

    const result = await model.generateContent(prompt);
    const textResponse = result.response.text().trim();
    
    // Clean potential markdown wrap
    const cleanJson = textResponse.replace(/^```(json)?\n?/i, '').replace(/```$/i, '').trim();
    const parsed = JSON.parse(cleanJson);

    if (parsed.executiveSummary) {
      baseAppraisal.executiveSummary = parsed.executiveSummary;
    }
    if (Array.isArray(parsed.strengths) && parsed.strengths.length > 0) {
      baseAppraisal.strengths = parsed.strengths;
    }
    if (Array.isArray(parsed.riskFactors) && parsed.riskFactors.length > 0) {
      baseAppraisal.riskFactors = parsed.riskFactors;
    }
    if (Array.isArray(parsed.strategicRecommendations) && parsed.strategicRecommendations.length > 0) {
      baseAppraisal.strategicRecommendations = parsed.strategicRecommendations;
    }
    if (parsed.valuationFairMarketAdjustment && typeof parsed.valuationFairMarketAdjustment === 'number') {
      const adjusted = Math.round(baseAppraisal.valuationFairMarket * parsed.valuationFairMarketAdjustment);
      baseAppraisal.valuationFairMarket = adjusted;
      baseAppraisal.valuationLow = Math.round(adjusted * 0.84);
      baseAppraisal.valuationHigh = Math.round(adjusted * 1.20);
    }
    if (parsed.techDebtDiscountPercent && typeof parsed.techDebtDiscountPercent === 'number') {
      baseAppraisal.codeHealth.technicalDebtDiscountPercent = parsed.techDebtDiscountPercent;
      baseAppraisal.codeHealth.maintainabilityIndex = Math.max(70, 100 - parsed.techDebtDiscountPercent);
    }
    if (parsed.defensibilityMoatScore && typeof parsed.defensibilityMoatScore === 'number') {
      baseAppraisal.valuationBreakdown.defensibilityMoatScore = parsed.defensibilityMoatScore;
    }
    if (parsed.competitiveIntelligence) {
      if (Array.isArray(parsed.competitiveIntelligence.establishedIncumbents)) {
        baseAppraisal.valuationBreakdown.competitiveAudit.establishedIncumbents = parsed.competitiveIntelligence.establishedIncumbents;
      }
      if (Array.isArray(parsed.competitiveIntelligence.emergingRivals)) {
        baseAppraisal.valuationBreakdown.competitiveAudit.emergingRivals = parsed.competitiveIntelligence.emergingRivals;
      }
      if (parsed.competitiveIntelligence.threatLevel) {
        baseAppraisal.valuationBreakdown.competitiveAudit.threatLevel = parsed.competitiveIntelligence.threatLevel;
      }
      if (parsed.competitiveIntelligence.differentiationAnalysis) {
        baseAppraisal.valuationBreakdown.competitiveAudit.differentiationAnalysis = parsed.competitiveIntelligence.differentiationAnalysis;
      }
    }
  } catch (error) {
    console.warn("Gemini API call skipped or encountered error, using baseline algorithmic appraisal:", error);
  }

  return baseAppraisal;
}
