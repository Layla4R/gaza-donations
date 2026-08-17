import { NextResponse } from "next/server";
import { logoutDonor } from "@/lib/donorAuth";

export async function POST() {
  try {
    await logoutDonor();
  } catch {}

  const res = NextResponse.json({ ok: true });
  
  res.cookies.set("donor_session", "", { path: "/", expires: new Date(0) });
  res.cookies.set("donor_name", "", { path: "/", expires: new Date(0) });

  return res;
}