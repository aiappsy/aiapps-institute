import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/db/store";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const certId = searchParams.get("certId");
    const id = searchParams.get("id");

    if (id) {
      const report = store.getAppraisalById(id);
      if (!report) {
        return NextResponse.json({ error: "Appraisal report not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, report });
    }

    if (certId) {
      const report = store.getAppraisalByCertificateId(certId);
      if (!report) {
        return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, report });
    }

    const appraisals = store.getAllAppraisals();
    return NextResponse.json({ success: true, appraisals });
  } catch (error: any) {
    console.error("Appraisals list error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch appraisals" },
      { status: 500 }
    );
  }
}
