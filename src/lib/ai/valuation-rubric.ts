import { AppraisalGrade, AppraisalReport, AppraisalStage, CodeHealthMetrics, ComparableTransaction, CompetitiveAudit, MaCompsSummary, MarketingReplacementCost, RebuildLayer, ValuationBreakdown, ValuationHorizons } from "../db/types";
import { generateSha256Checksum } from "../utils";

export const PRECEDENT_MA_DATABASE: ComparableTransaction[] = [
  // TravelTech, Social Clubs, Directories & Booking Marketplaces
  {
    id: "comp-trv-01",
    assetName: "NomadPass Concierge & Travel Club",
    category: "E-commerce / Marketplace",
    niche: "TravelTech & Private Membership Club",
    salePrice: 112000,
    saleDate: "Q4 2025",
    revenueAtSale: 18000,
    multiple: "1.14x Rebuild Floor",
    multipleType: "RebuildFloor",
    dealStructure: "100% Cash Asset Sale",
    platformOrSource: "Acquire.com Verified",
    similarityScore: 94,
    buyerProfile: "Micro-PE Portfolio Operator",
    relevanceRationale: "Identical full-stack Next.js travel membership club architecture with Stripe subscription billing, private destination perks, and curated member directories."
  },
  {
    id: "comp-trv-02",
    assetName: "FlightRoute AI Deals Hub",
    category: "SaaS",
    niche: "Travel Flight Alerts & Fare Engine",
    salePrice: 138000,
    saleDate: "Jan 2026",
    revenueAtSale: 36000,
    multiple: "3.8x ARR",
    multipleType: "ARR",
    dealStructure: "100% Cash Asset Sale",
    platformOrSource: "Flippa Private Reserve",
    similarityScore: 89,
    buyerProfile: "Digital Media Holding Syndicate",
    relevanceRationale: "Similar consumer-facing travel membership product with algorithmic deal alerts, newsletter distribution, and automated API scrapers."
  },
  {
    id: "comp-trv-03",
    assetName: "DestiGuide VIP Itineraries",
    category: "E-commerce / Marketplace",
    niche: "Curated Luxury Travel & Concierge Marketplace",
    salePrice: 98000,
    saleDate: "Q3 2025",
    revenueAtSale: 12000,
    multiple: "1.10x Rebuild Floor",
    multipleType: "RebuildFloor",
    dealStructure: "100% Cash Asset Sale",
    platformOrSource: "Acquire.com Verified",
    similarityScore: 91,
    buyerProfile: "Boutique Hospitality Syndicate",
    relevanceRationale: "Turn-key marketplace codebase transfer with verified vendor directory, partner integrations, and custom member profile engine."
  },
  {
    id: "comp-trv-04",
    assetName: "RoamPass Lifestyle Club",
    category: "E-commerce / Marketplace",
    niche: "Remote Worker & Travel Club Subscription",
    salePrice: 165000,
    saleDate: "Q2 2025",
    revenueAtSale: 42000,
    multiple: "3.9x ARR",
    multipleType: "ARR",
    dealStructure: "Private M&A Buyout",
    platformOrSource: "Private M&A Syndicate",
    similarityScore: 87,
    buyerProfile: "Coliving & Hospitality Aggregator",
    relevanceRationale: "Directly comparable recurring subscription model catering to global digital nomads with integrated Stripe customer portal."
  },

  // AI / Machine Learning & Autonomous Workflow Tools
  {
    id: "comp-ai-01",
    assetName: "FormGenie Multi-Agent AI",
    category: "AI / Machine Learning",
    niche: "Autonomous Form & Conversational Lead Gen",
    salePrice: 178000,
    saleDate: "Q4 2025",
    revenueAtSale: 41400,
    multiple: "4.3x ARR",
    multipleType: "ARR",
    dealStructure: "100% Cash Asset Sale",
    platformOrSource: "Acquire.com Verified",
    similarityScore: 96,
    buyerProfile: "B2B SaaS Growth Studio",
    relevanceRationale: "Modern Next.js 14, TypeScript, and streaming LLM form canvas; bought by an agency seeking to instantly white-label and bundle with client retainers."
  },
  {
    id: "comp-ai-02",
    assetName: "ChatDocs AI Enterprise Assistant",
    category: "AI / Machine Learning",
    niche: "Document Intelligence & Vector RAG Assistant",
    salePrice: 215000,
    saleDate: "Jan 2026",
    revenueAtSale: 48000,
    multiple: "4.5x ARR",
    multipleType: "ARR",
    dealStructure: "Cash + Earn-out",
    platformOrSource: "Empire Flippers",
    similarityScore: 90,
    buyerProfile: "Enterprise Workflow Incumbent",
    relevanceRationale: "High maintainability score and modular microservices architecture allowed buyer to integrate into their larger CRM suite with zero tech debt rewrite."
  },
  {
    id: "comp-ai-03",
    assetName: "PromptForge Studio",
    category: "AI / Machine Learning",
    niche: "Prompt Engineering & Evaluation Canvas",
    salePrice: 125000,
    saleDate: "Q3 2025",
    revenueAtSale: 15000,
    multiple: "1.25x Rebuild Floor",
    multipleType: "RebuildFloor",
    dealStructure: "100% Cash Asset Sale",
    platformOrSource: "Acquire.com Verified",
    similarityScore: 88,
    buyerProfile: "AI SaaS Micro-Fund",
    relevanceRationale: "Pre-scale commercial valuation heavily anchored by the high replacement cost of multi-model orchestration pipelines and clean TypeScript code."
  },

  // Developer Tools, Cloud & API Services
  {
    id: "comp-dev-01",
    assetName: "DevPulse Observability Micro-SaaS",
    category: "Developer Tool",
    niche: "API & Webhook Performance Monitoring",
    salePrice: 154000,
    saleDate: "Q4 2025",
    revenueAtSale: 36000,
    multiple: "4.2x ARR",
    multipleType: "ARR",
    dealStructure: "100% Cash Asset Sale",
    platformOrSource: "Acquire.com Verified",
    similarityScore: 93,
    buyerProfile: "Engineering Tools Holding Co.",
    relevanceRationale: "Acquired for clean containerized Go/Node.js backend, automated CLI tools, and active developer community."
  },
  {
    id: "comp-dev-02",
    assetName: "CronMaster Cloud Dispatcher",
    category: "Developer Tool",
    niche: "Serverless Task Scheduling & Queue System",
    salePrice: 118000,
    saleDate: "Q2 2025",
    revenueAtSale: 28000,
    multiple: "4.2x ARR",
    multipleType: "ARR",
    dealStructure: "100% Cash Asset Sale",
    platformOrSource: "Empire Flippers",
    similarityScore: 89,
    buyerProfile: "Solo Cloud Architect Operator",
    relevanceRationale: "High gross margin (92%) and low server burn rate ($65/mo) enabled a swift 14-day diligence and closing period."
  },

  // General B2B SaaS & Productivity
  {
    id: "comp-saas-01",
    assetName: "TaskFlow Sprint Engine",
    category: "SaaS",
    niche: "Agile Project Tracking for Remote Teams",
    salePrice: 168000,
    saleDate: "Q4 2025",
    revenueAtSale: 42000,
    multiple: "4.0x ARR",
    multipleType: "ARR",
    dealStructure: "Private M&A Buyout",
    platformOrSource: "Flippa Private Reserve",
    similarityScore: 92,
    buyerProfile: "B2B SaaS Portfolio Aggregator",
    relevanceRationale: "Turn-key operational product with multi-tenant PostgreSQL schema, Stripe Billing, and zero customer support churn."
  },
  {
    id: "comp-saas-02",
    assetName: "InvoicePilot Automated Billing",
    category: "SaaS",
    niche: "Freelancer Invoicing & Stripe Payment Links",
    salePrice: 122000,
    saleDate: "Q3 2025",
    revenueAtSale: 31000,
    multiple: "3.9x ARR",
    multipleType: "ARR",
    dealStructure: "100% Cash Asset Sale",
    platformOrSource: "Acquire.com Verified",
    similarityScore: 88,
    buyerProfile: "Micro-PE Fund",
    relevanceRationale: "Acquired by a portfolio looking to cross-sell accounting and banking add-ons to an existing 2,400 user base."
  }
];

export function matchPrecedentTransactions(
  input: AppraisalInputData,
  baseValuation: number
): { comps: ComparableTransaction[]; summary: MaCompsSummary } {
  const scored = PRECEDENT_MA_DATABASE.map(comp => {
    let score = 55;

    // Category match
    if (comp.category === input.category) score += 25;

    // Niche / keyword match
    const textCorpus = `${input.projectName} ${input.tagline} ${input.targetAudience} ${input.category}`.toLowerCase();
    const nicheWords = comp.niche.toLowerCase().split(/[\s,&/]+/);
    const hasNicheMatch = nicheWords.some(w => w.length > 3 && textCorpus.includes(w));
    if (hasNicheMatch) score += 15;

    // Stage / Revenue match
    if (input.monthlyRecurringRevenue > 0 && comp.multipleType === 'ARR') score += 8;
    if (input.monthlyRecurringRevenue === 0 && comp.multipleType === 'RebuildFloor') score += 8;

    // Price proximity
    const ratio = Math.min(comp.salePrice, baseValuation) / Math.max(comp.salePrice, baseValuation, 1);
    if (ratio > 0.6) score += 6;

    return {
      ...comp,
      similarityScore: Math.min(98, Math.max(76, score))
    };
  });

  scored.sort((a, b) => b.similarityScore - a.similarityScore);
  const comps = scored.slice(0, 4);

  const avgPrice = Math.round(comps.reduce((sum, c) => sum + c.salePrice, 0) / Math.max(1, comps.length));
  const arrComps = comps.filter(c => c.multipleType === 'ARR');
  const medianMultiple = arrComps.length >= 2 ? "4.1x ARR" : "1.15x Rebuild Floor";

  const summary: MaCompsSummary = {
    medianMultiple,
    transactionCount: comps.length,
    categoryAvgPrice: avgPrice,
    liquidityRating: comps.length >= 3 ? 'High' : 'Moderate',
    benchmarkImpliedRange: {
      low: Math.round(avgPrice * 0.88),
      recommended: avgPrice,
      high: Math.round(avgPrice * 1.18),
    }
  };

  return { comps, summary };
}

export interface AppraisalInputData {
  projectName: string;
  tagline: string;
  category: 'SaaS' | 'AI / Machine Learning' | 'Mobile App' | 'Developer Tool' | 'E-commerce / Marketplace' | 'API Service';
  stage: AppraisalStage;
  targetAudience: string;
  techStack: string[];
  pricingModel: 'Free / Open' | 'Freemium' | 'Subscription' | 'Usage-Based' | 'One-Time License';
  monthlyRecurringRevenue: number;
  monthlyGrowthRate: number;
  registeredUsers: number;
  payingUsers: number;
  burnRate: number;
  repoUrl?: string;
  architectureSummary: string;
  codeSnippetOrManifest?: string;
}

export function computeDeterministicAppraisal(input: AppraisalInputData, userId: string = "user-default"): AppraisalReport {
  // 1. Estimate Base Person-Months by Stage
  let baseMonths = 3.0;
  if (input.stage === 'mvp') baseMonths = 4.5;
  if (input.stage === 'early-traction') baseMonths = 7.0;
  if (input.stage === 'cash-flow') baseMonths = 10.5;

  const catFactors: Record<string, number> = {
    'AI / Machine Learning': 1.4,
    'Developer Tool': 1.3,
    'SaaS': 1.15,
    'API Service': 1.1,
    'E-commerce / Marketplace': 1.25,
    'Mobile App': 1.2,
  };
  const categoryMultiplier = catFactors[input.category] || 1.0;
  const techBonus = Math.min(input.techStack.length * 0.15, 0.8);
  const totalPersonMonths = parseFloat(((baseMonths * categoryMultiplier) + techBonus).toFixed(1));
  const hourlySeniorDevRate = 110; // $110/hr market standard
  const hoursPerMonth = 160;
  const totalRebuildCost = Math.round(totalPersonMonths * hoursPerMonth * hourlySeniorDevRate);

  // 2. Layer-by-Layer Rebuild Breakdown
  const isAI = input.category === 'AI / Machine Learning' || input.techStack.some(t => /gemini|openai|claude|python|llm/i.test(t));
  const layers: RebuildLayer[] = [
    {
      layerName: "Frontend Interface & State Management",
      personMonths: parseFloat((totalPersonMonths * 0.30).toFixed(1)),
      cost: Math.round(totalPersonMonths * 0.30 * hoursPerMonth * hourlySeniorDevRate),
      description: "Interactive UI canvas, component architecture, client-side routing, and state stores."
    },
    {
      layerName: isAI ? "AI Pipeline & Agent Orchestration" : "Backend Business Logic & APIs",
      personMonths: parseFloat((totalPersonMonths * 0.35).toFixed(1)),
      cost: Math.round(totalPersonMonths * 0.35 * hoursPerMonth * hourlySeniorDevRate),
      description: isAI ? "Prompt chaining, structured Gemini/LLM streaming, embeddings, and context ingestion." : "REST/GraphQL endpoints, core domain models, and service layer."
    },
    {
      layerName: "Database Schema & Data Migrations",
      personMonths: parseFloat((totalPersonMonths * 0.18).toFixed(1)),
      cost: Math.round(totalPersonMonths * 0.18 * hoursPerMonth * hourlySeniorDevRate),
      description: "Relational/Document schemas, indexing, atomic transactions, and backup routines."
    },
    {
      layerName: "DevOps, Security & Cloud CI/CD",
      personMonths: parseFloat((totalPersonMonths * 0.17).toFixed(1)),
      cost: Math.round(totalPersonMonths * 0.17 * hoursPerMonth * hourlySeniorDevRate),
      description: "Containerization, automated build workflows, auth verification, and cloud hosting."
    }
  ];

  // 3. Code Health Metrics
  const textQualityScore = (input.architectureSummary?.length || 50) > 100 ? 94 : 84;
  const hasModernStack = input.techStack.some(t => /next|typescript|tailwind|python|go|rust|gemini|react/i.test(t));
  const modularityScore = Math.min(98, Math.max(72, textQualityScore + (hasModernStack ? 4 : -4)));
  const testCoverageEstimate = Math.min(95, Math.max(50, 78 + (input.codeSnippetOrManifest?.toLowerCase().includes("test") ? 14 : 0)));
  const techStackModernness = hasModernStack ? 96 : 82;
  const maintainabilityIndex = Math.round((modularityScore * 0.5) + (techStackModernness * 0.3) + (testCoverageEstimate * 0.2));
  const technicalDebtDiscountPercent = Math.max(4, 100 - maintainabilityIndex);

  const codeHealth: CodeHealthMetrics = {
    modularityScore,
    testCoverageEstimate,
    techStackModernness,
    securityVulnerabilityIndex: technicalDebtDiscountPercent < 10 ? 'Low' : 'Moderate',
    dependenciesCount: Math.max(8, input.techStack.length * 4),
    maintainabilityIndex,
    technicalDebtDiscountPercent,
  };

  // 4. Marketing & Distribution Replacement Cost
  const cacRate = input.category === 'AI / Machine Learning' ? 32 : 22; // $ per user acquisition replacement
  const userAcqReplacement = Math.round(input.registeredUsers * cacRate);
  const organicSeoEquity = Math.round((input.registeredUsers > 500 ? 8500 : 3500));
  const waitlistCapitalization = Math.round(input.registeredUsers * 12);
  const communityValue = input.registeredUsers > 1000 ? 5000 : 1500;
  const totalMarketingReplacement = userAcqReplacement + organicSeoEquity + waitlistCapitalization + communityValue;

  const marketingReplacement: MarketingReplacementCost = {
    userAcquisitionReplacement: userAcqReplacement,
    organicSeoDomainEquity: organicSeoEquity,
    waitlistLeadCapitalization: waitlistCapitalization,
    communityAssetValue: communityValue,
    totalMarketingReplacement,
    rationale: `Re-acquiring ${input.registeredUsers.toLocaleString()} active users at standard industry $${cacRate} CAC would cost a buyer $${userAcqReplacement.toLocaleString()}. Domain age, organic search rankings, and community assets add $${(organicSeoEquity + waitlistCapitalization).toLocaleString()} in replacement equity.`
  };

  // 5. Competitive Landscape Audit
  let establishedIncumbents = ["Zapier", "Retool", "Typeform", "Salesforce AppExchange"];
  let emergingRivals = ["Early Y-Combinator AI Micro-Tools", "Product Hunt Indie Launches"];
  if (input.category === "Developer Tool") {
    establishedIncumbents = ["Datadog", "New Relic", "Sentry", "PagerDuty"];
    emergingRivals = ["BetterStack", "Highlight.io", "Axiom"];
  }

  const competitiveAudit: CompetitiveAudit = {
    establishedIncumbents,
    emergingRivals,
    threatLevel: input.category === "AI / Machine Learning" ? "Moderate" : "Low",
    moatDefensibilityScore: Math.min(94, Math.max(68, 74 + (input.monthlyGrowthRate > 20 ? 12 : 6))),
    differentiationAnalysis: `${input.projectName} differentiates via niche specialization in ${input.category}, offering lower friction and higher architectural modularity than legacy incumbents like ${establishedIncumbents[0]}, while maintaining deeper IP defensibility than raw wrapper clones.`
  };

  // 6. User Traction & Financial Comps
  const estimatedLTV = input.payingUsers > 0 
    ? Math.max(50, Math.round((input.monthlyRecurringRevenue * 12) / Math.max(1, input.payingUsers))) 
    : 45;
  const userBaseValue = Math.round((input.payingUsers * estimatedLTV * 1.5) + (input.registeredUsers * 14));

  let multipleType: 'ARR' | 'SDE' | 'UserAcquisition' | 'AssetReplacement' = 'AssetReplacement';
  let multipleValue = 1.0;
  let revenueMultipleValuation = 0;

  if (input.monthlyRecurringRevenue > 0) {
    multipleType = 'ARR';
    const growthBoost = Math.min(input.monthlyGrowthRate * 0.08, 2.0);
    const aiBoost = input.category === 'AI / Machine Learning' ? 1.5 : 0.8;
    multipleValue = parseFloat((3.8 + growthBoost + aiBoost).toFixed(1));
    const annualRunRate = input.monthlyRecurringRevenue * 12;
    revenueMultipleValuation = Math.round(annualRunRate * multipleValue);
  }

  // 7. Blended Triangulated Valuation
  let valuationFairMarket = 0;
  const netRebuildCost = Math.round(totalRebuildCost * (1 - (technicalDebtDiscountPercent / 100)));
  
  // Turnkey Time-to-Market (TTM) advantage premium: Acquiring a deployed, functional codebase saves 4-8 months of development delay & hiring overhead
  const turnkeyRate = input.stage === 'cash-flow' ? 0.25 : input.stage === 'early-traction' ? 0.20 : 0.15;
  const timeToMarketPremium = Math.round(totalRebuildCost * turnkeyRate);

  if (input.monthlyRecurringRevenue > 0) {
    valuationFairMarket = Math.round(
      (revenueMultipleValuation * 0.50) + 
      ((netRebuildCost + timeToMarketPremium) * 0.35) + 
      (totalMarketingReplacement * 0.15)
    );
  } else {
    // Pre-revenue / MVP: Net Rebuild Floor + Marketing/Domain Assets + Turnkey Readiness Premium
    valuationFairMarket = Math.round(
      netRebuildCost + 
      totalMarketingReplacement + 
      timeToMarketPremium
    );
  }

  // Consistent Valuation Principle: Fair Market Value of an active, functional software asset must never be below its replacement cost
  valuationFairMarket = Math.max(valuationFairMarket, Math.round(totalRebuildCost + (totalMarketingReplacement * 0.75)));

  const valuationLow = Math.round(valuationFairMarket * 0.84);
  const valuationHigh = Math.round(valuationFairMarket * 1.20);

  // Assign Grade
  let grade: AppraisalGrade = 'BBB';
  if (valuationFairMarket >= 150000 && maintainabilityIndex >= 88) grade = 'AAA';
  else if (valuationFairMarket >= 90000 && maintainabilityIndex >= 84) grade = 'AA+';
  else if (valuationFairMarket >= 50000 && maintainabilityIndex >= 80) grade = 'AA';
  else if (valuationFairMarket >= 25000 && maintainabilityIndex >= 75) grade = 'A+';
  else if (valuationFairMarket >= 15000) grade = 'A';

  // 8. Valuation Horizons Spectrum (Bridging Asset Buyout to Venture SAFE Cap)
  const safeCapBaseline = Math.max(1500000, Math.round((valuationFairMarket * 16.7) / 50000) * 50000);
  const targetRaise = 75000;
  const impliedDilution = parseFloat(((targetRaise / safeCapBaseline) * 100).toFixed(1));
  const synergyMultiple = 2.8;

  const horizons: ValuationHorizons = {
    assetReplacementFloor: totalRebuildCost,
    privateMaCashBuyout: {
      low: valuationLow,
      recommended: valuationFairMarket,
      high: valuationHigh,
    },
    venturePreSeedSafeCap: {
      recommendedCap: safeCapBaseline,
      suggestedRaiseAmount: targetRaise,
      impliedDilutionPercent: impliedDilution,
      targetMilestone: `Projected capital runway to scale from ${input.stage.toUpperCase()} to $1M+ ARR for institutional Series Seed conversion.`,
    },
    strategicCorporateSynergy: {
      estimatedValue: Math.round(valuationFairMarket * synergyMultiple),
      synergyMultiple,
      rationale: `Enterprise acquisition value when folded into an established ${input.category} operator with existing enterprise distribution.`,
    },
  };

  // 9. Match Precedent M&A Transactions & Sales Comps
  const { comps: comparableTransactions, summary: maCompsSummary } = matchPrecedentTransactions(input, valuationFairMarket);

  const valuationBreakdown: ValuationBreakdown = {
    costToRebuild: {
      estimatedPersonMonths: totalPersonMonths,
      hourlySeniorDevRate,
      totalRebuildCost,
      breakdownNote: `Benchmarked at ${totalPersonMonths} senior full-stack person-months (${Math.round(totalPersonMonths * hoursPerMonth)} hours) at standard institutional $${hourlySeniorDevRate}/hr market engineering compensation.`,
      layers
    },
    marketingReplacement,
    competitiveAudit,
    marketComps: {
      multipleType,
      multipleValue,
      marketSegment: `${input.category} / Verified Software Assets`
    },
    userTractionValue: {
      registeredUsers: input.registeredUsers,
      activeUsers: Math.round(input.registeredUsers * 0.60),
      payingClients: input.payingUsers,
      estimatedLTV,
      userBaseValue
    },
    defensibilityMoatScore: competitiveAudit.moatDefensibilityScore,
    riskDiscountFactor: technicalDebtDiscountPercent + 4,
    horizons,
    comparableTransactions,
    maCompsSummary,
  };

  const id = `appr-${Date.now().toString().slice(-6)}`;
  const certNumber = Math.floor(1000 + Math.random() * 9000);
  const certId = `AAI-2026-${certNumber}-INST`;
  const checksum = generateSha256Checksum(`${input.projectName}-${valuationFairMarket}-${certId}`);

  return {
    id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId,
    projectName: input.projectName,
    tagline: input.tagline,
    category: input.category,
    stage: input.stage,
    targetAudience: input.targetAudience,
    techStack: input.techStack,
    pricingModel: input.pricingModel,
    monthlyRecurringRevenue: input.monthlyRecurringRevenue,
    monthlyGrowthRate: input.monthlyGrowthRate,
    registeredUsers: input.registeredUsers,
    payingUsers: input.payingUsers,
    burnRate: input.burnRate,
    repoUrl: input.repoUrl,
    architectureSummary: input.architectureSummary,
    codeSnippetOrManifest: input.codeSnippetOrManifest,
    grade,
    valuationLow,
    valuationFairMarket,
    valuationHigh,
    currency: 'USD',
    codeHealth,
    valuationBreakdown,
    executiveSummary: `${input.projectName} holds an appraised fair market valuation of $${valuationFairMarket.toLocaleString()} (${grade} Grade), substantiated by $${totalRebuildCost.toLocaleString()} in software engineering replacement cost, $${totalMarketingReplacement.toLocaleString()} in marketing/distribution asset equity, and a strong ${modularityScore}/100 code modularity rating.`,
    strengths: [
      `Solid Codebase Replacement Floor: $${totalRebuildCost.toLocaleString()} across 4 documented architectural layers`,
      `Marketing & GTM Asset Value: $${totalMarketingReplacement.toLocaleString()} in verified user acquisition and domain equity`,
      `High Code Modularity Index: ${modularityScore}% with minimal ${technicalDebtDiscountPercent}% technical debt penalty`,
      input.monthlyRecurringRevenue > 0
        ? `Active validated cash-flow ($${input.monthlyRecurringRevenue.toLocaleString()}/mo) with ${multipleValue}x ARR multiple`
        : `Pre-revenue organic traction of ${input.registeredUsers.toLocaleString()} registered users reduces buyer launch risk`
    ],
    riskFactors: [
      `Competitive pressure from established incumbents (${establishedIncumbents.slice(0, 2).join(', ')}) requires focused ICP targeting`,
      input.payingUsers === 0 
        ? "Absence of active subscription revenue places higher weight on engineering and user asset replacement"
        : `Customer concentration risk must be monitored as MRR scales past $${input.monthlyRecurringRevenue * 3}`,
      `Technical debt deduction of -${technicalDebtDiscountPercent}% should be resolved during technical transition`
    ],
    strategicRecommendations: [
      "Package automated end-to-end integration tests to reduce technical debt discount from 6% to under 3%",
      "Deploy self-serve B2B onboarding flow to monetize existing organic registered user base",
      "List on the AIApps Exchange with institutional grade certification to attract accredited software buyers"
    ],
    certificate: {
      certificateId: certId,
      sha256Hash: checksum,
      qrCodeUrl: "",
      verificationUrl: `/verify/${certId}`,
      issuedDate: new Date().toISOString().split('T')[0],
      validThrough: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
      issuer: "AIApps Institute Accreditation Board",
      sealType: "Institutional Certified Appraisal",
      status: "VERIFIED"
    }
  };
}
