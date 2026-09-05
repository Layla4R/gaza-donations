import { NextRequest, NextResponse } from "next/server";
import { NGO_KNOWLEDGE } from "@/lib/ai-knowledge";
import { getSupabaseOrNull } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { message, locale = "ar" } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "مفتاح API غير موجود" }, { status: 500 });
    }

    const supabase = getSupabaseOrNull();
    let dynamicContext = "";

    if (supabase) {
      try {
        // جلب البيانات من الجداول الفعلية المعروضة في الصورة
        const [campaignsRes, pagesRes, newsRes] = await Promise.all([
          supabase.from("Campaign").select("slug, title, description").limit(10),
          supabase.from("Page").select("slug, title, description").limit(20),
          supabase.from("NewsPost").select("slug, title, excerpt").limit(5)
        ]);

        if (campaignsRes.data && campaignsRes.data.length > 0) {
          dynamicContext += "\n\n🔥 الحملات والمشاريع المتاحة للتبرع:\n";
          campaignsRes.data.forEach((c: any) => {
            dynamicContext += `- ${c.title}: ${c.description || ""} (الرابط: /${locale}/campaigns/${c.slug})\n`;
          });
        }

        if (pagesRes.data && pagesRes.data.length > 0) {
          dynamicContext += "\n\n🏢 صفحات تعريفية وسياسات المنظمة (ديناميكية):\n";
          pagesRes.data.forEach((p: any) => {
            dynamicContext += `- ${p.title}: ${p.description || ""} (الرابط: /${locale}/${p.slug})\n`;
          });
        }

        if (newsRes.data && newsRes.data.length > 0) {
          dynamicContext += "\n\n📰 أحدث الأخبار:\n";
          newsRes.data.forEach((n: any) => {
            dynamicContext += `- ${n.title}: ${n.excerpt || ""} (الرابط: /${locale}/news/${n.slug})\n`;
          });
        }
      } catch (dbError) {
        console.error("خطأ أثناء جلب البيانات من Supabase:", dbError);
      }
    }

    const systemInstruction = `أنت المساعد الذكي الرسمي والودود لمؤسسة 4Relief (و Destekol). مهمتك الإجابة على استفسارات الزوار باحترافية، شفافية، وبنفس لغة المستخدم.

المعلومات المؤسسية الأساسية:
${NGO_KNOWLEDGE}

المعلومات المباشرة من قاعدة بيانات الموقع (حملات، صفحات تعريفية، سياسات، وأخبار):
${dynamicContext}

قواعد الإجابة:
- كن مختصراً، واضحاً، ومباشراً (لا تتجاوز 4 أسطر).
- إذا سأل المستخدم عن موضوع معين (مثل الشفافية، من نحن، المشاريع، أو سياسة الخصوصية)، ابحث في القائمة أعلاه واذكر له الخلاصة مع الرابط المباشر للصفحة.
- لا تخترع أي أرقام أو مشاريع أو سياسات غير موجودة في البيانات أعلاه.`;

    const url = "https://api.groq.com/openai/v1/chat/completions";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: message }
        ],
        temperature: 0.2, // نسبة إبداع منخفضة لضمان دقة النقل من الجداول
        max_tokens: 350
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[Groq API Error]:", data);
      return NextResponse.json({ error: "تم رفض الطلب من سيرفر Groq" }, { status: 500 });
    }

    const answer = data.choices?.[0]?.message?.content;

    return NextResponse.json({ answer: answer || "عذراً، لم أتمكن من إيجاد إجابة." });
  } catch (error: any) {
    console.error("[Chat API Error]:", error);
    return NextResponse.json(
      { 
        error: "حدث خطأ أثناء الاتصال بالمساعد الذكي.",
        details: error.message 
      },
      { status: 500 }
    );
  }
}