"use client";
import { useState } from "react";
import Icon from "@/components/icons";

const AMOUNTS = [5, 10, 25, 50, 100, 250];

export default function DonateWidget({ locale, dict, accentColor, data }: { locale: string; dict: Record<string, string>; accentColor?: string | null; data?: any }) {
  const [amount, setAmount] = useState(25);
  const [custom, setCustom] = useState("");
  const [freq, setFreq] = useState<"ONE_TIME"|"MONTHLY">("ONE_TIME");
  const [step, setStep] = useState<"amount"|"details">("amount");
  const [name, setName] = useState(""); 
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState<"stripe"|"paypal"|null>(null);
  const [error, setError] = useState("");

  const final = custom ? Math.max(1, Number(custom)) : amount;
  const t = (key: string, ar: string, en: string, fr: string, tr: string) =>
    dict[key] || (locale === "ar" ? ar : locale === "fr" ? fr : locale === "tr" ? tr : en);
  
  const title = data?.headline || data?.title || t("donate.widget_title","كل درهم بيغير حياة","Every Dollar Changes a Life","Chaque Euro Change une Vie","Her Dolar Bir Hayat Değiştirir");
  const subtitle = data?.subheading || data?.subtitle || data?.body || data?.description || t("donate.widget_body", "تبرعك يصل مباشرة للمستحقين دون وسيط. نحن نضمن الشفافية الكاملة ونوفر تقارير دورية عن أثر تبرعاتك.", "Your donation reaches beneficiaries directly without intermediaries. We guarantee full transparency and provide regular reports on the impact of your donations.", "Votre don parvient directement aux bénéficiaires sans intermédiaires. Nous garantissons une transparence totale.", "Bağışınız doğrudan yararlanıcılara ulaşır. Tam şeffaflık garantisi ve düzenli etki raporları sunuyoruz.");
  
  async function pay(provider: "stripe"|"paypal") {
    if (!name.trim() || !email.trim()) { setError(t("donate.name","الاسم والبريد مطلوبان","Name and email required","Nom et email requis","Ad ve e-posta gerekli")); return; }
    setLoading(provider); setError("");
    try {
      const res = await fetch(provider === "stripe" ? "/api/donations/checkout" : "/api/donations/paypal", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: final, frequency: freq, donorName: name, donorEmail: email }),
      });
      const d = await res.json();
      if (d.url) window.location.href = d.url;
      else setError(d.error || t("common.error","حدث خطأ","Error","Erreur","Hata"));
    } catch { setError(t("common.error","حدث خطأ","Error","Erreur","Hata")); }
    finally { setLoading(null); }
  }

  const inp = "w-full bg-white/80 border border-white/40 rounded-xl py-3 px-4 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-ink/40";

  return (
    <section className="py-20 bg-white">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — text */}
          <div>
            <span className="inline-flex items-center gap-2 text-brand font-semibold text-xs tracking-[0.3em] uppercase mb-4">
              <span className="w-6 h-px bg-brand/40 inline-block" />
              {t("donate.eyebrow","تبرع الآن","Donate Now","Faire un Don","Bağış Yap")}
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-ink mb-5 leading-tight">
              {title}
            </h2>
            <p className="text-muted text-lg leading-relaxed mb-8">
              {subtitle}  
            </p>
            <div className="flex flex-col gap-4">
              {[
                { icon: "shield-check" as const, ar: "دفع آمن ومشفر 100%",          en: "100% Secure & Encrypted Payment",    fr: "Paiement 100% Sécurisé",         tr: "100% Güvenli Ödeme" },
                { icon: "hand-heart"   as const, ar: "يصل مباشرة للمستحق بدون وسيط", en: "Reaches beneficiary directly",       fr: "Parvient directement au bénéficiaire", tr: "Doğrudan yararlanıcıya ulaşır" },
                { icon: "file-text"   as const, ar: "تقارير شفافية شهرية",            en: "Monthly transparency reports",       fr: "Rapports mensuels de transparence", tr: "Aylık şeffaflık raporları" },
                { icon: "globe"       as const, ar: "معتمد دولياً ومرخص",             en: "Internationally certified",          fr: "Certifié internationalement",       tr: "Uluslararası sertifikalı" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  {/* 🌟 تم استبدال الشفافية هنا باستخدام bg-cream */}
                  <div className="w-10 h-10 rounded-xl bg-cream border border-line text-brand flex items-center justify-center shrink-0">
                    <Icon name={item.icon} size={18} />
                  </div>
                  <span className="text-ink/80 font-medium">{t(`donate.feat${i}`, item.ar, item.en, item.fr, item.tr)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — widget card */}
          <div>
            {/* 🌟 تم استبدال التدرج الثابت باللون الأساسي الديناميكي (bg-brand) */}
            <div className="bg-brand rounded-3xl p-8 shadow-2xl shadow-brand/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-display font-bold text-xl">
                  {t("donate.title","تبرع الآن","Donate Now","Faire un Don","Bağış Yap")}
                </h3>
                <span className="text-white/60 text-sm font-bold">4Relief</span>
              </div>

              {step === "amount" ? (
                <div className="space-y-5">
                  {/* Frequency toggle */}
                  <div className="flex bg-white/10 rounded-2xl p-1">
                    {(["ONE_TIME","MONTHLY"] as const).map(f => (
                      <button key={f} onClick={() => setFreq(f)}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition ${freq === f ? "bg-white text-brand shadow-sm" : "text-white/70 hover:text-white"}`}>
                        {f === "ONE_TIME"
                          ? t("donate.one_time","مرة واحدة","One-time","Unique","Tek Seferlik")
                          : t("donate.monthly","شهري","Monthly","Mensuel","Aylık")}
                      </button>
                    ))}
                  </div>

                  {/* Amount grid */}
                  <div className="grid grid-cols-3 gap-2">
                    {AMOUNTS.map(a => (
                      <button key={a} onClick={() => { setAmount(a); setCustom(""); }}
                        className={`py-3 rounded-xl text-sm font-bold transition ${final === a && !custom ? "bg-white text-brand shadow-md" : "bg-white/10 text-white hover:bg-white/20"}`}>
                        ${a}
                      </button>
                    ))}
                  </div>

                  {/* Custom amount */}
                  <div className="relative">
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 font-bold">$</span>
                    <input type="number" min={1} value={custom} onChange={e => setCustom(e.target.value)}
                      placeholder={t("donate.custom","مبلغ آخر...","Custom amount...","Autre montant...","Özel miktar...")}
                      className="w-full bg-white/10 border border-white/20 focus:border-white/50 rounded-xl py-3 pr-10 pl-4 text-white placeholder-white/35 text-sm focus:outline-none transition" />
                  </div>

                  {/* CTA */}
                  {/* 🌟 تم التخلص من الستايل المضمن واستخدام كلاس bg-accent مباشرة */}
                  <button onClick={() => setStep("details")}
                    className="w-full bg-accent hover:opacity-90 text-white font-bold rounded-2xl py-4 text-base shadow-lg transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2">
                    <Icon name="heart" size={20} />
                    {t("donate.title","تبرع بـ","Donate","Faire un Don","Bağış Yap")} ${final}
                    {freq === "MONTHLY" && <span className="text-white/70 text-sm font-normal">/{t("donate.monthly","شهر","month","mois","ay")}</span>}
                  </button>

                  <p className="text-white/40 text-xs text-center flex items-center justify-center gap-1">
                    <Icon name="shield-check" size={12} />
                    {t("donate.secure","دفع آمن ومشفر","Secure encrypted payment","Paiement sécurisé","Güvenli ödeme")}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/70 text-sm">
                      {t("donate.one_time","مرة واحدة","One-time","Unique","Tek Seferlik")} — <strong className="text-white">${final}</strong>
                    </span>
                    <button onClick={() => { setStep("amount"); setError(""); }} className="text-white/50 hover:text-white text-xs underline">
                      {t("campaigns.edit","تعديل","Edit","Modifier","Düzenle")}
                    </button>
                  </div>
                  <input value={name} onChange={e => setName(e.target.value)} placeholder={t("donate.name","الاسم الكامل","Full Name","Nom Complet","Ad Soyad")} className={inp} />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={t("donate.email","البريد الإلكتروني","Email Address","Adresse Email","E-posta")} className={inp} />
                  {error && <p className="text-red-300 text-xs">{error}</p>}
                  
                  {/* 🌟 زر Stripe يستخدم النص بلون bg-brand عند تفعيله */}
                  <button onClick={() => pay("stripe")} disabled={!!loading}
                    className="w-full bg-white text-brand font-bold rounded-2xl py-3.5 transition hover:bg-white/90 disabled:opacity-60 flex items-center justify-center gap-2 text-sm">
                    <Icon name="wallet" size={16} />{loading === "stripe" ? "..." : `${t("donate.pay_card","الدفع بالبطاقة","Pay with Card","Payer par Carte","Kart ile Öde")} — $${final}`}
                  </button>
                  
                  <button onClick={() => pay("paypal")} disabled={!!loading}
                    className="w-full bg-[#003087] hover:bg-[#002574] text-white font-bold rounded-2xl py-3.5 transition disabled:opacity-60 flex items-center justify-center gap-2 text-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106z"/></svg>
                    {loading === "paypal" ? "..." : `PayPal — $${final}`}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}