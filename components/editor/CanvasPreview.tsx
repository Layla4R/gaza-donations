"use client";
import { PageSection } from "@/lib/blocks";

export default function CanvasPreview({ section }: { section: PageSection }) {
  const p = section.props || {};

  switch (section.type) {
    case "hero": return (
      <div className="relative overflow-hidden" style={{ minHeight: 300, background: p.backgroundImage ? "none" : "#1a3a6b" }}>
        {p.backgroundImage && (
          <>
            <img src={p.backgroundImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black" style={{ opacity: parseFloat(p.overlayOpacity) || 0.45 }} />
          </>
        )}
        <div className="relative z-10 px-12 py-16 text-white" style={{ maxWidth: 640 }}>
          <p className="text-white/60 text-xs font-semibold tracking-widest uppercase mb-3">4Relief Humanitarian Foundation</p>
          <h1 className="font-bold text-4xl leading-tight mb-4" style={{ fontFamily: "serif" }}>{p.title || "Hero Title"}</h1>
          <p className="text-white/75 text-sm leading-relaxed mb-8">{p.subtitle}</p>
          {p.buttonText && (
            <span className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white" style={{ background: "linear-gradient(135deg,#F00F5A,#FF4D88)" }}>
              ♥ {p.buttonText}
            </span>
          )}
        </div>
      </div>
    );

    case "stats": return (
      <div className="bg-white px-10 py-10">
        {p.title && <h2 className="font-bold text-xl text-center mb-6" style={{ color: "#111" }}>{p.title}</h2>}
        <div className="grid grid-cols-4 gap-4">
          {(p.items || []).map((item: any, i: number) => (
            <div key={i} className="text-center p-4 rounded-xl" style={{ background: "#F0F4FF", border: "1px solid #DDE3F5" }}>
              <div className="font-bold text-2xl" style={{ color: "#0069D2" }}>{item.value}</div>
              <div className="text-xs mt-1" style={{ color: "#6B7280" }}>{item.title}</div>
            </div>
          ))}
        </div>
      </div>
    );

    case "text": return (
      <div className="bg-white px-10 py-10" style={{ textAlign: (p.align as any) || "right" }}>
        {p.title && <h2 className="font-bold text-2xl mb-4" style={{ color: "#111" }}>{p.title}</h2>}
        <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "#4B5563" }}>{p.body}</p>
      </div>
    );

    case "image_text": return (
      <div className="bg-white px-10 py-10">
        <div className={`flex items-center gap-8 ${p.imagePosition === "left" ? "flex-row" : "flex-row-reverse"}`}>
          {p.image ? (
            <img src={p.image} alt="" className="w-56 h-40 object-cover rounded-xl flex-shrink-0" />
          ) : (
            <div className="w-56 h-40 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ background: "#F3F4F6", border: "2px dashed #D1D5DB" }}>
              <span className="text-xs" style={{ color: "#9CA3AF" }}>No image</span>
            </div>
          )}
          <div className="flex-1">
            {p.title && <h2 className="font-bold text-xl mb-3" style={{ color: "#111" }}>{p.title}</h2>}
            <p className="text-sm leading-relaxed" style={{ color: "#4B5563" }}>{p.body}</p>
          </div>
        </div>
      </div>
    );

    case "donation_buttons": return (
      <div className="py-10 px-10 text-center" style={{ background: "#F8F9FF" }}>
        {p.title && <h2 className="font-bold text-2xl mb-2" style={{ color: "#111" }}>{p.title}</h2>}
        {p.subtitle && <p className="text-sm mb-5" style={{ color: "#6B7280" }}>{p.subtitle}</p>}
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {(p.amounts || [5,10,25,50,100]).map((a: number, i: number) => (
            <span key={i} className="px-4 py-2 rounded-xl text-sm font-bold" style={{ background: i === 3 ? "#0069D2" : "white", color: i === 3 ? "white" : "#111", border: "1px solid #E5E7EB" }}>${a}</span>
          ))}
        </div>
        {p.allowMonthly && (
          <div className="flex justify-center gap-2 mb-4">
            <span className="px-4 py-1.5 rounded-full text-xs font-semibold" style={{ background: "#0069D2", color: "white" }}>One-time</span>
            <span className="px-4 py-1.5 rounded-full text-xs font-semibold" style={{ background: "#F3F4F6", color: "#6B7280" }}>Monthly</span>
          </div>
        )}
        <span className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm text-white" style={{ background: "linear-gradient(135deg,#F00F5A,#FF4D88)" }}>
          ♥ {p.title || "Donate Now"} — $25
        </span>
      </div>
    );

    case "campaigns_grid": return (
      <div className="px-10 py-10" style={{ background: "#F4F7FD" }}>
        {p.title && <h2 className="font-bold text-2xl mb-2" style={{ color: "#111" }}>{p.title}</h2>}
        {p.subtitle && <p className="text-sm mb-6" style={{ color: "#6B7280" }}>{p.subtitle}</p>}
        <div className="grid grid-cols-3 gap-4">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white rounded-xl overflow-hidden" style={{ border: "1px solid #E5E7EB" }}>
              <div className="h-28" style={{ background: `linear-gradient(135deg, #e8f0fe ${i*10}%, #d0e4ff)` }} />
              <div className="p-3">
                <div className="h-3 rounded mb-2" style={{ background: "#F3F4F6", width: "75%" }} />
                <div className="h-2 rounded mb-3" style={{ background: "#F9FAFB", width: "90%" }} />
                <div className="h-1.5 rounded-full" style={{ background: "#E5E7EB" }}>
                  <div className="h-1.5 rounded-full" style={{ background: "#0069D2", width: `${30 + i * 15}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );

    case "faq": return (
      <div className="bg-white px-10 py-10">
        {p.title && <h2 className="font-bold text-2xl mb-6" style={{ color: "#111" }}>{p.title}</h2>}
        <div className="space-y-2">
          {(p.items || []).map((item: any, i: number) => (
            <div key={i} className="rounded-xl px-4 py-3.5 flex justify-between items-center" style={{ border: "1px solid #E5E7EB", background: i === 0 ? "#F5F3FF" : "white" }}>
              <span className="text-sm font-semibold" style={{ color: "#111" }}>{item.title}</span>
              <span className="font-light text-lg" style={{ color: "#9CA3AF" }}>+</span>
            </div>
          ))}
        </div>
      </div>
    );

    case "gallery": return (
      <div className="bg-white px-10 py-10">
        {p.title && <h2 className="font-bold text-xl mb-5" style={{ color: "#111" }}>{p.title}</h2>}
        <div className="grid grid-cols-3 gap-3">
          {(p.images || []).slice(0, 6).map((img: any, i: number) => (
            <div key={i} className="h-28 rounded-xl overflow-hidden" style={{ background: "#F3F4F6" }}>
              {img.url && <img src={img.url} alt="" className="w-full h-full object-cover" />}
            </div>
          ))}
          {(p.images || []).length === 0 && [1,2,3].map(i => (
            <div key={i} className="h-28 rounded-xl" style={{ background: "#F3F4F6" }} />
          ))}
        </div>
      </div>
    );

    case "stories": return (
      <div className="px-10 py-10" style={{ background: "#F9FAFB" }}>
        {p.title && <h2 className="font-bold text-xl mb-5" style={{ color: "#111" }}>{p.title}</h2>}
        <div className="grid grid-cols-2 gap-4">
          {(p.items || []).map((item: any, i: number) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden" style={{ border: "1px solid #E5E7EB" }}>
              {item.image && <img src={item.image} alt="" className="w-full h-28 object-cover" />}
              <div className="p-3">
                <div className="font-bold text-sm mb-1" style={{ color: "#111" }}>{item.title}</div>
                <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "#6B7280" }}>{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );

    case "cta": {
      const bg = p.style === "gold" ? "linear-gradient(135deg,#F59E0B,#D97706)"
        : p.style === "beige" ? "#FDF8F0"
        : "linear-gradient(135deg,#003C87,#0069D2)";
      const textColor = p.style === "beige" ? "#111" : "white";
      return (
        <div className="px-10 py-12 text-center" style={{ background: bg }}>
          <h2 className="font-bold text-2xl mb-2" style={{ color: textColor }}>{p.title}</h2>
          <p className="text-sm mb-5 opacity-75" style={{ color: textColor }}>{p.subtitle}</p>
          {p.buttonText && (
            <span className="inline-block px-8 py-2.5 rounded-xl font-bold text-sm text-white" style={{ background: "linear-gradient(135deg,#F00F5A,#FF4D88)" }}>
              {p.buttonText}
            </span>
          )}
        </div>
      );
    }

    case "newsletter": return (
      <div className="px-10 py-12 text-center" style={{ background: "linear-gradient(135deg,#003C87,#0069D2)" }}>
        <h2 className="font-bold text-2xl text-white mb-2">{p.title || "Subscribe"}</h2>
        <p className="text-sm text-white/65 mb-6">{p.subtitle}</p>
        <div className="flex gap-2 max-w-sm mx-auto">
          <div className="flex-1 rounded-xl px-4 py-2.5 text-xs" style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.45)", border: "1px solid rgba(255,255,255,0.2)" }}>
            Email address…
          </div>
          <span className="px-5 py-2.5 rounded-xl font-bold text-xs text-white" style={{ background: "linear-gradient(135deg,#F00F5A,#FF4D88)" }}>Subscribe</span>
        </div>
      </div>
    );

    case "contact_form": return (
      <div className="bg-white px-10 py-10">
        {p.title && <h2 className="font-bold text-xl mb-2" style={{ color: "#111" }}>{p.title}</h2>}
        {p.subtitle && <p className="text-sm mb-5" style={{ color: "#6B7280" }}>{p.subtitle}</p>}
        <div className="space-y-3 max-w-md">
          {["Full Name", "Email Address", "Subject"].map(ph => (
            <div key={ph} className="h-10 rounded-xl" style={{ background: "#F9FAFB", border: "1px solid #E5E7EB" }} />
          ))}
          <div className="h-24 rounded-xl" style={{ background: "#F9FAFB", border: "1px solid #E5E7EB" }} />
          <div className="h-10 w-28 rounded-xl" style={{ background: "#0069D2" }} />
        </div>
      </div>
    );

    case "spacer": return (
      <div className="bg-white flex items-center justify-center relative" style={{ height: `${p.height || 48}px` }}>
        <div className="absolute inset-0 mx-8 border-t border-dashed" style={{ borderColor: "#E5E7EB", top: "50%" }} />
        <span className="relative bg-white px-3 text-xs" style={{ color: "#9CA3AF" }}>{p.height || 48}px spacer</span>
      </div>
    );

    case "full_image": return (
      <div className="bg-white">
        {p.src ? (
          <img src={p.src} alt={p.alt || ""} className="w-full object-contain" style={{ maxHeight: `${p.maxHeight || 600}px` }} />
        ) : (
          <div className="w-full flex items-center justify-center" style={{ height: 200, background: "#F3F4F6", border: "2px dashed #D1D5DB" }}>
            <span className="text-xs" style={{ color: "#9CA3AF" }}>No image — click to upload</span>
          </div>
        )}
        {p.caption && <p className="text-center text-xs py-2" style={{ color: "#9CA3AF" }}>{p.caption}</p>}
      </div>
    );
    default: return (
      <div className="bg-white px-10 py-8 text-center text-sm" style={{ color: "#9CA3AF", border: "1px dashed #E5E7EB" }}>
        {section.type} block
      </div>
    );
  }
}
