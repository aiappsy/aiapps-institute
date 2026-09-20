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
    - Powered by **Google Gemini 3.8 Flash** with **Real-Time Google Search Grounding** (`tools: [{ googleSearch: {} }]`) for live online competitor research and market multiple benchmarking.

2. **Institutional Grade Certificates & PDF Dossiers**:
   - High-resolution SVG institutional crest & embossed holographic seal.
   - Dynamic QR Code pointing directly to public `/verify/[certificateId]` ledger.
   - SHA-256 cryptographic verification checksum.
   - Live SVG dynamic badge generator (`/api/badge/[certId]`) for GitHub READMEs.
   - Instant print and PDF export.

3. **The AIApps Exchange (Better than Flippa)**:
   - **100% Pre-Audited**: Every listing is backed by an official AIApps Institute Appraisal Report & Verification Seal.
   - **Zero Listing Fees**: 100% Free listing on the exchange with a flat 5% escrow closing fee (saving sellers 10% vs. Flippa).
   - **Fair Value Benchmark**: Listings clearly show *Asking Price vs. Certified Fair Market Value*.
   - **1-Click Mutual Digital NDA**: Instant unlock of confidential due diligence dossiers.
   - Deal Room with direct buyer-seller messaging, Make Offer, and Escrow-protected checkout.

4. **Multi-Role User Account Hub & Institutional Admin**:
   - Dedicated views for Appraisals-Only, Sellers, Buyers, and Payout destination settings (Stripe Connect / PayPal).
   - High-security dark administrative command center (`/admin`) with live `.env.local` synchronization and math calibration.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router, Server Actions, TypeScript)
- **Design System**: Tailwind CSS, Lucide Icons, clean light-mode institutional aesthetic
- **AI Core**: Google Gemini 3.8 Flash with Google Search Grounding via `@google/generative-ai`
- **Database & Auth**: Google Firebase / Firestore + Universal Store fallback
- **Payments**: Stripe & PayPal REST API
- **Verification**: SHA-256 integrity hash + QR Code generation

---

## ☁️ Google AI Studio & Git Setup

### 1. Get your API Key from Google AI Studio
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Click **Create API Key**.
3. Add the key to `.env.local`:
   ```bash
   GEMINI_API_KEY=your_key_here
   GEMINI_MODEL=gemini-3.8-flash
   GEMINI_ENABLE_SEARCH_GROUNDING=true
   ```
   *(Or enter it directly inside the web app at `/admin/integrations`!)*

### 2. Push to GitHub / Import into Google Project IDX
To clone or open in Google Project IDX / Cloud:
```bash
# In this directory:
git remote add origin https://github.com/<your-username>/aiapps-institute.git
git branch -M main
git push -u origin main
```
Then in [Google Project IDX](https://idx.google.com), select **Import a repo** and paste your GitHub repository URL.

---

## 📦 Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.
