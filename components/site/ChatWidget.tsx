"use client";

import { useState, useRef, useEffect } from "react";

export default function ChatWidget({ locale = "ar" }: { locale?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"text" | "voice">("text");
  const [messages, setMessages] = useState<
    { sender: "user" | "bot"; text: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const playAudio = (audioData: string) => {
    if (!audioData) return;

    if (audioRef.current) {
      audioRef.current.pause();
    }

    try {
      const audio = new Audio(audioData); // يقبل Data URL و URLs عادية
      audioRef.current = audio;

      audio.onplay = () => setIsSpeaking(true);
      audio.onended = () => setIsSpeaking(false);
      audio.onerror = (err) => {
        console.error("خطأ في تشغيل الصوت:", err);
        setIsSpeaking(false);
      };

      audio.play().catch((err) => {
        console.error("فشل تشغيل الصوت:", err);
        setIsSpeaking(false);
      });
    } catch (err) {
      console.error("خطأ في إنشاء الصوت:", err);
      setIsSpeaking(false);
    }
  };

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setLoading(true);

    if (audioRef.current) audioRef.current.pause();
    setIsSpeaking(false);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, locale }),
      });

      const data = await res.json();
      const botAnswer = data.answer || "عذراً، لم أتمكن من العثور على إجابة.";

      setMessages((prev) => [...prev, { sender: "bot", text: botAnswer }]);

      // إذا كان الزائر في تبويب "المتحدث الذكي"، شغّل الصوت الصادر من السيرفر فوراً
      if (activeTab === "voice" && data.audioUrl) {
        playAudio(data.audioUrl);
      }
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
          className="w-14 h-14 rounded-full bg-[#0069D2] hover:bg-blue-700 text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-105"
        >
          💬
        </button>
      )}

      {isOpen && (
        <div className="w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[520px]">
          {/* Header وشريط التبديل */}
          <div className="bg-[#0069D2] text-white p-3 flex items-center justify-between gap-2">
            <div className="flex gap-1 bg-black/20 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("text");
                  if (audioRef.current) audioRef.current.pause();
                  setIsSpeaking(false);
                }}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === "text"
                    ? "bg-white text-[#0069D2] shadow-sm"
                    : "text-white/80"
                }`}
              >
                💬 نص
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("voice")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === "voice"
                    ? "bg-white text-[#0069D2] shadow-sm"
                    : "text-white/80"
                }`}
              >
                🎙️ المتحدث الذكي
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                if (audioRef.current) audioRef.current.pause();
                setIsSpeaking(false);
              }}
              className="text-white hover:opacity-80 px-2 text-base font-bold"
            >
              ✕
            </button>
          </div>

          {/* التبويب الأول: محادثة نصية */}
          {activeTab === "text" && (
            <div className="flex-1 flex flex-col justify-between overflow-hidden bg-slate-50">
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {messages.length === 0 && (
                  <p className="text-xs text-slate-400 text-center mt-12">
                    {locale === "ar"
                      ? "مرحباً بك! كيف يمكنني مساعدتك اليوم؟"
                      : "Hello! How can I help you today?"}
                  </p>
                )}

                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-xl p-3 text-xs leading-relaxed ${
                        m.sender === "user"
                          ? "bg-[#0069D2] text-white"
                          : "bg-white border border-slate-200 text-slate-800"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-slate-200 text-xs text-slate-400 p-2.5 rounded-xl animate-pulse">
                      جاري التفكير...
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <form
                onSubmit={handleSend}
                className="p-3 border-t border-slate-200 flex gap-2 bg-white"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="اكتب استفسارك..."
                  className="flex-1 text-xs px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#0069D2] text-white px-4 py-2.5 rounded-xl text-xs font-bold disabled:opacity-50"
                >
                  إرسال
                </button>
              </form>
            </div>
          )}

          {/* التبويب الثاني: المتحدث الذكي */}
          {activeTab === "voice" && (
            <div className="flex-1 flex flex-col items-center justify-between p-4 bg-slate-900 text-white text-center">
              <video
                ref={videoRef}
                autoPlay
                muted
                loop
                className="w-44 h-44 rounded-full object-cover border-4 border-[#0069D2] shadow-2xl"
                src="/brand/welcome.mp4"
              />
              <div className="relative w-44 h-44 rounded-full overflow-hidden border-4 border-[#0069D2] shadow-2xl my-auto bg-slate-800">
                <img
                  src="/brand/Avatar.png"
                  alt="4Relief Voice Assistant"
                  className={`w-full h-full object-cover transition-all duration-300 ${
                    isSpeaking ? "scale-105" : "scale-100"
                  }`}
                />
                {isSpeaking && (
                  <div className="absolute inset-0 rounded-full border-4 border-[#0069D2] animate-ping opacity-75 pointer-events-none" />
                )}
              </div>

              <div className="space-y-1 mb-2">
                <h4 className="font-bold text-xs text-slate-200">
                  المساعد الميداني الذكي
                </h4>
                <p className="text-[11px] text-slate-400">
                  {isSpeaking
                    ? "🔊 جاري التحدث والرد صوتياً..."
                    : loading
                      ? "⏳ جاري تحضير الإجابة..."
                      : "اسأل المساعد وسيجيبك باللغة العربية"}
                </p>
              </div>

              <form onSubmit={handleSend} className="w-full flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="اسأل المساعد المتحدث..."
                  className="flex-1 text-xs px-3 py-2.5 border border-slate-700 bg-slate-800 text-white rounded-xl focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#0069D2] text-white px-4 py-2.5 rounded-xl text-xs font-bold disabled:opacity-50"
                >
                  إرسال
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
