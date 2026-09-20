import { NextRequest, NextResponse } from "next/server";
import { createStripeCheckoutSession } from "@/lib/payments/stripe";
import { store } from "@/lib/db/store";

export async function POST(req: NextRequest) {
  try {
    const { packageId } = await req.json();
    const origin = req.headers.get("origin") || "http://localhost:3000";

    const session = await createStripeCheckoutSession(
      packageId || "pkg-starter",
      "founder@aiappsinstitute.com",
      `${origin}/pricing`,
      `${origin}/pricing?canceled=true`
    );

    // If in sandbox/simulated mode, instantly credit the user
    if (session.sessionId.startsWith("mock_stripe_")) {
      const creditsToAdd = packageId === "pkg-institutional" ? 10 : packageId === "pkg-pro" ? 3 : 1;
      store.updateUserCredits(creditsToAdd);
    }

    return NextResponse.json({ url: session.url, sessionId: session.sessionId });
  } catch (error: any) {
    console.error("Stripe Route Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
