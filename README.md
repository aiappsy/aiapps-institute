# AIApps Institute 🏛️

**Institutional AI-Driven Software Appraisal & Verified Exchange Platform**

AIApps Institute is an accredited appraisal authority for digital software assets, MVPs, codebases, and tech platforms. The platform performs quantitative due diligence, asset replacement cost calculations (Cost-to-Rebuild), code modularity and technical debt scoring, and issues verifiable institutional certificates with dynamic QR verification.

In addition, AIApps Institute operates **The AIApps Exchange** — a curated, pre-audited marketplace where every listed app displays its certified fair market value benchmark and code health grade.

---

## 🚀 Key Features

1. **Multi-Dimensional AI Valuation Engine**:
   - **Cost-to-Rebuild (Replacement Cost)**: Calculated by estimating required engineering person-months multiplied by institutional market rates.
   - **Code Health & Technical Debt Scorecard**: Modularity score, testability, dependency vulnerability, and debt discount.
   - **Market Multiples & User Traction**: ARR/SDE multiples blended with verified user base value.
   - Powered by **Google Gemini 1.5 Pro** with structured JSON output and algorithmic bounds.

2. **Institutional Grade Certificates & PDF Dossiers**:
   - High-resolution SVG institutional crest & embossed holographic seal.
   - Dynamic QR Code pointing directly to public `/verify/[certificateId]` ledger.
   - SHA-256 cryptographic verification checksum.
   - Instant print and PDF export.

3. **The AIApps Exchange (Better than Flippa)**:
   - **100% Pre-Audited**: Every listing is backed by an official AIApps Institute Appraisal Report & Verification Seal.
   - **Fair Value Benchmark**: Listings clearly show *Asking Price vs. Certified Fair Market Value*.
   - **1-Click Publishing**: Sellers can publish to the exchange directly from their appraisal report with a single button.
   - Deal Room, Make Offer, and Escrow-protected Instant Buy.

4. **Multi-Channel Monetization**:
   - **Stripe**: Credit card and one-click checkout.
   - **PayPal**: Smart button order capture.
   - Dynamic `.env` configuration portal for real-time key management and system health diagnostics.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router, Server Actions, TypeScript)
- **Design System**: Tailwind CSS, Lucide Icons, clean light-mode institutional aesthetic
- **AI Core**: Google Gemini 1.5 Pro via `@google/generative-ai`
- **Database & Auth**: Google Firebase / Firestore + Universal Store fallback
- **Payments**: Stripe & PayPal REST API
- **Verification**: SHA-256 integrity hash + QR Code generation

---

## 📦 Setup & Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure `.env.local`:
   Copy `.env.example` to `.env.local` and add your Google Gemini, Stripe, PayPal, or Firebase keys as needed. (The platform includes full deterministic sandbox fallbacks so it runs immediately even without live keys!)

3. Start development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.
