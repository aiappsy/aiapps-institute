import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/db/store";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params?.id;
    if (!id) {
      return NextResponse.json({ error: "Report ID is required" }, { status: 400 });
    }

    const report = store.getAppraisalById(id);
    if (!report) {
      return NextResponse.json({ error: "Appraisal report not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, report });
  } catch (error: any) {
    console.error("Fetch appraisal error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch appraisal" },
      { status: 500 }
    );
  }
}
