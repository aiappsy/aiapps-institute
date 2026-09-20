export type AppraisalStage = 'idea' | 'mvp' | 'pre-revenue' | 'early-traction' | 'cash-flow';
export type AppraisalGrade = 'AAA' | 'AA+' | 'AA' | 'A+' | 'A' | 'BBB' | 'BB' | 'C';
export type VerificationStatus = 'VERIFIED' | 'REVOKED' | 'PENDING' | 'EXPIRED';

export interface CodeHealthMetrics {
  modularityScore: number; // 0 - 100
  testCoverageEstimate: number; // 0 - 100
  techStackModernness: number; // 0 - 100
  securityVulnerabilityIndex: 'Low' | 'Moderate' | 'Elevated' | 'High';
  dependenciesCount: number;
  maintainabilityIndex: number; // 0 - 100
  technicalDebtDiscountPercent: number; // e.g., 6%
}

export interface RebuildLayer {
  layerName: string; // e.g. "Frontend UI & Canvas", "Gemini AI Orchestrator"
  personMonths: number;
  cost: number;
  description: string;
}

export interface MarketingReplacementCost {
  userAcquisitionReplacement: number; // Active users * benchmark CAC
  organicSeoDomainEquity: number; // SEO backlink & domain age replacement
  waitlistLeadCapitalization: number; // Leads * $ per qualified lead
  communityAssetValue: number; // Discord/GitHub community value
  totalMarketingReplacement: number;
  rationale: string;
}

export interface CompetitiveAudit {
  establishedIncumbents: string[];
  emergingRivals: string[];
  threatLevel: 'Low' | 'Moderate' | 'High';
  moatDefensibilityScore: number; // 0 - 100
  differentiationAnalysis: string;
}

export interface ValuationBreakdown {
  costToRebuild: {
    estimatedPersonMonths: number;
    hourlySeniorDevRate: number; // e.g., $110/hr
    totalRebuildCost: number; // $
    breakdownNote: string;
    layers: RebuildLayer[];
  };
  marketingReplacement: MarketingReplacementCost;
  competitiveAudit: CompetitiveAudit;
  marketComps: {
    multipleType: 'ARR' | 'SDE' | 'UserAcquisition' | 'AssetReplacement';
    multipleValue: number; // e.g., 4.8x
    marketSegment: string;
  };
  userTractionValue: {
    registeredUsers: number;
    activeUsers: number;
    payingClients: number;
    estimatedLTV: number;
    userBaseValue: number; // $
  };
  defensibilityMoatScore: number; // 0 - 100
  riskDiscountFactor: number; // %
}

export interface AppraisalReport {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  projectName: string;
  tagline: string;
  category: 'SaaS' | 'AI / Machine Learning' | 'Mobile App' | 'Developer Tool' | 'E-commerce / Marketplace' | 'API Service';
  stage: AppraisalStage;
  targetAudience: string;
  techStack: string[];
  
  // Financial & Metrics Inputs
  pricingModel: 'Free / Open' | 'Freemium' | 'Subscription' | 'Usage-Based' | 'One-Time License';
  monthlyRecurringRevenue: number;
  monthlyGrowthRate: number; // %
  registeredUsers: number;
  payingUsers: number;
  burnRate: number;
  
  // Technical Inputs
  repoUrl?: string;
  architectureSummary: string;
  codeSnippetOrManifest?: string;

  // Valuation Outcomes
  grade: AppraisalGrade;
  valuationLow: number;
  valuationFairMarket: number;
  valuationHigh: number;
  currency: string; // USD
  
  codeHealth: CodeHealthMetrics;
  valuationBreakdown: ValuationBreakdown;
  
  executiveSummary: string;
  strengths: string[];
  riskFactors: string[];
  strategicRecommendations: string[];
  
  certificate: {
    certificateId: string;
    sha256Hash: string;
    qrCodeUrl: string;
    verificationUrl: string;
    issuedDate: string;
    validThrough: string;
    issuer: string;
    sealType: 'Institutional Certified Appraisal';
    status: VerificationStatus;
  };

  // Marketplace linkage
  isListedOnMarketplace?: boolean;
  marketplaceListingId?: string;
}

export interface MarketplaceListing {
  id: string;
  createdAt: string;
  appraisalId: string;
  sellerId: string;
  sellerName: string;
  sellerEmail: string;
  
  title: string;
  tagline: string;
  description: string;
  category: string;
  stage: AppraisalStage;
  techStack: string[];
  
  appraisedFairMarketValue: number;
  appraisedGrade: AppraisalGrade;
  askingPrice: number;
  isNegotiable: boolean;
  
  monthlyRevenue: number;
  monthlyUsers: number;
  includedAssets: string[];
  
  status: 'ACTIVE' | 'UNDER_OFFER' | 'SOLD' | 'ARCHIVED';
  moderationStatus?: 'APPROVED' | 'PENDING_REVIEW' | 'FLAGGED' | 'DELISTED';
  isFeatured?: boolean;
  verifiedCertificateId: string;
  verificationCode: string;
  dealRoomRequestsCount: number;
  viewsCount: number;
}

export interface MarketplaceOffer {
  id: string;
  listingId: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  offerAmount: number;
  message: string;
  createdAt: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'COUNTERED';
  counterAmount?: number;
}

export interface MarketplaceMessage {
  id: string;
  listingId: string;
  senderName: string;
  senderEmail: string;
  senderRole: 'BUYER' | 'SELLER';
  content: string;
  createdAt: string;
}

export interface SignedNDA {
  id: string;
  listingId: string;
  listingTitle: string;
  buyerEmail: string;
  buyerName: string;
  signedAt: string;
  ndaHash: string;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  organization?: string;
  avatarUrl?: string;
  activeRole: 'APPRAISALS_ONLY' | 'SELLER' | 'BUYER' | 'ADMIN';
  appraisalCredits: number;
  isKycVerified?: boolean;
  isAccreditedBuyer?: boolean;
  status?: 'ACTIVE' | 'SUSPENDED';
  totalTransactionsVolume?: number;
  payoutMethod?: {
    type: 'stripe_connect' | 'paypal';
    accountEmail: string;
    status: 'ACTIVE' | 'PENDING';
  };
  buyerPreferences?: {
    targetBudgetMax: number;
    preferredCategories: string[];
    ndaSignedListings: string[];
  };
  createdAt: string;
}

export interface TransactionRecord {
  id: string;
  listingId: string;
  listingTitle: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  sellerId: string;
  sellerName: string;
  sellerEmail: string;
  grossAmount: number;
  platformFeePercent: number; // 5.0
  platformFeeAmount: number; // grossAmount * 0.05
  netSellerPayout: number; // grossAmount * 0.95
  status: 'IN_ESCROW' | 'INSPECTION_PERIOD' | 'PAYOUT_RELEASED' | 'REFUNDED' | 'DISPUTED';
  escrowPhase: 1 | 2 | 3 | 4;
  inspectionDeadline: string;
  paymentMethod: 'STRIPE_ESCROW' | 'PAYPAL_VAULT' | 'DIRECT_WIRE';
  createdAt: string;
  disbursedAt?: string;
  notes?: string;
}

export interface PlatformParameters {
  seniorHourlyRate: number; // default $105
  hoursPerPersonMonth: number; // default 160
  aiComplexityMultiplier: number; // 1.4x
  devToolsMultiplier: number; // 1.3x
  saasMultiplier: number; // 1.15x
  cacUserValueRate: number; // default $24 per active user
  leadValuationRate: number; // default $12 per verified lead
  certificateValidityDays: number; // 365
  platformTakeRatePercent: number; // default 5%
}
