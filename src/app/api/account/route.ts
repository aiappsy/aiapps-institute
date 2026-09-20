import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/db/store";

export async function GET(req: NextRequest) {
  const user = store.getCurrentUser();
  return NextResponse.json({ success: true, user });
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = store.updateUserProfile(body);
    return NextResponse.json({ success: true, user: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
