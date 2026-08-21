"use client";

import { useState } from "react";

export default function ChatWidget({ locale }: { locale: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });

      const data = await res.json();
      const botAnswer = data.answer || "عذراً، لم أتمكن من العثور على إجابة.";

      setMessages((prev) => [...prev, { sender: "bot", text: botAnswer }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "حدث خطأ أثناء الاتصال بالمساعد الذكي." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-6 start-6 z-50 font-sans">
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-brand hover:bg-brand-dark text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-105"
          aria-label="فتح المحادثة"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </button>
      )}

      {isOpen && (
        <div className="w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-line overflow-hidden flex flex-col h-[480px]">
          <div className="bg-brand text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-success"></span>
              <span className="font-bold text-sm">المساعد الذكي — 4Relief</span>
            </div>
            <button type="button" onClick={() => setIsOpen(false)} className="text-white hover:opacity-80">
              ✕
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-cream/30">
            {messages.length === 0 && (
              <p className="text-xs text-muted text-center mt-12">
                {locale === "ar" ? "مرحباً بك! كيف يمكنني مساعدتك اليوم؟" : "Hello! How can I help you today?"}
              </p>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-xl p-3 text-xs leading-relaxed ${
                  m.sender === "user" ? "bg-brand text-white" : "bg-white border border-line text-ink"
                }`}>
                  {m.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-line text-xs text-muted p-2.5 rounded-xl animate-pulse">
                  جاري التفكير...
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="p-3 border-t border-line flex gap-2 bg-white">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={locale === "ar" ? "اكتب استفسارك..." : "Type your question..."}
              className="flex-1 text-xs px-3 py-2.5 border border-line rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-brand text-white px-4 py-2.5 rounded-xl text-xs font-bold disabled:opacity-50"
            >
              إرسال
            </button>
          </form>
        </div>
      )}
    </div>
  );
}