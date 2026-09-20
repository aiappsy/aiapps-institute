import Stripe from "stripe";

const stripeKey = process.env.STRIPE_SECRET_KEY || "sk_test_placeholder";

export const stripe = new Stripe(stripeKey, {
  apiVersion: "2024-06-20",
  typescript: true,
});

export interface CheckoutPackage {
  id: string;
  name: string;
  price: number;
  credits: number;
  description: string;
  features: string[];
}

export const APPRAISAL_PACKAGES: CheckoutPackage[] = [
  {
    id: "pkg-starter",
    name: "MVP Starter Appraisal",
    price: 49,
    credits: 1,
    description: "Ideal for pre-revenue MVPs, hackathon projects, and single repositories.",
    features: [
      "Cost-to-Rebuild Replacement Value calculation",
      "Code Health & Modularity Scorecard",
      "Official Institutional Certificate of Appraisal",
      "Public QR Code & Cryptographic Verification",
      "1-Click Listing eligibility on AIApps Exchange"
    ]
  },
  {
    id: "pkg-pro",
    name: "Professional Due Diligence",
    price: 149,
    credits: 3,
    description: "For active applications, early-revenue SaaS, and acquisition-seeking founders.",
    features: [
      "Everything in Starter Package",
      "3 Full Appraisals (Re-appraise as you ship)",
      "Blended Market Multiples & TAM Analysis",
      "Deep Tech Debt & Risk Vulnerability Audit",
      "Featured Badge on AIApps Exchange Marketplace",
      "Downloadable 8-Page Executive PDF Dossier"
    ]
  },
  {
    id: "pkg-institutional",
    name: "Institutional Deal-Room Suite",
    price: 299,
    credits: 10,
    description: "Designed for micro-PE, venture scouts, brokerages, and multi-repo platforms.",
    features: [
      "Everything in Professional Suite",
      "10 Full Appraisals & Certificates",
      "Prioritized Deal Room Placement",
      "Direct Buyer Inquiry & Offer Manager",
      "Escrow Transfer Support & Valuation Advisory",
      "Permanent Registry & API Verification Access"
    ]
  }
];

export async function createStripeCheckoutSession(
  packageId: string,
  userEmail: string,
  successUrl: string,
  cancelUrl: string
): Promise<{ url: string | null; sessionId: string }> {
  const selectedPackage = APPRAISAL_PACKAGES.find((p) => p.id === packageId) || APPRAISAL_PACKAGES[0];

  // If running with dummy placeholder keys, return a simulated success redirect for smooth testing
  if (stripeKey.includes("placeholder")) {
    return {
      url: `${successUrl}?session_id=mock_stripe_${Date.now()}&package=${packageId}`,
      sessionId: `mock_stripe_${Date.now()}`
    };
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    customer_email: userEmail,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${selectedPackage.name} - AIApps Institute`,
            description: selectedPackage.description,
          },
          unit_amount: selectedPackage.price * 100, // in cents
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}&package=${packageId}`,
    cancel_url: cancelUrl,
    metadata: {
      packageId: selectedPackage.id,
      credits: selectedPackage.credits.toString(),
    },
  });

  return { url: session.url, sessionId: session.id };
}
