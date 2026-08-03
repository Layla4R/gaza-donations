import { NextResponse } from "next/server";
import { getCurrentDonor } from "@/lib/donorAuth";

export async function GET() {
  const user = await getCurrentDonor();
  if (!user) return NextResponse.json({ user: null }, { status: 401 });
  return NextResponse.json({ user });
}
