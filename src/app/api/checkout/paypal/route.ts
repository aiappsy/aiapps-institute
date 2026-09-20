import { NextRequest, NextResponse } from "next/server";
import { createPayPalOrder } from "@/lib/payments/paypal";
import { store } from "@/lib/db/store";

export async function POST(req: NextRequest) {
  try {
    const { packageId } = await req.json();

    const order = await createPayPalOrder(packageId || "pkg-starter");

    // Credit user if in simulated mode
    if (order.orderId.includes("MOCK") || order.orderId.includes("SIM")) {
      const creditsToAdd = packageId === "pkg-institutional" ? 10 : packageId === "pkg-pro" ? 3 : 1;
      store.updateUserCredits(creditsToAdd);
    }

    return NextResponse.json({
      orderId: order.orderId,
      approvalUrl: order.approvalUrl,
    });
  } catch (error: any) {
    console.error("PayPal Route Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
