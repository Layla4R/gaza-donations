import { NextResponse } from "next/server";
import { logoutDonor } from "@/lib/donorAuth";

export async function POST() {
  await logoutDonor();
  return NextResponse.json({ ok: true });
}
