import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const envPath = path.join(process.cwd(), ".env.local");
  let envRaw = "";
  if (fs.existsSync(envPath)) {
    envRaw = fs.readFileSync(envPath, "utf-8");
  }

  return NextResponse.json({
    status: {
      geminiConnected: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "your_google_gemini_api_key_here",
      geminiModel: process.env.GEMINI_MODEL || "gemini-1.5-pro",
      firebaseProject: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "Not Configured",
      stripeActive: !!process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes("placeholder"),
      paypalActive: !!process.env.PAYPAL_CLIENT_SECRET && !process.env.PAYPAL_CLIENT_SECRET.includes("placeholder"),
      paypalMode: process.env.PAYPAL_MODE || "sandbox",
    },
    envContent: envRaw,
  });
}

export async function POST(req: NextRequest) {
  try {
    const { envContent } = await req.json();
    if (typeof envContent !== "string") {
      return NextResponse.json({ error: "Invalid content format" }, { status: 400 });
    }

    const envPath = path.join(process.cwd(), ".env.local");
    fs.writeFileSync(envPath, envContent, "utf-8");

    return NextResponse.json({ success: true, message: ".env.local updated dynamically." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
