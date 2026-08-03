"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  amounts: number[];
  campaignId?: string;
  allowMonthly?: boolean;
}

export default function DonationWidget({ amounts, campaignId, allowMonthly }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<number | null>(amounts?.[1] ?? amounts?.[0] ?? 10);
  const [custom, setCustom] = useState("");
  const [monthly, setMonthly] = useState(false);

  function go() {
    const amount = custom ? parseFloat(custom) : selected;
    if (!amount || amount <= 0) return;
    const params = new URLSearchParams({
      amount: String(amount),
      frequency: monthly ? "monthly" : "one_time",
    });
    if (campaignId) params.set("campaign", campaignId);
    router.push(`/donate?${params.toString()}`);
  }

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-xl2 shadow-lg shadow-brand/5 p-6 sm:p-8 border border-line">
      <div className="grid grid-cols-3 gap-3 mb-4">
        {amounts.map((amt) => (
          <button
            key={amt}
            onClick={() => {
              setSelected(amt);
              setCustom("");
            }}
            className={`rounded-xl py-3 font-semibold text-lg transition border ${
              selected === amt && !custom
                ? "bg-brand text-white border-brand shadow-md"
                : "bg-cream text-ink border-line hover:border-brand/50"
            }`}
          >
            ${amt}
          </button>
        ))}
      </div>

      <div className="mb-4">
        <label className="block text-sm text-muted mb-1.5">مبلغ مخصص (USD)</label>
        <div className="relative">
          <span className="absolute inset-y-0 right-4 flex items-center text-muted">$</span>
          <input
            type="number"
            min={1}
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="أدخل المبلغ"
            className="w-full rounded-xl border border-line bg-cream py-3 pr-8 pl-4 text-lg focus:outline-none focus:ring-2 focus:ring-brand/40"
          />
        </div>
      </div>

      {allowMonthly && (
        <label className="flex items-center gap-2 mb-5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={monthly}
            onChange={(e) => setMonthly(e.target.checked)}
            className="w-4 h-4 accent-brand"
          />
          <span className="text-sm text-muted">
            جعل هذا التبرع <span className="font-semibold text-brand-dark">شهرياً متكرراً</span>
          </span>
        </label>
      )}

      <button
        onClick={go}
        className="w-full bg-accent-gradient hover:opacity-90 text-white font-bold text-lg rounded-xl py-3.5 transition shadow-md shadow-accent/30"
      >
        تبرع الآن
      </button>
      <p className="text-xs text-center text-muted mt-3">
        دفع آمن عبر Stripe و PayPal — تبدأ التبرعات من 1$
      </p>
    </div>
  );
}
