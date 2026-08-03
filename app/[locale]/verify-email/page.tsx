
"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Icon from "@/components/icons";

export default function VerifyEmailPage({ params: { locale } }: { params: { locale: string } }) {
  const params = useSearchParams();
  const token = params.get("token");
  const p = locale === "ar" ? "" : `/${locale}`;
  const [status, setStatus] = useState<"loading"|"ok"|"error">("loading");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!token) { setStatus("error"); setMsg("Invalid link"); return; }
    fetch("/api/donor/verify-email", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ token }) })
      .then(r => r.json()).then(d => { if (d.ok) setStatus("ok"); else { setStatus("error"); setMsg(d.error||"Error"); } });
  }, [token]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-section-gradient px-6">
      <div className="bg-white rounded-2xl shadow-xl border border-line p-10 max-w-md text-center">
        {status === "loading" && <><Icon name="minus" size={36} className="text-brand mx-auto mb-4 animate-spin" /><p className="text-muted">...</p></>}
        {status === "ok" && <><div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4"><Icon name="shield-check" size={32} className="text-success" /></div><h1 className="font-display text-2xl font-extrabold text-ink mb-4">✓</h1><Link href={`${p}/login`} className="bg-brand hover:bg-brand-dark text-white font-bold rounded-xl px-6 py-3 transition inline-block">Sign In</Link></>}
        {status === "error" && <><div className="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center mx-auto mb-4"><Icon name="x" size={32} className="text-danger" /></div><p className="text-muted mb-4">{msg}</p><Link href={`${p}/login`} className="text-brand hover:underline text-sm">Back</Link></>}
      </div>
    </div>
  );
}
