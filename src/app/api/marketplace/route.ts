import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/db/store";
import { MarketplaceListing } from "@/lib/db/types";

export async function GET(req: NextRequest) {
  const listings = store.getAllListings();
  return NextResponse.json({ success: true, listings });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const appraisal = store.getAppraisalById(body.appraisalId);

    if (!appraisal) {
      return NextResponse.json({ error: "Appraisal not found" }, { status: 404 });
    }

    const newListing: MarketplaceListing = {
      id: `list-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      appraisalId: appraisal.id,
      sellerId: appraisal.userId,
      sellerName: body.sellerName || "Paul Founder",
      sellerEmail: body.sellerEmail || "founder@aiappsinstitute.com",
      title: `${appraisal.projectName} - Certified Software Asset`,
      tagline: appraisal.tagline,
      description: `${appraisal.executiveSummary} Backed by official ${appraisal.grade} Grade AIApps Institute accreditation.`,
      category: appraisal.category,
      stage: appraisal.stage,
      techStack: appraisal.techStack,
      appraisedFairMarketValue: appraisal.valuationFairMarket,
      appraisedGrade: appraisal.grade,
      askingPrice: Number(body.askingPrice) || appraisal.valuationFairMarket,
      isNegotiable: true,
      monthlyRevenue: appraisal.monthlyRecurringRevenue,
      monthlyUsers: appraisal.registeredUsers,
      includedAssets: body.includedAssets && body.includedAssets.length > 0 ? body.includedAssets : [
        "Complete Source Code & Git Repository",
        "Domain Name & DNS Configuration",
        "Architecture & Deployment Setup Documentation",
        "Institutional Appraisal Certificate & Verification Rights",
        "Customer & User Database (if applicable)",
        "30 Days Founder Transition Support"
      ],
      status: "ACTIVE",
      verifiedCertificateId: appraisal.certificate.certificateId,
      verificationCode: appraisal.certificate.certificateId,
      dealRoomRequestsCount: 0,
      viewsCount: 1,
    };

    store.saveListing(newListing);

    return NextResponse.json({ success: true, listing: newListing });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { listingId, askingPrice, status } = body;

    if (!listingId) {
      return NextResponse.json({ error: "listingId is required" }, { status: 400 });
    }

    const updates: Partial<MarketplaceListing> = {};
    if (askingPrice !== undefined) updates.askingPrice = Number(askingPrice);
    if (status) updates.status = status;

    const updated = store.updateListing(listingId, updates);
    if (!updated) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, listing: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
