import { APPRAISAL_PACKAGES } from "./stripe";

export async function createPayPalOrder(packageId: string): Promise<{ orderId: string; approvalUrl?: string }> {
  const selectedPackage = APPRAISAL_PACKAGES.find((p) => p.id === packageId) || APPRAISAL_PACKAGES[0];
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientSecret || clientSecret === "placeholder") {
    // Return simulated order ID for instant sandbox testing
    return {
      orderId: `PAYPAL-MOCK-ORD-${Date.now()}`,
    };
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const baseUrl = process.env.PAYPAL_MODE === "live" 
    ? "https://api-m.paypal.com" 
    : "https://api-m.sandbox.paypal.com";

  try {
    // 1. Get Access Token
    const tokenRes = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // 2. Create Order
    const orderRes = await fetch(`${baseUrl}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            reference_id: selectedPackage.id,
            description: `${selectedPackage.name} - AIApps Institute`,
            amount: {
              currency_code: "USD",
              value: selectedPackage.price.toFixed(2),
            },
          },
        ],
      }),
    });

    const orderData = await orderRes.json();
    const approvalLink = orderData.links?.find((l: { rel: string; href: string }) => l.rel === "approve")?.href;

    return {
      orderId: orderData.id,
      approvalUrl: approvalLink,
    };
  } catch (error) {
    console.error("PayPal Order creation error, returning simulated fallback:", error);
    return { orderId: `PAYPAL-SIM-${Date.now()}` };
  }
}
