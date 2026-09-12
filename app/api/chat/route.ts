import { NextRequest, NextResponse } from "next/server";
import { NGO_KNOWLEDGE } from "@/lib/ai-knowledge";
import { getSupabaseOrNull } from "@/lib/supabase";

export const dynamic = "force-dynamic";

function cleanTextForOutput(text: string): string {
  if (!text) return "";

  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_~`#()[\]]/g, "")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export async function POST(req: NextRequest) {
  try {
    const { message, locale = "ar" } = await req.json();

    if (typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "مفتاح API غير موجود" },
        { status: 500 }
      );
    }

    const supabase = getSupabaseOrNull();
    let dynamicContext = "";

    if (supabase) {
      try {
        const [campaignsRes, pagesRes] = await Promise.all([
          supabase.from("Campaign").select("slug, title, description").limit(10),
          supabase.from("Page").select("slug, title, description").limit(20),
        ]);

        if (campaignsRes.data && campaignsRes.data.length > 0) {
          dynamicContext += "\n\n🔥 الحملات والمشاريع المتاحة للتبرع:\n";
          campaignsRes.data.forEach((campaign: any) => {
            dynamicContext += `- ${campaign.title}: ${campaign.description || ""} (الرابط: /${locale}/campaigns/${campaign.slug})\n`;
          });
        }

        if (pagesRes.data && pagesRes.data.length > 0) {
          dynamicContext += "\n\n🏢 صفحات تعريفية وسياسات المنظمة:\n";
          pagesRes.data.forEach((page: any) => {
            dynamicContext += `- ${page.title}: ${page.description || ""} (الرابط: /${locale}/${page.slug})\n`;
          });
        }
      } catch (dbError) {
        console.error("خطأ أثناء جلب البيانات من Supabase:", dbError);
      }
    }

    const languageDirectives: Record<string, string> = {
      ar: "أجب باللغة العربية الفصحى فقط وبشكل واضح وبدون استخدام أي كلمات إنجليزية إطلاقاً.",
      tr: "Lütfen cevabınızı tamamen Türkçe olarak verin.",
      fr: "Veuillez répondre exclusivement en français.",
      en: "Please respond exclusively in clear English.",
    };

    const targetLanguageDirective =
      languageDirectives[locale] || languageDirectives.ar;

    const systemInstruction = `أنت المساعد الميداني الذكي لـ 4Relief و Destekol.
${targetLanguageDirective}
اكتب الإجابة كنص عادي بسيط بدون رموز ماركداون.
كن مختصراً جداً (أسلوب محادثة شفهية لا تتجاوز 2 إلى 3 أسطر).
المعلومات الأساسية:
${NGO_KNOWLEDGE}
${dynamicContext}`;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-120b",
          messages: [
            { role: "system", content: systemInstruction },
            { role: "user", content: message },
          ],
          temperature: 0.1,
          max_tokens: 250,
        }),
      }
    );

    const data = await response.json();
    if (!response.ok) {
      console.error("Groq API Error:", data);
      return NextResponse.json(
        { error: "حدث خطأ أثناء الاتصال بخدمة الذكاء الاصطناعي." },
        { status: 502 }
      );
    }

    const rawAnswer = data.choices?.[0]?.message?.content || "";
    const cleanedAnswer = cleanTextForOutput(rawAnswer);

    let audioUrl = "";
    const elevenKey = process.env.ELEVENLABS_API_KEY;

    if (cleanedAnswer && elevenKey) {
      try {
        const voiceId = "pNInz6obpgDQGcFmaJgB";

        const ttsRes = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
          {
            method: "POST",
            headers: {
              Accept: "audio/mpeg",
              "Content-Type": "application/json",
              "xi-api-key": elevenKey,
            },
            body: JSON.stringify({
              text: cleanedAnswer,
              model_id: "eleven_multilingual_v2",
              voice_settings: {
                stability: 0.5,
                similarity_boost: 0.75,
              },
            }),
          }
        );

        if (ttsRes.ok) {
          const arrayBuffer = await ttsRes.arrayBuffer();
          const base64Audio = Buffer.from(arrayBuffer).toString("base64");
          audioUrl = `data:audio/mpeg;base64,${base64Audio}`;
        } else {
          console.error("ElevenLabs Error:", await ttsRes.text());
        }
      } catch (ttsError) {
        console.error("ElevenLabs Exception:", ttsError);
      }
    }

    return NextResponse.json({
      answer: cleanedAnswer || "عذراً، لم أتمكن من إيجاد إجابة.",
      audioUrl,
    });
  } catch (error) {
    console.error("[Chat API Error]:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء الاتصال بالمساعد الذكي." },
      { status: 500 }
    );
  }
}