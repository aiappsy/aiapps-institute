import { AppraisalReport, MarketplaceListing, MarketplaceMessage, MarketplaceOffer, PlatformParameters, SignedNDA, TransactionRecord, UserProfile } from "./types";

const INITIAL_APPRAISALS: AppraisalReport[] = [
  {
    id: "appr-882194",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    userId: "user-default",
    projectName: "NeuralForm AI",
    tagline: "Autonomous multi-agent form builder with conversational lead qualification",
    category: "AI / Machine Learning",
    stage: "early-traction",
    targetAudience: "B2B SaaS marketers and sales development reps",
    techStack: ["Next.js 14", "TypeScript", "Tailwind CSS", "Gemini 3.8 Flash", "PostgreSQL", "Prisma"],
    pricingModel: "Subscription",
    monthlyRecurringRevenue: 3450,
    monthlyGrowthRate: 18.5,
    registeredUsers: 1820,
    payingUsers: 74,
    burnRate: 420,
    architectureSummary: "Clean Hexagonal / Clean Architecture. Fully decoupling the AI prompt orchestrator, webhook ingestion pipeline, and front-end schema renderer. 94% TypeScript strict typing.",
    codeSnippetOrManifest: "package.json dependencies: @google/genai, next, tailwindcss, lucide-react. Zero critical CVEs.",
    grade: "AAA",
    valuationLow: 145000,
    valuationFairMarket: 168000,
    valuationHigh: 195000,
    currency: "USD",
    codeHealth: {
      modularityScore: 94,
      testCoverageEstimate: 82,
      techStackModernness: 98,
      securityVulnerabilityIndex: "Low",
      dependenciesCount: 22,
      maintainabilityIndex: 91,
      technicalDebtDiscountPercent: 6,
    },
    valuationBreakdown: {
      costToRebuild: {
        estimatedPersonMonths: 8.5,
        hourlySeniorDevRate: 110,
        totalRebuildCost: 149600,
        breakdownNote: "Calculated based on 1,360 senior engineering hours for real-time form canvas, streaming Gemini LLM agents, and enterprise webhook integrations.",
        layers: [
          {
            layerName: "Interactive Canvas & UI Renderer",
            personMonths: 2.5,
            cost: 44000,
            description: "Drag-and-drop form canvas, dynamic conversational widgets, and client-side validation logic."
          },
          {
            layerName: "Gemini AI Agent & Prompt Pipeline",
            personMonths: 3.0,
            cost: 52800,
            description: "Multi-agent intent parser, adaptive question sequencing, and streaming response handlers."
          },
          {
            layerName: "Webhook & Relational Data Layer",
            personMonths: 1.8,
            cost: 31680,
            description: "PostgreSQL schemas, Prisma ORM queries, Zapier/webhook event dispatchers, and rate limiting."
          },
          {
            layerName: "DevOps & Cloud Run Infrastructure",
            personMonths: 1.2,
            cost: 21120,
            description: "Google Cloud Run container orchestration, automated CI/CD pipeline, and Stripe billing."
          }
        ]
      },
      marketingReplacement: {
        userAcquisitionReplacement: 43680,
        organicSeoDomainEquity: 9500,
        waitlistLeadCapitalization: 21840,
        communityAssetValue: 6000,
        totalMarketingReplacement: 81020,
        rationale: "Re-acquiring 1,820 active B2B users at current market CAC ($24) would cost $43,680. Domain age and 80+ organic backlinks represent $9,500 in equity."
      },
      competitiveAudit: {
        establishedIncumbents: ["Typeform", "Jotform", "HubSpot Forms"],
        emergingRivals: ["Tally", "Fillout AI", "Reform"],
        threatLevel: "Moderate",
        moatDefensibilityScore: 88,
        differentiationAnalysis: "Superior to legacy incumbents via autonomous multi-turn AI reasoning, and more defensible than simple wrapper forms due to deep webhook integration and custom schema state stores."
      },
      marketComps: {
        multipleType: "ARR",
        multipleValue: 4.8,
        marketSegment: "AI Workflow Automation / MarTech"
      },
      userTractionValue: {
        registeredUsers: 1820,
        activeUsers: 940,
        payingClients: 74,
        estimatedLTV: 560,
        userBaseValue: 41440
      },
      defensibilityMoatScore: 88,
      riskDiscountFactor: 8
    },
    executiveSummary: "NeuralForm AI exemplifies institutional-grade codebase craftsmanship. The combination of high modularity, minimal external dependencies, and proven pre-seed ARR places it in the upper 95th percentile of surveyed AI MVPs.",
    strengths: [
      "Superior code modularity with zero tightly-coupled vendor lock-in",
      "Profitable unit economics: $420 burn against $3,450 MRR",
      "High LTV to CAC ratio with 18.5% month-over-month organic expansion",
      "Extensive end-to-end test suite covering critical form submission pipelines"
    ],
    riskFactors: [
      "Dependency on foundational LLM latency without multi-provider fallback",
      "Key person dependency on solo founder for infrastructure maintenance"
    ],
    strategicRecommendations: [
      "Implement multi-provider fallback routing (Gemini + Claude/OpenAI) to eliminate single API risk",
      "Package enterprise SSO (SAML/Okta) to unlock $10k+ ACV contract tier",
      "Publish public benchmark case studies to accelerate self-serve conversion"
    ],
    certificate: {
      certificateId: "AAI-2026-8821-INST",
      sha256Hash: "sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
      qrCodeUrl: "",
      verificationUrl: "/verify/AAI-2026-8821-INST",
      issuedDate: "2026-09-17",
      validThrough: "2027-09-17",
      issuer: "AIApps Institute Accreditation Board",
      sealType: "Institutional Certified Appraisal",
      status: "VERIFIED"
    },
    isListedOnMarketplace: true,
    marketplaceListingId: "list-101"
  },
  {
    id: "appr-441920",
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    userId: "user-dev-2",
    projectName: "DevPulse MicroMonitor",
    tagline: "Lightweight, zero-config observability daemon for distributed edge workers",
    category: "Developer Tool",
    stage: "mvp",
    targetAudience: "Indie hackers and engineering teams deploying to Cloudflare Workers / Fly.io",
    techStack: ["Go (Golang)", "React", "Tailwind CSS", "SQLite / Turso", "WebSockets"],
    pricingModel: "Freemium",
    monthlyRecurringRevenue: 0,
    monthlyGrowthRate: 35.0,
    registeredUsers: 640,
    payingUsers: 0,
    burnRate: 45,
    architectureSummary: "Ultra-low memory footprint Go daemon compiled to single binary. Sub-5ms metric ingestion. Clean embedded SQLite database schema with WAL mode enabled.",
    codeSnippetOrManifest: "go.mod with minimal standard library dependencies. 89% unit test coverage on daemon heartbeat protocol.",
    grade: "AA+",
    valuationLow: 48000,
    valuationFairMarket: 56000,
    valuationHigh: 68000,
    currency: "USD",
    codeHealth: {
      modularityScore: 96,
      testCoverageEstimate: 89,
      techStackModernness: 95,
      securityVulnerabilityIndex: "Low",
      dependenciesCount: 8,
      maintainabilityIndex: 94,
      technicalDebtDiscountPercent: 4,
    },
    valuationBreakdown: {
      costToRebuild: {
        estimatedPersonMonths: 4.0,
        hourlySeniorDevRate: 115,
        totalRebuildCost: 73600,
        breakdownNote: "Calculated based on 640 engineering hours of senior systems/Go programming for cross-platform binary daemon and real-time frontend dashboard.",
        layers: [
          { layerName: "Go Ingestion Engine & Heartbeat Protocol", personMonths: 2.2, cost: 40480, description: "Concurrent Go routines, socket buffers, and zero-allocation metric collectors." },
          { layerName: "React Observability Dashboard", personMonths: 1.2, cost: 22080, description: "Real-time edge graph renders, latency heatmaps, and tail alert triggers." },
          { layerName: "Embedded SQLite / Turso Storage", personMonths: 0.6, cost: 11040, description: "Time-series compaction algorithms and WAL mode sync." }
        ]
      },
      marketingReplacement: {
        userAcquisitionReplacement: 15360,
        organicSeoDomainEquity: 4500,
        waitlistLeadCapitalization: 7680,
        communityAssetValue: 3500,
        totalMarketingReplacement: 31040,
        rationale: "Active developer community with 640 organic installations across 80+ engineering teams."
      },
      competitiveAudit: {
        establishedIncumbents: ["Datadog", "New Relic", "Sentry"],
        emergingRivals: ["BetterStack", "Highlight.io", "Axiom"],
        threatLevel: "Low",
        moatDefensibilityScore: 82,
        differentiationAnalysis: "Targeted sub-5ms footprint with zero cloud agent installation friction."
      },
      marketComps: {
        multipleType: "AssetReplacement",
        multipleValue: 1.0,
        marketSegment: "Developer Infrastructure & Edge Observability"
      },
      userTractionValue: {
        registeredUsers: 640,
        activeUsers: 310,
        payingClients: 0,
        estimatedLTV: 180,
        userBaseValue: 15500
      },
      defensibilityMoatScore: 79,
      riskDiscountFactor: 12
    },
    executiveSummary: "A rare pre-revenue asset with institutional-caliber software engineering. Written in idiomatic Go with zero external runtime bloat.",
    strengths: [
      "Extremely clean, robust Go codebase with near-zero technical debt",
      "Highly active open-source / free user base with 310 weekly active developers",
      "Negligible operational infrastructure costs ($45/month)"
    ],
    riskFactors: [
      "Zero revenue to date; monetization mechanics remain untested",
      "Documentation focuses heavily on CLI, lacking self-serve web onboarding"
    ],
    strategicRecommendations: [
      "Introduce a $19/mo 'Team Pro' tier with 30-day metric retention",
      "Submit to Product Hunt and Hacker News Show to convert the 640 users into paying subscribers"
    ],
    certificate: {
      certificateId: "AAI-2026-4419-INST",
      sha256Hash: "sha256:3a18e3989c099c0d66212502636253457e7826284f18d09995574c8322646c24",
      qrCodeUrl: "",
      verificationUrl: "/verify/AAI-2026-4419-INST",
      issuedDate: "2026-09-14",
      validThrough: "2027-09-14",
      issuer: "AIApps Institute Accreditation Board",
      sealType: "Institutional Certified Appraisal",
      status: "VERIFIED"
    },
    isListedOnMarketplace: true,
    marketplaceListingId: "list-102"
  },
  {
    id: "appr-319082",
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    userId: "user-mobile-1",
    projectName: "ZenithPulse Mobile",
    tagline: "React Native iOS & Android circadian rhythm and longevity biomarker tracker",
    category: "Mobile App",
    stage: "mvp",
    targetAudience: "Biohackers, endurance athletes, and health optimization enthusiasts",
    techStack: ["React Native", "Expo", "TypeScript", "HealthKit / Google Fit API", "SQLite"],
    pricingModel: "Freemium",
    monthlyRecurringRevenue: 0,
    monthlyGrowthRate: 28.0,
    registeredUsers: 420,
    payingUsers: 0,
    burnRate: 25,
    architectureSummary: "Clean decoupled React Native with Expo SDK 51. Direct offline-first synchronization with Apple HealthKit and Google Health Connect. 0 backend server dependencies.",
    codeSnippetOrManifest: "package.json with expo-health-connect, react-native-svg, and zustand store.",
    grade: "A",
    valuationLow: 23000,
    valuationFairMarket: 28000,
    valuationHigh: 34000,
    currency: "USD",
    codeHealth: {
      modularityScore: 88,
      testCoverageEstimate: 74,
      techStackModernness: 92,
      securityVulnerabilityIndex: "Low",
      dependenciesCount: 16,
      maintainabilityIndex: 86,
      technicalDebtDiscountPercent: 8,
    },
    valuationBreakdown: {
      costToRebuild: {
        estimatedPersonMonths: 2.2,
        hourlySeniorDevRate: 105,
        totalRebuildCost: 36960,
        breakdownNote: "Calculated based on 352 hours of senior mobile React Native development for dual HealthKit/Google Fit syncing and smooth 60fps charting.",
        layers: [
          { layerName: "HealthKit / Google Fit Native Ingestion", personMonths: 1.0, cost: 16800, description: "Bi-directional health data bridge and sleep cycle analysis." },
          { layerName: "React Native UI & 60fps Canvas", personMonths: 0.8, cost: 13440, description: "Smooth dark/light mode mobile design and circadian dial widgets." },
          { layerName: "Offline-First Local SQLite Store", personMonths: 0.4, cost: 6720, description: "Encrypted on-device health record storage without cloud leak risk." }
        ]
      },
      marketingReplacement: {
        userAcquisitionReplacement: 10080,
        organicSeoDomainEquity: 2500,
        waitlistLeadCapitalization: 5040,
        communityAssetValue: 2000,
        totalMarketingReplacement: 19620,
        rationale: "420 active TestFlight / Android beta users with 4.8 star internal feedback."
      },
      competitiveAudit: {
        establishedIncumbents: ["Whoop", "Oura Ring App", "AutoSleep"],
        emergingRivals: ["Rise Science", "Athlytic"],
        threatLevel: "Moderate",
        moatDefensibilityScore: 76,
        differentiationAnalysis: "Zero recurring hardware fee requirement; functions purely from on-device sensor data."
      },
      marketComps: {
        multipleType: "AssetReplacement",
        multipleValue: 1.0,
        marketSegment: "Mobile HealthTech / Longevity MVPs"
      },
      userTractionValue: {
        registeredUsers: 420,
        activeUsers: 280,
        payingClients: 0,
        estimatedLTV: 60,
        userBaseValue: 12000
      },
      defensibilityMoatScore: 76,
      riskDiscountFactor: 14
    },
    executiveSummary: "A clean, turnkey mobile MVP ready for the Apple App Store and Google Play. Complete HealthKit and Google Health Connect integrations eliminate months of native permissions engineering.",
    strengths: [
      "Ready-to-publish dual platform (iOS & Android) mobile app",
      "Zero server bills ($25/mo) due to on-device privacy-first architecture",
      "High retention in 420-person closed beta"
    ],
    riskFactors: [
      "Pre-launch on public app stores; requires buyer to submit under their Apple/Google developer accounts"
    ],
    strategicRecommendations: [
      "Implement $4.99/mo premium paywall with RevenueCat before App Store launch"
    ],
    certificate: {
      certificateId: "AAI-2026-3190-INST",
      sha256Hash: "sha256:9b12a884f009b173e21820984cfb77621984218a0029b37c66152",
      qrCodeUrl: "",
      verificationUrl: "/verify/AAI-2026-3190-INST",
      issuedDate: "2026-09-12",
      validThrough: "2027-09-12",
      issuer: "AIApps Institute Accreditation Board",
      sealType: "Institutional Certified Appraisal",
      status: "VERIFIED"
    },
    isListedOnMarketplace: true,
    marketplaceListingId: "list-103"
  }
];

const INITIAL_LISTINGS: MarketplaceListing[] = [
  {
    id: "list-101",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    appraisalId: "appr-882194",
    sellerId: "user-default",
    sellerName: "Paul Founder",
    sellerEmail: "founder@aiappsinstitute.com",
    title: "NeuralForm AI - Autonomous Form Agent Platform",
    tagline: "AI conversational forms with $3,450 MRR and 1,820 active leads",
    description: "Built with Next.js 14, TypeScript, and Google Gemini. Generates interactive conversational forms dynamically. Backed by an official AAA Grade Institutional Appraisal ($168k Fair Market Value). Owner seeking exit to focus on another venture.",
    category: "AI / Machine Learning",
    stage: "early-traction",
    techStack: ["Next.js 14", "TypeScript", "Tailwind CSS", "Gemini 3.8 Flash", "PostgreSQL"],
    appraisedFairMarketValue: 168000,
    appraisedGrade: "AAA",
    askingPrice: 149000,
    isNegotiable: true,
    monthlyRevenue: 3450,
    monthlyUsers: 1820,
    includedAssets: [
      "Complete Source Code & Git Repository",
      "Production Cloud Run & Vercel Deployment Setup",
      "Stripe Customer Base & Active Subscriptions ($3,450 MRR)",
      "Premium NeuralForm.ai Domain Name & Brand Kit",
      "30 Days Post-Sale Founder Engineering Support"
    ],
    status: "ACTIVE",
    verifiedCertificateId: "AAI-2026-8821-INST",
    verificationCode: "AAI-2026-8821-INST",
    dealRoomRequestsCount: 14,
    viewsCount: 382
  },
  {
    id: "list-102",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    appraisalId: "appr-441920",
    sellerId: "user-dev-2",
    sellerName: "Elena Rostova",
    sellerEmail: "elena@devpulse.io",
    title: "DevPulse MicroMonitor - Edge Worker Daemon",
    tagline: "Ultra-fast Go daemon with 640 active developers. $0 MRR, $73k rebuild cost.",
    description: "High-performance Go systems codebase with sub-5ms heartbeat tracking. Certified AA+ by AIApps Institute. Asset replacement cost estimated at $73,600. Asking $45,000 for quick sale. Turnkey asset ready for monetization.",
    category: "Developer Tool",
    stage: "mvp",
    techStack: ["Go (Golang)", "React", "Tailwind CSS", "SQLite", "WebSockets"],
    appraisedFairMarketValue: 56000,
    appraisedGrade: "AA+",
    askingPrice: 45000,
    isNegotiable: true,
    monthlyRevenue: 0,
    monthlyUsers: 640,
    includedAssets: [
      "All Go Daemon Source Code & React Dashboard",
      "Compiled Cross-Platform Binaries (Mac, Linux, Windows)",
      "Registered User Database (640 developers)",
      "DevPulse.io Domain & Documentation Site",
      "14 Days Technical Handover"
    ],
    status: "ACTIVE",
    verifiedCertificateId: "AAI-2026-4419-INST",
    verificationCode: "AAI-2026-4419-INST",
    dealRoomRequestsCount: 9,
    viewsCount: 247
  },
  {
    id: "list-103",
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    appraisalId: "appr-319082",
    sellerId: "user-mobile-1",
    sellerName: "Marcus Thorne",
    sellerEmail: "marcus@zenithpulse.app",
    title: "ZenithPulse Mobile - Longevity & Sleep Tracker",
    tagline: "Turnkey React Native iOS/Android app with HealthKit & Google Fit integration. $28k Appraised Value.",
    description: "Tested across 420 beta users with zero server overhead. Clean Expo 51 code. Valued at $28,000 baseline replacement cost, priced at $22,000 for rapid acquisition.",
    category: "Mobile App",
    stage: "mvp",
    techStack: ["React Native", "Expo", "TypeScript", "HealthKit", "Google Fit API"],
    appraisedFairMarketValue: 28000,
    appraisedGrade: "A",
    askingPrice: 22000,
    isNegotiable: true,
    monthlyRevenue: 0,
    monthlyUsers: 420,
    includedAssets: [
      "Full React Native & Expo Codebase",
      "iOS & Android App Store Configuration Assets",
      "TestFlight Beta Distribution & 420 Tester Base",
      "ZenithPulse.app Domain Name",
      "Figma UI/UX Component System"
    ],
    status: "ACTIVE",
    verifiedCertificateId: "AAI-2026-3190-INST",
    verificationCode: "AAI-2026-3190-INST",
    dealRoomRequestsCount: 6,
    viewsCount: 189
  }
];

const INITIAL_OFFERS: MarketplaceOffer[] = [
  {
    id: "off-501",
    listingId: "list-101",
    buyerId: "buyer-alpha",
    buyerName: "VentureCraft Capital",
    buyerEmail: "deals@venturecraft.io",
    offerAmount: 140000,
    message: "We reviewed the AIApps Institute AAA Grade appraisal report and would like to move forward under standard 14-day technical due diligence and Stripe escrow.",
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    status: "PENDING"
  }
];

const INITIAL_MESSAGES: MarketplaceMessage[] = [
  {
    id: "msg-101",
    listingId: "list-101",
    senderName: "VentureCraft Capital",
    senderEmail: "deals@venturecraft.io",
    senderRole: "BUYER",
    content: "Hi Paul, we reviewed the AAA appraisal. Can you confirm if the Google Cloud Run infrastructure is transferable in 1 click?",
    createdAt: new Date(Date.now() - 86400000 * 1.5).toISOString()
  },
  {
    id: "msg-102",
    listingId: "list-101",
    senderName: "Paul Founder",
    senderEmail: "founder@aiappsinstitute.com",
    senderRole: "SELLER",
    content: "Yes! It is fully containerized with Docker and terraform scripts. Transfer takes under 30 minutes.",
    createdAt: new Date(Date.now() - 86400000 * 1.2).toISOString()
  }
];

const INITIAL_NDAS: SignedNDA[] = [
  {
    id: "nda-801",
    listingId: "list-101",
    listingTitle: "NeuralForm AI - Autonomous Form Agent Platform",
    buyerEmail: "deals@venturecraft.io",
    buyerName: "VentureCraft Capital",
    signedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    ndaHash: "sha256:nda_902183e9b1029c78"
  }
];

const INITIAL_TRANSACTIONS: TransactionRecord[] = [
  {
    id: "tx-901",
    listingId: "list-101",
    listingTitle: "NeuralForm AI - Autonomous Form Agent Platform",
    buyerId: "buyer-alpha",
    buyerName: "VentureCraft Capital (Sarah Lin)",
    buyerEmail: "deals@venturecraft.io",
    sellerId: "user-default",
    sellerName: "Paul Founder",
    sellerEmail: "founder@aiappsinstitute.com",
    grossAmount: 140000,
    platformFeePercent: 5.0,
    platformFeeAmount: 7000,
    netSellerPayout: 133000,
    status: "INSPECTION_PERIOD",
    escrowPhase: 2,
    inspectionDeadline: new Date(Date.now() + 86400000 * 6.5).toISOString(),
    paymentMethod: "STRIPE_ESCROW",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    notes: "Phase 1 deposit verified. Git org transfer invite pending buyer acceptance."
  },
  {
    id: "tx-902",
    listingId: "list-102",
    listingTitle: "DevPulse MicroMonitor - Edge Worker Daemon",
    buyerId: "buyer-alpha",
    buyerName: "Apex Holdings LLC",
    buyerEmail: "acquisitions@apexholdings.tech",
    sellerId: "user-dev-2",
    sellerName: "Elena Rostova",
    sellerEmail: "elena@devpulse.io",
    grossAmount: 45000,
    platformFeePercent: 5.0,
    platformFeeAmount: 2250,
    netSellerPayout: 42750,
    status: "IN_ESCROW",
    escrowPhase: 1,
    inspectionDeadline: new Date(Date.now() + 86400000 * 12).toISOString(),
    paymentMethod: "DIRECT_WIRE",
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    notes: "Wire received in institute custody vault. Bilateral APA countersigned."
  },
  {
    id: "tx-898",
    listingId: "list-103",
    listingTitle: "CloudMetrics MicroTelemetry SDK",
    buyerId: "buyer-nordic",
    buyerName: "Nordic Ventures AB",
    buyerEmail: "invest@nordicventures.se",
    sellerId: "user-mobile-1",
    sellerName: "Marcus Thorne",
    sellerEmail: "marcus@zenithpulse.app",
    grossAmount: 28000,
    platformFeePercent: 5.0,
    platformFeeAmount: 1400,
    netSellerPayout: 26600,
    status: "PAYOUT_RELEASED",
    escrowPhase: 4,
    inspectionDeadline: new Date(Date.now() - 86400000 * 5).toISOString(),
    paymentMethod: "STRIPE_ESCROW",
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    disbursedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    notes: "Disbursement completed via Stripe Connect. 100% code artifacts verified."
  }
];

const INITIAL_USERS: UserProfile[] = [
  {
    id: "user-default",
    email: "founder@aiappsinstitute.com",
    displayName: "Paul Founder",
    organization: "Institute Alpha Labs",
    activeRole: "SELLER",
    appraisalCredits: 5,
    isKycVerified: true,
    isAccreditedBuyer: true,
    status: "ACTIVE",
    totalTransactionsVolume: 140000,
    payoutMethod: {
      type: "stripe_connect",
      accountEmail: "founder@aiappsinstitute.com",
      status: "ACTIVE"
    },
    buyerPreferences: {
      targetBudgetMax: 250000,
      preferredCategories: ["AI / Machine Learning", "Developer Tool", "SaaS", "Mobile App"],
      ndaSignedListings: ["list-101"]
    },
    createdAt: new Date(Date.now() - 86400000 * 45).toISOString(),
  },
  {
    id: "buyer-alpha",
    email: "deals@venturecraft.io",
    displayName: "Sarah Lin",
    organization: "VentureCraft Capital",
    activeRole: "BUYER",
    appraisalCredits: 14,
    isKycVerified: true,
    isAccreditedBuyer: true,
    status: "ACTIVE",
    totalTransactionsVolume: 420000,
    buyerPreferences: {
      targetBudgetMax: 500000,
      preferredCategories: ["AI / Machine Learning", "Developer Tool", "Fintech"],
      ndaSignedListings: ["list-101", "list-102"]
    },
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
  {
    id: "user-dev-2",
    email: "elena@devpulse.io",
    displayName: "Elena Rostova",
    organization: "DevPulse Systems",
    activeRole: "SELLER",
    appraisalCredits: 2,
    isKycVerified: true,
    isAccreditedBuyer: false,
    status: "ACTIVE",
    totalTransactionsVolume: 45000,
    payoutMethod: {
      type: "paypal",
      accountEmail: "payouts@devpulse.io",
      status: "ACTIVE"
    },
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
  },
  {
    id: "user-broker-1",
    email: "sterling@apexbrokerage.com",
    displayName: "David Sterling",
    organization: "Apex M&A Advisory",
    activeRole: "ADMIN",
    appraisalCredits: 25,
    isKycVerified: true,
    isAccreditedBuyer: true,
    status: "ACTIVE",
    totalTransactionsVolume: 890000,
    createdAt: new Date(Date.now() - 86400000 * 60).toISOString(),
  },
  {
    id: "user-flagged-demo",
    email: "spammer@shadow-ops.biz",
    displayName: "Unknown Script Operator",
    organization: "Unregistered Entity",
    activeRole: "SELLER",
    appraisalCredits: 0,
    isKycVerified: false,
    isAccreditedBuyer: false,
    status: "SUSPENDED",
    totalTransactionsVolume: 0,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  }
];

// Server-side persistent file storage & Firestore sync helpers
let fsMod: any = null;
let pathMod: any = null;
if (typeof window === "undefined") {
  try {
    fsMod = require("fs");
    pathMod = require("path");
  } catch (e) {
    // browser or worker environment
  }
}

// Lazy-load adminDb to avoid bundling issues in client components
function getFirestoreDb() {
  if (typeof window === "undefined" && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    try {
      const { adminDb } = require("@/lib/firebase/admin");
      return adminDb;
    } catch (e) {
      return null;
    }
  }
  return null;
}

async function syncFirestoreDocument(collection: string, id: string, data: any) {
  try {
    const db = getFirestoreDb();
    if (db) {
      await db.collection(collection).doc(id).set(JSON.parse(JSON.stringify(data)), { merge: true });
    }
  } catch (err) {
    // Non-blocking fallback warning
    console.warn(`[Firestore Sync Warning] collection=${collection} id=${id}:`, err);
  }
}

class UniversalDataStore {
  private appraisals: Map<string, AppraisalReport> = new Map();
  private listings: Map<string, MarketplaceListing> = new Map();
  private offers: Map<string, MarketplaceOffer> = new Map();
  private messages: Map<string, MarketplaceMessage> = new Map();
  private ndas: Map<string, SignedNDA> = new Map();
  private transactions: Map<string, TransactionRecord> = new Map();
  private users: Map<string, UserProfile> = new Map();
  private params: PlatformParameters = {
    seniorHourlyRate: 110,
    hoursPerPersonMonth: 160,
    aiComplexityMultiplier: 1.4,
    devToolsMultiplier: 1.3,
    saasMultiplier: 1.15,
    cacUserValueRate: 24,
    leadValuationRate: 12,
    certificateValidityDays: 365,
    platformTakeRatePercent: 5.0,
  };

  private storageFilePath: string | null = null;

  constructor() {
    // 1. Initialize default seed data
    INITIAL_APPRAISALS.forEach((appr) => this.appraisals.set(appr.id, appr));
    INITIAL_LISTINGS.forEach((list) => {
      // Default moderation status if missing
      if (!list.moderationStatus) list.moderationStatus = "APPROVED";
      this.listings.set(list.id, list);
    });
    INITIAL_OFFERS.forEach((off) => this.offers.set(off.id, off));
    INITIAL_MESSAGES.forEach((m) => this.messages.set(m.id, m));
    INITIAL_NDAS.forEach((n) => this.ndas.set(n.id, n));
    INITIAL_TRANSACTIONS.forEach((tx) => this.transactions.set(tx.id, tx));
    INITIAL_USERS.forEach((u) => this.users.set(u.id, u));

    // 2. Hydrate from persistent disk store if on server
    if (typeof window === "undefined" && fsMod && pathMod) {
      try {
        this.storageFilePath = pathMod.join(process.cwd(), "src", "lib", "db", "data-store.json");
        if (fsMod.existsSync(this.storageFilePath)) {
          const raw = fsMod.readFileSync(this.storageFilePath, "utf-8");
          const parsed = JSON.parse(raw);
          if (parsed.appraisals) {
            parsed.appraisals.forEach((a: AppraisalReport) => this.appraisals.set(a.id, a));
          }
          if (parsed.listings) {
            parsed.listings.forEach((l: MarketplaceListing) => {
              if (!l.moderationStatus) l.moderationStatus = "APPROVED";
              this.listings.set(l.id, l);
            });
          }
          if (parsed.offers) {
            parsed.offers.forEach((o: MarketplaceOffer) => this.offers.set(o.id, o));
          }
          if (parsed.messages) {
            parsed.messages.forEach((m: MarketplaceMessage) => this.messages.set(m.id, m));
          }
          if (parsed.ndas) {
            parsed.ndas.forEach((n: SignedNDA) => this.ndas.set(n.id, n));
          }
          if (parsed.transactions) {
            parsed.transactions.forEach((t: TransactionRecord) => this.transactions.set(t.id, t));
          }
          if (parsed.users) {
            parsed.users.forEach((u: UserProfile) => this.users.set(u.id, u));
          }
          if (parsed.params) {
            this.params = { ...this.params, ...parsed.params };
          }
        } else {
          // Create initial file
          this.persistDisk();
        }
      } catch (err) {
        console.warn("[DataStore] Hydration warning:", err);
      }
    }
  }

  private persistDisk() {
    if (typeof window === "undefined" && fsMod && this.storageFilePath) {
      try {
        const payload = {
          version: "1.0",
          updatedAt: new Date().toISOString(),
          appraisals: Array.from(this.appraisals.values()),
          listings: Array.from(this.listings.values()),
          offers: Array.from(this.offers.values()),
          messages: Array.from(this.messages.values()),
          ndas: Array.from(this.ndas.values()),
          transactions: Array.from(this.transactions.values()),
          users: Array.from(this.users.values()),
          params: this.params,
        };
        fsMod.writeFileSync(this.storageFilePath, JSON.stringify(payload, null, 2), "utf-8");
      } catch (err) {
        console.error("[DataStore] Failed to write to disk:", err);
      }
    }
  }

  // Appraisals
  public getAllAppraisals(): AppraisalReport[] {
    return Array.from(this.appraisals.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public getAppraisalById(id: string): AppraisalReport | undefined {
    return this.appraisals.get(id);
  }

  public getAppraisalByCertificateId(certId: string): AppraisalReport | undefined {
    return Array.from(this.appraisals.values()).find(
      (a) => a.certificate.certificateId.toLowerCase() === certId.toLowerCase()
    );
  }

  public saveAppraisal(report: AppraisalReport): AppraisalReport {
    this.appraisals.set(report.id, report);
    this.persistDisk();
    syncFirestoreDocument("appraisals", report.id, report);
    return report;
  }

  public updateCertificateStatus(certId: string, status: 'VERIFIED' | 'REVOKED' | 'EXPIRED'): boolean {
    const appr = this.getAppraisalByCertificateId(certId);
    if (appr) {
      appr.certificate.status = status;
      this.appraisals.set(appr.id, appr);
      this.persistDisk();
      syncFirestoreDocument("appraisals", appr.id, appr);
      return true;
    }
    return false;
  }

  // Marketplace
  public getAllListings(): MarketplaceListing[] {
    return Array.from(this.listings.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public getListingById(id: string): MarketplaceListing | undefined {
    return this.listings.get(id);
  }

  public saveListing(listing: MarketplaceListing): MarketplaceListing {
    this.listings.set(listing.id, listing);
    const appr = this.appraisals.get(listing.appraisalId);
    if (appr) {
      appr.isListedOnMarketplace = true;
      appr.marketplaceListingId = listing.id;
      this.appraisals.set(appr.id, appr);
      syncFirestoreDocument("appraisals", appr.id, appr);
    }
    this.persistDisk();
    syncFirestoreDocument("marketplace_listings", listing.id, listing);
    return listing;
  }

  public updateListing(id: string, updates: Partial<MarketplaceListing>): MarketplaceListing | undefined {
    const existing = this.listings.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates };
    this.listings.set(id, updated);
    this.persistDisk();
    syncFirestoreDocument("marketplace_listings", id, updated);
    return updated;
  }

  public updateListingModeration(
    id: string,
    moderationStatus: MarketplaceListing['moderationStatus'],
    isFeatured?: boolean
  ): MarketplaceListing | undefined {
    const listing = this.listings.get(id);
    if (!listing) return undefined;
    if (moderationStatus !== undefined) listing.moderationStatus = moderationStatus;
    if (isFeatured !== undefined) listing.isFeatured = isFeatured;
    this.listings.set(id, listing);
    this.persistDisk();
    syncFirestoreDocument("marketplace_listings", id, listing);
    return listing;
  }

  // Transactions & Escrow Protocol
  public getAllTransactions(): TransactionRecord[] {
    return Array.from(this.transactions.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public getTransactionById(id: string): TransactionRecord | undefined {
    return this.transactions.get(id);
  }

  public saveTransaction(tx: TransactionRecord): TransactionRecord {
    this.transactions.set(tx.id, tx);
    this.persistDisk();
    syncFirestoreDocument("transactions", tx.id, tx);
    return tx;
  }

  public updateTransactionStatus(
    id: string,
    status: TransactionRecord['status'],
    notes?: string
  ): TransactionRecord | undefined {
    const tx = this.transactions.get(id);
    if (!tx) return undefined;
    tx.status = status;
    if (notes) tx.notes = notes;
    if (status === 'PAYOUT_RELEASED') {
      tx.disbursedAt = new Date().toISOString();
      tx.escrowPhase = 4;
    }
    this.transactions.set(id, tx);
    this.persistDisk();
    syncFirestoreDocument("transactions", id, tx);
    return tx;
  }

  // Offers
  public getOffersForListing(listingId: string): MarketplaceOffer[] {
    return Array.from(this.offers.values()).filter((o) => o.listingId === listingId);
  }

  public saveOffer(offer: MarketplaceOffer): MarketplaceOffer {
    this.offers.set(offer.id, offer);
    this.persistDisk();
    syncFirestoreDocument("offers", offer.id, offer);
    return offer;
  }

  public updateOfferStatus(offerId: string, status: 'ACCEPTED' | 'DECLINED' | 'COUNTERED'): MarketplaceOffer | undefined {
    const offer = this.offers.get(offerId);
    if (!offer) return undefined;
    offer.status = status;
    this.offers.set(offerId, offer);
    this.persistDisk();
    syncFirestoreDocument("offers", offerId, offer);
    return offer;
  }

  // Deal Room Direct Messages
  public getMessagesForListing(listingId: string): MarketplaceMessage[] {
    return Array.from(this.messages.values())
      .filter((m) => m.listingId === listingId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  public saveMessage(message: MarketplaceMessage): MarketplaceMessage {
    this.messages.set(message.id, message);
    this.persistDisk();
    syncFirestoreDocument("messages", message.id, message);
    return message;
  }

  // NDAs
  public getAllNDAs(): SignedNDA[] {
    return Array.from(this.ndas.values());
  }

  public signNDA(listingId: string, buyerName: string, buyerEmail: string): SignedNDA {
    const listing = this.getListingById(listingId);
    const nda: SignedNDA = {
      id: `nda-${Date.now().toString().slice(-4)}`,
      listingId,
      listingTitle: listing?.title || "Confidential Software Asset",
      buyerName,
      buyerEmail,
      signedAt: new Date().toISOString(),
      ndaHash: `sha256:nda_${Date.now()}`
    };
    this.ndas.set(nda.id, nda);

    const user = this.getCurrentUser();
    if (user.buyerPreferences) {
      if (!user.buyerPreferences.ndaSignedListings.includes(listingId)) {
        user.buyerPreferences.ndaSignedListings.push(listingId);
      }
    }
    this.persistDisk();
    syncFirestoreDocument("signed_ndas", nda.id, nda);
    return nda;
  }

  // User Directory & Profile Management
  public getAllUsers(): UserProfile[] {
    return Array.from(this.users.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public getUserById(id: string): UserProfile | undefined {
    return this.users.get(id);
  }

  public saveUser(user: UserProfile): UserProfile {
    this.users.set(user.id, user);
    this.persistDisk();
    syncFirestoreDocument("users", user.id, user);
    return user;
  }

  public updateUser(id: string, updates: Partial<UserProfile>): UserProfile | undefined {
    const existing = this.users.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates };
    this.users.set(id, updated);
    this.persistDisk();
    syncFirestoreDocument("users", id, updated);
    return updated;
  }

  public getCurrentUser(): UserProfile {
    return this.users.get("user-default") || Array.from(this.users.values())[0];
  }

  public updateUserProfile(updates: Partial<UserProfile>): UserProfile {
    const current = this.getCurrentUser();
    const updated = { ...current, ...updates };
    this.users.set("user-default", updated);
    this.persistDisk();
    syncFirestoreDocument("users", "user-default", updated);
    return updated;
  }

  public updateUserCredits(creditsDelta: number, targetUserId: string = "user-default"): UserProfile {
    const user = this.users.get(targetUserId) || this.getCurrentUser();
    user.appraisalCredits = Math.max(0, user.appraisalCredits + creditsDelta);
    this.users.set(user.id, user);
    this.persistDisk();
    syncFirestoreDocument("users", user.id, user);
    return user;
  }

  // Platform Parameters
  public getParameters(): PlatformParameters {
    return { ...this.params };
  }

  public updateParameters(newParams: Partial<PlatformParameters>): PlatformParameters {
    this.params = { ...this.params, ...newParams };
    this.persistDisk();
    syncFirestoreDocument("platform_settings", "parameters", this.params);
    return this.params;
  }
}

const globalForStore = global as unknown as { __instituteStore?: UniversalDataStore };
export const store = globalForStore.__instituteStore ?? new UniversalDataStore();
if (process.env.NODE_ENV !== "production") globalForStore.__instituteStore = store;
