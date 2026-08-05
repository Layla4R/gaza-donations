"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "@/components/icons";

interface Props {
  amounts?: number[];
  campaignId?: string;
  allowMonthly?: boolean;
}

export default function DonationWidget({ 
  amounts = [5, 10, 25, 50, 100, 250], 
  campaignId, 
  allowMonthly = true 
}: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<number | null>(amounts[1] || 10);
  const [custom, setCustom] = useState("");
  const [frequency, setFrequency] = useState<"one_time" | "monthly">("one_time");

  const finalAmount = custom ? parseFloat(custom) : selected;

  function go() {
    if (!finalAmount || finalAmount <= 0) return;
    const params = new URLSearchParams({
      amount: String(finalAmount),
      frequency,
    });
    if (campaignId) params.set("campaign", campaignId);
    router.push(`/donate?${params.toString()}`);
  }

  return (
    // 🌟 استخدام اللون الأساسي (bg-brand) كخلفية للويدجت بالكامل
    <div className="w-full max-w-lg mx-auto bg-brand rounded-[2rem] shadow-2xl p-6 sm:p-8 border border-white/10 text-white">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <span className="font-bold text-sm tracking-wider opacity-80">4Relief</span>
        <h3 className="font-display text-2xl font-bold">تبرع الآن</h3>
      </div>

      {/* Frequency Toggle */}
      {allowMonthly && (
        <div className="flex rounded-xl overflow-hidden mb-4 border border-white/20 p-1 bg-white/5">
          <button
            onClick={() => setFrequency("monthly")}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
              frequency === "monthly" ? "bg-white text-brand shadow-sm" : "text-white/80 hover:bg-white/10"
            }`}
          >
            شهري
          </button>
          <button
            onClick={() => setFrequency("one_time")}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
              frequency === "one_time" ? "bg-white text-brand shadow-sm" : "text-white/80 hover:bg-white/10"
            }`}
          >
            مرة واحدة
          </button>
        </div>
      )}

      {/* Amounts Grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {amounts.map((amt) => (
          <button
            key={amt}
            onClick={() => {
              setSelected(amt);
              setCustom("");
            }}
            className={`rounded-xl py-3.5 font-bold text-sm transition-all border ${
              selected === amt && !custom
                ? "bg-white text-brand border-white shadow-md"
                : "bg-white/10 text-white border-white/5 hover:bg-white/20"
            }`}
          >
            ${amt}
          </button>
        ))}
      </div>

      {/* Custom Amount */}
      <div className="mb-6 relative">
        <span className="absolute inset-y-0 right-4 flex items-center text-white/50 font-bold">$</span>
        <input
          type="number"
          min={1}
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          placeholder="مبلغ آخر..."
          className="w-full rounded-xl border border-white/20 bg-white/10 py-3.5 pr-10 pl-4 text-white placeholder-white/40 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
        />
      </div>

      {/* Submit Button */}
      {/* 🌟 استخدام اللون الثانوي (bg-accent) للزر الرئيسي */}
      <button
        onClick={go}
        disabled={!finalAmount || finalAmount <= 0}
        className="w-full flex items-center justify-center gap-2 bg-accent hover:opacity-90 text-white font-bold text-lg rounded-xl py-4 transition-all shadow-lg disabled:opacity-50"
      >
        <Icon name="heart" size={20} />
        تبرع الآن {finalAmount ? `$${finalAmount}` : ""}
      </button>

      {/* Footer Text */}
      <div className="mt-5 flex items-center justify-center gap-1.5 text-white/60 text-xs">
        <Icon name="shield-check" size={14} />
        <span>جميع المعاملات مشفرة وآمنة</span>
      </div>
      
    </div>
  );
}