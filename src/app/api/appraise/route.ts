import { NextRequest, NextResponse } from "next/server";
import { generateAppraisal } from "@/lib/ai/gemini";
import { store } from "@/lib/db/store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.projectName || !body.tagline) {
      return NextResponse.json(
        { error: "Project name and tagline are required." },
        { status: 400 }
      );
    }

    const report = await generateAppraisal(body);
    store.saveAppraisal(report);

    // Deduct 1 credit if available
    store.updateUserCredits(-1);

    return NextResponse.json({ success: true, report });
  } catch (error: any) {
    console.error("Appraisal API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate appraisal." },
      { status: 500 }
    );
  }
}
