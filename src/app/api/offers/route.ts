import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/db/store";
import { MarketplaceOffer } from "@/lib/db/types";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const listingId = searchParams.get("listingId");
  if (listingId) {
    const offers = store.getOffersForListing(listingId);
    return NextResponse.json({ success: true, offers });
  }
  return NextResponse.json({ success: true, offers: [] });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { listingId, buyerName, buyerEmail, offerAmount, message } = body;

    if (!listingId || !offerAmount) {
      return NextResponse.json({ error: "listingId and offerAmount are required" }, { status: 400 });
    }

    const listing = store.getListingById(listingId);
    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    const newOffer: MarketplaceOffer = {
      id: `off-${Date.now().toString().slice(-4)}`,
      listingId,
      buyerId: "current-user",
      buyerName: buyerName || "Accredited Buyer",
      buyerEmail: buyerEmail || "deals@venturecraft.io",
      offerAmount: Number(offerAmount),
      message: message || "Formal acquisition offer submitted subject to standard code inspection.",
      createdAt: new Date().toISOString(),
      status: "PENDING",
    };

    store.saveOffer(newOffer);
    return NextResponse.json({ success: true, offer: newOffer });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { offerId, status } = body;

    if (!offerId || !status) {
      return NextResponse.json({ error: "offerId and status are required" }, { status: 400 });
    }

    const updated = store.updateOfferStatus(offerId, status);
    if (!updated) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, offer: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
