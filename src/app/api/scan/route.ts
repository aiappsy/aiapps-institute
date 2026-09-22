import { NextRequest, NextResponse } from "next/server";
import { runUnifiedScan } from "@/lib/scanner/unified-scanner";
import { generateAppraisal } from "@/lib/ai/gemini";
import { store } from "@/lib/db/store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { githubUrl, liveUrl, manualOverrides, autoAppraise = false } = body;

    if (!githubUrl?.trim() && !liveUrl?.trim()) {
      return NextResponse.json(
        { error: "Please provide either a GitHub repository URL or a Live application URL." },
        { status: 400 }
      );
    }

    const scanResult = await runUnifiedScan({
      githubUrl: githubUrl?.trim(),
      liveUrl: liveUrl?.trim(),
      manualOverrides,
    });

    // If autoAppraise is requested, generate and save report directly
    if (autoAppraise) {
      const report = await generateAppraisal(scanResult.synthesizedInput);
      store.saveAppraisal(report);
      store.updateUserCredits(-1);

      return NextResponse.json({
        success: true,
        report,
        scanResult,
      });
    }

    return NextResponse.json({
      success: true,
      scanResult,
    });
  } catch (error: any) {
    console.error("Unified Scan API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to scan codebase and deployment." },
      { status: 500 }
    );
  }
}
