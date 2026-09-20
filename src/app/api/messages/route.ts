import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/db/store";
import { MarketplaceMessage } from "@/lib/db/types";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const listingId = searchParams.get("listingId");

  if (!listingId) {
    return NextResponse.json({ error: "listingId is required" }, { status: 400 });
  }

  const messages = store.getMessagesForListing(listingId);
  return NextResponse.json({ messages });
}

export async function POST(req: NextRequest) {
  try {
    const { listingId, senderName, senderEmail, senderRole, content } = await req.json();

    if (!listingId || !content) {
      return NextResponse.json({ error: "listingId and content are required" }, { status: 400 });
    }

    const newMsg: MarketplaceMessage = {
      id: `msg-${Date.now().toString().slice(-4)}`,
      listingId,
      senderName: senderName || "Accredited Buyer",
      senderEmail: senderEmail || "deals@buyer.io",
      senderRole: senderRole || "BUYER",
      content,
      createdAt: new Date().toISOString(),
    };

    store.saveMessage(newMsg);
    return NextResponse.json({ success: true, message: newMsg });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
