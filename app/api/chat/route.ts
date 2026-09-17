import { NextRequest, NextResponse } from "next/server";

import { NGO_KNOWLEDGE } from "@/lib/ai-knowledge";

import { getSupabaseOrNull } from "@/lib/supabase";

// استدعاء ملفات قواعد البيانات من مجلد data
import knowledgeBase from "@/data/knowledgeBase.json";

import needyAreas from "@/data/needy_areas.json";

export const dynamic = "force-dynamic";

/**
 * تنظيف النص قبل إرساله للمستخدم
 */
function cleanTextForOutput(text: string): string {
  if (!text) return "";

  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[\*\_\~\`#()[\]]/g, "")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * توحيد النص العربي والإنجليزي حتى يصبح البحث أكثر دقة.
 */
function normalizeText(text: string): string {
  return text
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/ـ/g, "")
    .replace(/[ًٌٍَُِّْ]/g, "")
    .toLowerCase()
    .trim();
}

/**
 * كلمات عامة لا تحمل معنى بحثياً قوياً.
 */
const STOP_WORDS = new Set([
  "ما",
  "ماذا",
  "هل",
  "كم",
  "كيف",
  "اين",
  "متى",
  "من",
  "عن",
  "الى",
  "في",
  "على",
  "مع",
  "هو",
  "هي",
  "هم",
  "ان",
  "أن",
  "كان",
  "كانت",
  "لدي",
  "لدى",
  "اريد",
  "أريد",
  "اعطني",
  "أعطني",
  "اخبرني",
  "أخبرني",
  "حدثني",
  "معلومات",
  "ملخص",
  "ملخصا",
  "ملخصًا",
  "احصائيات",
  "إحصائيات",
  "عن",
  "هذه",
  "هذا",
  "ذلك",
  "تلك",
  "منظمة",
  "المنظمة",
  "المساعد",
  "المساعده",
  "المساعدة",
]);

/**
 * استخراج الكلمات المهمة من السؤال.
 */
function getQueryWords(text: string): string[] {
  return normalizeText(text)
    .replace(/[؟?!.,،:؛()"']/g, " ")
    .split(/\s+/)
    .filter((word) => {
      return word.length > 2 && !STOP_WORDS.has(word);
    });
}

/**
 * كلمات تشير إلى أن المستخدم يريد نسبة مئوية.
 */
function isPercentageQuestion(message: string): boolean {
  const text = normalizeText(message);

  return (
    text.includes("نسبه") ||
    text.includes("نسبة") ||
    text.includes("بالمئه") ||
    text.includes("بالمئة") ||
    text.includes("مئويه") ||
    text.includes("مئوية") ||
    text.includes("٪") ||
    text.includes("%") ||
    text.includes("كم تبلغ نسبه") ||
    text.includes("كم تبلغ النسبه")
  );
}

/**
 * كلمات تشير إلى أن المستخدم يسأل عن عدد.
 */
function isNumberQuestion(message: string): boolean {
  const text = normalizeText(message);

  return (
    text.includes("كم عدد") ||
    text.includes("عدد") ||
    text.includes("كم يبلغ") ||
    text.includes("كم تبلغ") ||
    text.includes("كم شخص") ||
    text.includes("كم اسره") ||
    text.includes("كم عائله")
  );
}

/**
 * كلمات تساعد على معرفة الموضوع المطلوب.
 *
 * هذه الكلمات لا تعطي الإجابة،
 * وإنما تساعدنا على اختيار الجملة الصحيحة من answer.
 */
const TOPIC_ALIASES: Record<string, string[]> = {
  water: [
    "مياه",
    "المياه",
    "ماء",
    "الماء",
    "توفر المياه",
    "الحصول على المياه",
    "مياه الشرب",
    "الشرب",
    "water",
    "drinking water",
  ],

  poverty: [
    "فقر",
    "الفقر",
    "فقرا",
    "poverty",
  ],

  population: [
    "سكان",
    "السكان",
    "عدد السكان",
    "population",
  ],

  refugees: [
    "لاجئين",
    "اللاجئون",
    "اللاجئين",
    "لاجئ",
    "refugees",
    "refugee",
  ],

  education: [
    "تعليم",
    "التعليم",
    "مدارس",
    "مدرسة",
    "education",
    "school",
  ],

  health: [
    "صحة",
    "الصحة",
    "صحي",
    "الصحي",
    "مستشفى",
    "مستشفيات",
    "health",
    "hospital",
  ],

  economy: [
    "اقتصاد",
    "الاقتصاد",
    "النمو الاقتصادي",
    "نمو اقتصادي",
    "اقتصادي",
    "economic",
    "economy",
  ],

  employment: [
    "عمل",
    "العمل",
    "وظائف",
    "البطالة",
    "عاطل",
    "employment",
    "unemployment",
  ],

  food: [
    "غذاء",
    "الغذاء",
    "طعام",
    "الجوع",
    "الجوعى",
    "food",
    "hunger",
  ],

  housing: [
    "سكن",
    "السكن",
    "مأوى",
    "المأوى",
    "مساكن",
    "housing",
    "shelter",
  ],

  development: [
    "تنمية",
    "التنمية",
    "مؤشر التنمية",
    "التنمية البشرية",
    "development",
  ],

  bank: [
    "بطاقة",
    "البطاقه",
    "بطاقات",
    "البنك",
    "البنك الدولي",
    "bank",
  ],
};

/**
 * استخراج المواضيع الموجودة في سؤال المستخدم.
 */
function getQuestionTopics(message: string): string[] {
  const normalizedMessage = normalizeText(message);

  const topics: string[] = [];

  for (const [topic, aliases] of Object.entries(TOPIC_ALIASES)) {
    const found = aliases.some((alias) =>
      normalizedMessage.includes(normalizeText(alias))
    );

    if (found) {
      topics.push(topic);
    }
  }

  return topics;
}

/**
 * تحويل answer إلى جمل منفصلة.
 *
 * الهدف:
 * عدم إعادة answer كاملاً،
 * وإنما اختيار الجملة التي تتحدث عن المعلومة المطلوبة.
 */
function splitIntoSentences(text: string): string[] {
  if (!text) return [];

  return text
    .replace(/\r\n/g, "\n")
    .split(/[.!؟?؛;\n]+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 0);
}

/**
 * حساب مدى ارتباط جملة معينة بسؤال المستخدم.
 */
function scoreSentence(
  sentence: string,
  queryWords: string[],
  questionTopics: string[],
  message: string
): number {
  const normalizedSentence = normalizeText(sentence);

  let score = 0;

  /**
   * الكلمات المهمة من السؤال.
   */
  for (const word of queryWords) {
    if (normalizedSentence.includes(word)) {
      score += 4;
    }
  }

  /**
   * المواضيع المعروفة.
   */
  for (const topic of questionTopics) {
    const aliases = TOPIC_ALIASES[topic] || [];

    for (const alias of aliases) {
      if (normalizedSentence.includes(normalizeText(alias))) {
        score += 8;
      }
    }
  }

  /**
   * إذا كان السؤال عن نسبة،
   * نرفع أولوية الجمل التي تحتوي نسبة.
   */
  if (isPercentageQuestion(message)) {
    if (
      normalizedSentence.includes("%") ||
      normalizedSentence.includes("٪") ||
      normalizedSentence.includes("نسبه") ||
      normalizedSentence.includes("بالمئه") ||
      normalizedSentence.includes("بالمئة")
    ) {
      score += 12;
    }
  }

  /**
   * إذا كان السؤال عن عدد،
   * نرفع أولوية الجمل التي تحتوي أرقاماً.
   */
  if (isNumberQuestion(message)) {
    if (/\d/.test(sentence)) {
      score += 5;
    }

    if (
      normalizedSentence.includes("عدد") ||
      normalizedSentence.includes("يبلغ") ||
      normalizedSentence.includes("بلغ")
    ) {
      score += 5;
    }
  }

  return score;
}

/**
 * استخراج الإجابة المحددة من answer.
 *
 * هذه هي أهم إضافة في الكود.
 *
 * بدلاً من:
 *
 * rawAnswer = item.answer
 *
 * نقوم باختيار الجملة الأقرب للسؤال.
 */
function extractFocusedAnswer(
  answer: string,
  message: string
): string {
  if (!answer) return "";

  const sentences = splitIntoSentences(answer);

  if (sentences.length === 0) {
    return answer.trim();
  }

  const queryWords = getQueryWords(message);
  const questionTopics = getQuestionTopics(message);

  /**
   * إذا كان لدينا موضوع واضح،
   * نحاول أولاً العثور على الجملة المتعلقة به.
   */
  const scoredSentences = sentences
    .map((sentence) => ({
      sentence,
      score: scoreSentence(
        sentence,
        queryWords,
        questionTopics,
        message
      ),
    }))
    .sort((a, b) => b.score - a.score);

  if (scoredSentences.length === 0) {
    return "";
  }

  const best = scoredSentences[0];

  /**
   * لا نأخذ جملة ضعيفة جداً.
   *
   * لأن اختيار أي جملة عشوائية أسوأ من
   * الانتقال إلى Groq.
   */
  if (best.score < 4) {
    return "";
  }

  /**
   * إذا كان السؤال عن نسبة،
   * نعيد الجملة الأقرب فقط.
   */
  if (isPercentageQuestion(message)) {
    return best.sentence;
  }

  /**
   * إذا كان السؤال عن عدد،
   * نعيد الجملة الأقرب فقط.
   */
  if (isNumberQuestion(message)) {
    return best.sentence;
  }

  /**
   * الأسئلة العامة:
   * نعيد أفضل جملة أو جملتين فقط،
   * بدلاً من إعادة كامل answer.
   */
  const usefulSentences = scoredSentences
    .filter((item) => item.score >= Math.max(4, best.score - 3))
    .slice(0, 2)
    .map((item) => item.sentence);

  return usefulSentences.join(". ");
}

/**
 * إيجاد الدولة داخل السؤال.
 */
function findCountryItem(message: string): any | null {
  const normMessage = normalizeText(message);

  for (const item of knowledgeBase as any[]) {
    if (!item.country_ar || !item.answer) continue;

    const countryArabic = normalizeText(item.country_ar);

    if (
      countryArabic.length > 2 &&
      normMessage.includes(countryArabic)
    ) {
      return item;
    }
  }

  return null;
}

/**
 * البحث في needy_areas.json مع ترتيب النتائج حسب
 * مدى ارتباطها بالسؤال.
 */
function findNeedyAreaItems(message: string): any[] {
  const queryWords = getQueryWords(message);

  if (queryWords.length === 0) {
    return [];
  }

  const questionTopics = getQuestionTopics(message);

  const results = (needyAreas as any[])
    .filter((item: any) => {
      if (!item.category || !item.answer) {
        return false;
      }

      return true;
    })
    .map((item: any) => {
      const targetText = normalizeText(
        `${item.category} ${item.answer}`
      );

      let score = 0;

      /**
       * كلمات السؤال.
       */
      for (const word of queryWords) {
        if (targetText.includes(word)) {
          score += 4;
        }
      }

      /**
       * الموضوع.
       */
      for (const topic of questionTopics) {
        const aliases = TOPIC_ALIASES[topic] || [];

        for (const alias of aliases) {
          if (targetText.includes(normalizeText(alias))) {
            score += 7;
          }
        }
      }

      /**
       * أسئلة النسب.
       */
      if (isPercentageQuestion(message)) {
        if (
          targetText.includes("%") ||
          targetText.includes("٪") ||
          targetText.includes("نسبه") ||
          targetText.includes("بالمئه") ||
          targetText.includes("بالمئة")
        ) {
          score += 8;
        }
      }

      /**
       * أسئلة الأعداد.
       */
      if (isNumberQuestion(message)) {
        if (/\d/.test(item.answer)) {
          score += 3;
        }
      }

      return {
        item,
        score,
      };
    })
    .filter((result) => result.score >= 4)
    .sort((a, b) => b.score - a.score);

  return results.map((result) => result.item);
}

/**
 * البحث الذكي في الملفات المحلية.
 *
 * النتيجة هنا ليست answer كاملاً،
 * وإنما إجابة مركزة حسب السؤال.
 */
function searchLocalKnowledge(message: string): string {
  /**
   * --------------------------------------------------------------
   * 1. البحث في knowledgeBase.json حسب الدولة
   * --------------------------------------------------------------
   */
  const countryItem = findCountryItem(message);

  if (countryItem) {
    const focusedAnswer = extractFocusedAnswer(
      countryItem.answer,
      message
    );

    if (focusedAnswer) {
      return focusedAnswer;
    }
  }

  /**
   * --------------------------------------------------------------
   * 2. البحث في needy_areas.json
   * --------------------------------------------------------------
   */
  const matchingItems = findNeedyAreaItems(message);

  if (matchingItems.length > 0) {
    /**
     * نجرب أفضل النتائج واحدة واحدة.
     *
     * لا نأخذ 3 إجابات كاملة كما كان يحصل سابقاً.
     */
    for (const item of matchingItems.slice(0, 5)) {
      const focusedAnswer = extractFocusedAnswer(
        item.answer,
        message
      );

      if (focusedAnswer) {
        return focusedAnswer;
      }
    }
  }

  /**
   * لم نجد إجابة محلية دقيقة.
   *
   * هنا نترك القيمة فارغة حتى ينتقل الكود إلى Groq.
   */
  return "";
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

    let rawAnswer = "";

    // ==============================================================
    // 1. الطلقة الأولى: البحث المحلي المباشر في ملفات الـ JSON
    // ==============================================================

    /**
     * هنا التغيير الأساسي:
     *
     * سابقاً:
     * rawAnswer = item.answer;
     *
     * الآن:
     * نبحث داخل answer ونستخرج المعلومة المرتبطة بالسؤال فقط.
     */
    rawAnswer = searchLocalKnowledge(message);

    // ==============================================================
    // 2. الطلقة الثانية: إذا لم يجد الإجابة في الملفات، يتجه إلى Groq
    // ==============================================================

    if (!rawAnswer) {
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
            supabase
              .from("Campaign")
              .select("slug, title, description")
              .limit(10),

            supabase
              .from("Page")
              .select("slug, title, description")
              .limit(20),
          ]);

          if (
            campaignsRes.data &&
            campaignsRes.data.length > 0
          ) {
            dynamicContext +=
              "\n\n🔥 الحملات والمشاريع المتاحة للتبرع:\n";

            campaignsRes.data.forEach((campaign: any) => {
              dynamicContext += `- ${campaign.title}: ${
                campaign.description || ""
              } (الرابط: /${locale}/campaigns/${campaign.slug})\n`;
            });
          }

          if (
            pagesRes.data &&
            pagesRes.data.length > 0
          ) {
            dynamicContext +=
              "\n\n🏢 صفحات تعريفية وسياسات المنظمة:\n";

            pagesRes.data.forEach((page: any) => {
              dynamicContext += `- ${page.title}: ${
                page.description || ""
              } (الرابط: /${locale}/${page.slug})\n`;
            });
          }
        } catch (dbError) {
          console.error(
            "خطأ أثناء جلب البيانات من Supabase:",
            dbError
          );
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

      const systemInstruction = `
أنت المساعد الميداني الذكي لـ 4Relief و Destekol.

${targetLanguageDirective}

اكتب الإجابة كنص عادي بسيط بدون رموز ماركداون.

كن مختصراً جداً، بأسلوب محادثة واضحة ومباشرة، ولا تتجاوز 2 إلى 3 أسطر إلا إذا كانت الإجابة تحتاج إلى ذلك.

قواعد مهمة جداً:

1. أجب عن السؤال المحدد الذي طرحه المستخدم فقط.
2. لا تعيد فقرة كاملة من البيانات إذا كان السؤال يطلب معلومة واحدة فقط.
3. إذا سأل المستخدم عن نسبة، أعطه النسبة المطلوبة فقط مع توضيح بسيط جداً.
4. إذا سأل المستخدم عن عدد، أعطه العدد المطلوب فقط.
5. إذا سأل عن دولة، استخدم المعلومات الخاصة بالدولة فقط.
6. لا تخلط بين مؤشرات مختلفة.
7. لا تخترع أي رقم أو نسبة أو معلومة غير موجودة في المعلومات المتاحة.
8. إذا لم تكن المعلومة موجودة بشكل واضح، قل إن المعلومات المتاحة لا تتضمن إجابة مؤكدة.
9. لا تعتبر وجود كلمة مشتركة دليلاً على أن المعلومة هي الإجابة.
10. افهم المقصود من السؤال قبل صياغة الإجابة.

المعلومات الأساسية:

${NGO_KNOWLEDGE}

${dynamicContext}
`;

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
              {
                role: "system",
                content: systemInstruction,
              },

              {
                role: "user",
                content: message,
              },
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
          {
            error:
              "حدث خطأ أثناء الاتصال بخدمة الذكاء الاصطناعي.",
          },
          { status: 502 }
        );
      }

      rawAnswer =
        data.choices?.[0]?.message?.content || "";
    }

    // ==============================================================
    // 3. التنظيف النهائي وتحويل النص إلى صوت
    // ==============================================================

    const cleanedAnswer = cleanTextForOutput(rawAnswer);

    let audioUrl = "";

    const elevenKey =
      process.env.ELEVENLABS_API_KEY;

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
          const arrayBuffer =
            await ttsRes.arrayBuffer();

          const base64Audio =
            Buffer.from(arrayBuffer).toString("base64");

          audioUrl =
            `data:audio/mpeg;base64,${base64Audio}`;
        } else {
          console.error(
            "ElevenLabs Error:",
            await ttsRes.text()
          );
        }
      } catch (ttsError) {
        console.error(
          "ElevenLabs Exception:",
          ttsError
        );
      }
    }

    return NextResponse.json({
      answer:
        cleanedAnswer ||
        "عذراً، لم أتمكن من إيجاد إجابة.",
      audioUrl,
    });
  } catch (error) {
    console.error(
      "[Chat API Error]:",
      error
    );

    return NextResponse.json(
      {
        error:
          "حدث خطأ أثناء الاتصال بالمساعد الذكي.",
      },
      { status: 500 }
    );
  }
}