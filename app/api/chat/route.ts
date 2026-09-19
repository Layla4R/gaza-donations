import { NextRequest, NextResponse } from "next/server";

import { NGO_KNOWLEDGE } from "@/lib/ai-knowledge";

import { getSupabaseOrNull } from "@/lib/supabase";

// استدعاء ملفات قواعد البيانات من مجلد data
import chatbotReadyData from "@/data/chatbot_ready_data.json";
import humanitarianIndicators from "@/data/humanitarian_indicators_chatbot_data_2026.json";
import humanitarianWorldReport from "@/data/humanitarian_world_report_2026.json";
import knowledgeBase from "@/data/knowledgeBase.json";
import needyAreasChatbotData from "@/data/needy_areas_chatbot_data_2026.json";
import needyAreasFinal from "@/data/needy_areas_final_2026.json";
import needyAreas from "@/data/needy_areas.json";

export const dynamic = "force-dynamic";

/**
 * ==============================================================
 * تحويل أي ملف بيانات إلى مصفوفة قابلة للبحث
 * ==============================================================
 */
function toKnowledgeArray(data: unknown): any[] {
  if (Array.isArray(data)) {
    return data;
  }

  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;

    if (Array.isArray(obj.data)) {
      return obj.data;
    }

    if (Array.isArray(obj.items)) {
      return obj.items;
    }

    if (Array.isArray(obj.records)) {
      return obj.records;
    }

    if (Array.isArray(obj.results)) {
      return obj.results;
    }

    if (Array.isArray(obj.entries)) {
      return obj.entries;
    }

    if (Array.isArray(obj.rows)) {
      return obj.rows;
    }

    return [data];
  }

  return [];
}

/**
 * ==============================================================
 * دمج جميع ملفات المعرفة في مصدر بحث واحد
 * ==============================================================
 *
 * ترتيب الملفات:
 *
 * 1. chatbot_ready_data
 * 2. humanitarian indicators
 * 3. humanitarian world report
 * 4. knowledgeBase
 * 5. needy areas chatbot data
 * 6. needy areas final
 * 7. needy areas القديمة
 *
 * البحث يعتمد على درجة التطابق وليس فقط ترتيب الملفات.
 */
const combinedKnowledge = [
  ...toKnowledgeArray(chatbotReadyData),
  ...toKnowledgeArray(humanitarianIndicators),
  ...toKnowledgeArray(humanitarianWorldReport),
  ...toKnowledgeArray(knowledgeBase),
  ...toKnowledgeArray(needyAreasChatbotData),
  ...toKnowledgeArray(needyAreasFinal),
  ...toKnowledgeArray(needyAreas),
];

/**
 * ==============================================================
 * تنظيف النص قبل إرساله للمستخدم
 * ==============================================================
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
 * ==============================================================
 * توحيد النص العربي والإنجليزي حتى يصبح البحث أكثر دقة
 * ==============================================================
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
 * ==============================================================
 * كلمات عامة لا تحمل معنى بحثياً قوياً
 * ==============================================================
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
 * ==============================================================
 * استخراج الكلمات المهمة من السؤال
 * ==============================================================
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
 * ==============================================================
 * هل السؤال عن نسبة مئوية؟
 * ==============================================================
 */
function isPercentageQuestion(message: string): boolean {
  const text = normalizeText(message);

  return (
    text.includes("نسبه") ||
    text.includes("بالمئه") ||
    text.includes("بالمئه") ||
    text.includes("مئويه") ||
    text.includes("٪") ||
    text.includes("%") ||
    text.includes("كم تبلغ نسبه") ||
    text.includes("كم تبلغ النسبه")
  );
}

/**
 * ==============================================================
 * هل السؤال عن عدد؟
 * ==============================================================
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
 * ==============================================================
 * الكلمات المرتبطة بالمواضيع
 * ==============================================================
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
 * ==============================================================
 * استخراج المواضيع الموجودة في سؤال المستخدم
 * ==============================================================
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
 * ==============================================================
 * تحويل answer إلى جمل منفصلة
 * ==============================================================
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
 * ==============================================================
 * حساب مدى ارتباط جملة معينة بسؤال المستخدم
 * ==============================================================
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
   * الكلمات المهمة من السؤال
   */
  for (const word of queryWords) {
    if (normalizedSentence.includes(word)) {
      score += 4;
    }
  }

  /**
   * المواضيع المعروفة
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
   * إذا كان السؤال عن نسبة
   */
  if (isPercentageQuestion(message)) {
    if (
      normalizedSentence.includes("%") ||
      normalizedSentence.includes("٪") ||
      normalizedSentence.includes("نسبه") ||
      normalizedSentence.includes("بالمئه") ||
      normalizedSentence.includes("مئويه")
    ) {
      score += 12;
    }
  }

  /**
   * إذا كان السؤال عن عدد
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
 * ==============================================================
 * استخراج الإجابة المحددة من answer
 * ==============================================================
 *
 * بدلاً من إعادة answer كاملاً،
 * نختار الجملة الأقرب للسؤال.
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
   * لا نأخذ جملة ضعيفة.
   */
  if (best.score < 4) {
    return "";
  }

  /**
   * سؤال نسبة:
   * نعيد الجملة الأقرب فقط.
   */
  if (isPercentageQuestion(message)) {
    return best.sentence;
  }

  /**
   * سؤال عدد:
   * نعيد الجملة الأقرب فقط.
   */
  if (isNumberQuestion(message)) {
    return best.sentence;
  }

  /**
   * الأسئلة العامة:
   * أفضل جملة أو جملتين فقط.
   */
  const usefulSentences = scoredSentences
    .filter(
      (item) =>
        item.score >= Math.max(4, best.score - 3)
    )
    .slice(0, 2)
    .map((item) => item.sentence);

  return usefulSentences.join(". ");
}

/**
 * ==============================================================
 * استخراج حقل الإجابة من سجل البيانات
 * ==============================================================
 *
 * ندعم أكثر من اسم للحقل حتى تعمل الملفات الجديدة
 * حتى لو كانت بنيتها مختلفة قليلاً.
 */
function getAnswerFromItem(item: any): string {
  if (!item || typeof item !== "object") {
    return "";
  }

  const possibleAnswers = [
    item.answer,
    item.answer_ar,
    item.answer_en,
    item.response,
    item.result,
    item.content,
    item.text,
  ];

  for (const value of possibleAnswers) {
    if (
      typeof value === "string" &&
      value.trim()
    ) {
      return value.trim();
    }
  }

  return "";
}

/**
 * ==============================================================
 * البحث في جميع ملفات المعرفة
 * ==============================================================
 */
function searchCombinedKnowledge(
  message: string
): string {
  const normalizedMessage =
    normalizeText(message);

  const queryWords =
    getQueryWords(message);

  const questionTopics =
    getQuestionTopics(message);

  if (
    queryWords.length === 0 &&
    questionTopics.length === 0
  ) {
    return "";
  }

  const results = combinedKnowledge
    .map((item: any) => {
      if (
        !item ||
        typeof item !== "object"
      ) {
        return null;
      }

      /**
       * الحقول التي يمكن البحث داخلها.
       *
       * لا نفترض أن جميع ملفات JSON لها نفس البنية.
       */
      const searchableFields = [
        item.question,
        item.question_ar,
        item.question_en,

        item.query,
        item.query_ar,
        item.query_en,

        item.title,
        item.title_ar,
        item.title_en,

        item.category,
        item.category_ar,
        item.category_en,

        item.country,
        item.country_ar,
        item.country_en,

        item.indicator,
        item.indicator_ar,
        item.indicator_en,

        item.topic,
        item.topic_ar,
        item.topic_en,

        item.description,
        item.description_ar,
        item.description_en,

        item.answer,
        item.answer_ar,
        item.answer_en,

        item.content,
        item.text,
        item.response,
        item.result,
        item.value,
      ]
        .filter(
          (value) =>
            value !== undefined &&
            value !== null &&
            String(value).trim() !== ""
        )
        .map((value) => String(value));

      const searchableText =
        normalizeText(
          searchableFields.join(" ")
        );

      if (!searchableText) {
        return null;
      }

      let score = 0;

      /**
       * ----------------------------------------------------------
       * 1. كلمات السؤال
       * ----------------------------------------------------------
       */
      for (const word of queryWords) {
        if (searchableText.includes(word)) {
          score += 3;
        }
      }

      /**
       * ----------------------------------------------------------
       * 2. الموضوع
       * ----------------------------------------------------------
       */
      for (const topic of questionTopics) {
        const aliases =
          TOPIC_ALIASES[topic] || [];

        for (const alias of aliases) {
          const normalizedAlias =
            normalizeText(alias);

          if (
            normalizedAlias.length > 2 &&
            searchableText.includes(
              normalizedAlias
            )
          ) {
            score += 8;
          }
        }
      }

      /**
       * ----------------------------------------------------------
       * 3. الدولة
       * ----------------------------------------------------------
       */
      const countryValues = [
        item.country,
        item.country_ar,
        item.country_en,
      ].filter(Boolean);

      for (const countryValue of countryValues) {
        const country =
          normalizeText(
            String(countryValue)
          );

        if (
          country.length > 2 &&
          normalizedMessage.includes(country)
        ) {
          score += 15;
        }
      }

      /**
       * ----------------------------------------------------------
       * 4. تطابق السؤال مع السؤال الموجود في الداتا
       * ----------------------------------------------------------
       */
      const storedQuestions = [
        item.question,
        item.question_ar,
        item.question_en,
        item.query,
        item.query_ar,
        item.query_en,
      ]
        .filter(Boolean)
        .map((value) =>
          normalizeText(String(value))
        );

      for (const storedQuestion of storedQuestions) {
        if (!storedQuestion) {
          continue;
        }

        /**
         * تطابق كامل
         */
        if (
          normalizedMessage ===
          storedQuestion
        ) {
          score += 40;
        }

        /**
         * نسبة الكلمات المتطابقة
         */
        const questionWords =
          storedQuestion
            .split(/\s+/)
            .filter(
              (word) =>
                word.length > 2 &&
                !STOP_WORDS.has(word)
            );

        if (questionWords.length > 0) {
          let matchedQuestionWords = 0;

          for (const word of questionWords) {
            if (
              normalizedMessage.includes(word)
            ) {
              matchedQuestionWords++;
            }
          }

          const questionMatchRatio =
            matchedQuestionWords /
            questionWords.length;

          if (questionMatchRatio >= 0.8) {
            score += 25;
          } else if (
            questionMatchRatio >= 0.5
          ) {
            score += 12;
          }
        }
      }

      /**
       * ----------------------------------------------------------
       * 5. سؤال عن نسبة
       * ----------------------------------------------------------
       */
      if (isPercentageQuestion(message)) {
        if (
          searchableText.includes("%") ||
          searchableText.includes("٪") ||
          searchableText.includes("نسبه") ||
          searchableText.includes("بالمئه") ||
          searchableText.includes("مئويه")
        ) {
          score += 12;
        }
      }

      /**
       * ----------------------------------------------------------
       * 6. سؤال عن عدد
       * ----------------------------------------------------------
       */
      if (isNumberQuestion(message)) {
        if (/\d/.test(searchableText)) {
          score += 5;
        }

        if (
          searchableText.includes("عدد") ||
          searchableText.includes("يبلغ") ||
          searchableText.includes("بلغ")
        ) {
          score += 5;
        }
      }

      return {
        item,
        score,
      };
    })
    .filter(
      (
        result
      ): result is {
        item: any;
        score: number;
      } =>
        result !== null &&
        result.score >= 5
    )
    .sort(
      (a, b) =>
        b.score - a.score
    );

  if (results.length === 0) {
    return "";
  }

  /**
   * ============================================================
   * نأخذ أفضل النتائج ونستخرج الإجابة المحددة
   * ============================================================
   */
  for (
    const result of results.slice(0, 8)
  ) {
    const item = result.item;

    const answer =
      getAnswerFromItem(item);

    if (!answer) {
      continue;
    }

    /**
     * استخراج المعلومة المطلوبة فقط.
     */
    const focusedAnswer =
      extractFocusedAnswer(
        answer,
        message
      );

    if (focusedAnswer) {
      return focusedAnswer;
    }

    /**
     * إذا كانت الإجابة قصيرة أصلاً
     * وكان تطابق السجل قوياً جداً.
     */
    if (
      answer.trim().length <= 300 &&
      result.score >= 15
    ) {
      return answer.trim();
    }
  }

  return "";
}

/**
 * ==============================================================
 * إيجاد الدولة داخل knowledgeBase القديم
 * ==============================================================
 */
function findCountryItem(
  message: string
): any | null {
  const normMessage =
    normalizeText(message);

  for (
    const item of knowledgeBase as any[]
  ) {
    if (
      !item.country_ar ||
      !item.answer
    ) {
      continue;
    }

    const countryArabic =
      normalizeText(
        item.country_ar
      );

    if (
      countryArabic.length > 2 &&
      normMessage.includes(
        countryArabic
      )
    ) {
      return item;
    }
  }

  return null;
}

/**
 * ==============================================================
 * البحث في needy_areas القديم
 * ==============================================================
 */
function findNeedyAreaItems(
  message: string
): any[] {
  const queryWords =
    getQueryWords(message);

  if (queryWords.length === 0) {
    return [];
  }

  const questionTopics =
    getQuestionTopics(message);

  const results =
    (needyAreas as any[])
      .filter((item: any) => {
        if (
          !item.category ||
          !item.answer
        ) {
          return false;
        }

        return true;
      })
      .map((item: any) => {
        const targetText =
          normalizeText(
            `${item.category} ${item.answer}`
          );

        let score = 0;

        /**
         * كلمات السؤال
         */
        for (
          const word of queryWords
        ) {
          if (
            targetText.includes(word)
          ) {
            score += 4;
          }
        }

        /**
         * الموضوع
         */
        for (
          const topic of questionTopics
        ) {
          const aliases =
            TOPIC_ALIASES[topic] ||
            [];

          for (
            const alias of aliases
          ) {
            if (
              targetText.includes(
                normalizeText(alias)
              )
            ) {
              score += 7;
            }
          }
        }

        /**
         * أسئلة النسب
         */
        if (
          isPercentageQuestion(message)
        ) {
          if (
            targetText.includes("%") ||
            targetText.includes("٪") ||
            targetText.includes("نسبه") ||
            targetText.includes("بالمئه") ||
            targetText.includes("مئويه")
          ) {
            score += 8;
          }
        }

        /**
         * أسئلة الأعداد
         */
        if (
          isNumberQuestion(message)
        ) {
          if (
            /\d/.test(item.answer)
          ) {
            score += 3;
          }
        }

        return {
          item,
          score,
        };
      })
      .filter(
        (result) =>
          result.score >= 4
      )
      .sort(
        (a, b) =>
          b.score - a.score
      );

  return results.map(
    (result) => result.item
  );
}

/**
 * ==============================================================
 * البحث المحلي الكامل
 * ==============================================================
 *
 * الترتيب:
 *
 * 1. جميع ملفات البيانات الجديدة والقديمة
 * 2. البحث القديم في knowledgeBase
 * 3. البحث القديم في needyAreas
 * 4. إذا لم نجد شيء -> Groq
 * ==============================================================
 */
function searchLocalKnowledge(
  message: string
): string {

  // ============================================================
  // 1. البحث أولاً في جميع ملفات البيانات المدمجة
  // ============================================================

  const combinedAnswer =
    searchCombinedKnowledge(
      message
    );

  if (combinedAnswer) {
    return combinedAnswer;
  }

  // ============================================================
  // 2. البحث القديم في knowledgeBase
  // ============================================================

  const countryItem =
    findCountryItem(message);

  if (countryItem) {
    const focusedAnswer =
      extractFocusedAnswer(
        countryItem.answer,
        message
      );

    if (focusedAnswer) {
      return focusedAnswer;
    }
  }

  // ============================================================
  // 3. البحث القديم في needy_areas
  // ============================================================

  const matchingItems =
    findNeedyAreaItems(message);

  if (
    matchingItems.length > 0
  ) {
    for (
      const item of matchingItems.slice(
        0,
        5
      )
    ) {
      const focusedAnswer =
        extractFocusedAnswer(
          item.answer,
          message
        );

      if (focusedAnswer) {
        return focusedAnswer;
      }
    }
  }

  // ============================================================
  // 4. لم نجد إجابة محلية دقيقة
  //    سيتم الانتقال إلى Groq
  // ============================================================

  return "";
}

export async function POST(
  req: NextRequest
) {
  try {
    const {
      message,
      locale = "ar",
    } = await req.json();

    if (
      typeof message !== "string" ||
      !message.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "Message is required",
        },
        {
          status: 400,
        }
      );
    }

    let rawAnswer = "";

    // ==============================================================
    // 1. الطلقة الأولى:
    // البحث المحلي في جميع ملفات JSON
    // ==============================================================

    rawAnswer =
      searchLocalKnowledge(
        message
      );

    // ==============================================================
    // 2. الطلقة الثانية:
    // إذا لم يجد الإجابة في الملفات، يتجه إلى Groq
    // ==============================================================

    if (!rawAnswer) {
      const apiKey =
        process.env.GROQ_API_KEY;

      if (!apiKey) {
        return NextResponse.json(
          {
            error:
              "مفتاح API غير موجود",
          },
          {
            status: 500,
          }
        );
      }

      const supabase =
        getSupabaseOrNull();

      let dynamicContext = "";

      if (supabase) {
        try {
          const [
            campaignsRes,
            pagesRes,
          ] = await Promise.all([
            supabase
              .from("Campaign")
              .select(
                "slug, title, description"
              )
              .limit(10),

            supabase
              .from("Page")
              .select(
                "slug, title, description"
              )
              .limit(20),
          ]);

          if (
            campaignsRes.data &&
            campaignsRes.data.length >
              0
          ) {
            dynamicContext +=
              "\n\n🔥 الحملات والمشاريع المتاحة للتبرع:\n";

            campaignsRes.data.forEach(
              (campaign: any) => {
                dynamicContext += `- ${
                  campaign.title
                }: ${
                  campaign.description ||
                  ""
                } (الرابط: /${locale}/campaigns/${campaign.slug})\n`;
              }
            );
          }

          if (
            pagesRes.data &&
            pagesRes.data.length >
              0
          ) {
            dynamicContext +=
              "\n\n🏢 صفحات تعريفية وسياسات المنظمة:\n";

            pagesRes.data.forEach(
              (page: any) => {
                dynamicContext += `- ${
                  page.title
                }: ${
                  page.description ||
                  ""
                } (الرابط: /${locale}/${page.slug})\n`;
              }
            );
          }
        } catch (dbError) {
          console.error(
            "خطأ أثناء جلب البيانات من Supabase:",
            dbError
          );
        }
      }

      const languageDirectives: Record<
        string,
        string
      > = {
        ar: "أجب باللغة العربية الفصحى فقط وبشكل واضح وبدون استخدام أي كلمات إنجليزية إطلاقاً.",

        tr: "Lütfen cevabınızı tamamen Türkçe olarak verin.",

        fr: "Veuillez répondre exclusivement en français.",

        en: "Please respond exclusively in clear English.",
      };

      const targetLanguageDirective =
        languageDirectives[
          locale
        ] ||
        languageDirectives.ar;

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
5. إذا سأل المستخدم عن دولة، استخدم المعلومات الخاصة بالدولة فقط.
6. لا تخلط بين مؤشرات مختلفة.
7. لا تخترع أي رقم أو نسبة أو معلومة غير موجودة في المعلومات المتاحة.
8. إذا لم تكن المعلومة موجودة بشكل واضح، قل إن المعلومات المتاحة لا تتضمن إجابة مؤكدة.
9. لا تعتبر وجود كلمة مشتركة دليلاً على أن المعلومة هي الإجابة.
10. افهم المقصود من السؤال قبل صياغة الإجابة.

المعلومات الأساسية:

${NGO_KNOWLEDGE}

${dynamicContext}
`;

      const response =
        await fetch(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            method: "POST",

            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              model:
                "openai/gpt-oss-120b",

              messages: [
                {
                  role: "system",
                  content:
                    systemInstruction,
                },

                {
                  role: "user",
                  content:
                    message,
                },
              ],

              temperature: 0.1,

              max_tokens: 250,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        console.error(
          "Groq API Error:",
          data
        );

        return NextResponse.json(
          {
            error:
              "حدث خطأ أثناء الاتصال بخدمة الذكاء الاصطناعي.",
          },
          {
            status: 502,
          }
        );
      }

      rawAnswer =
        data.choices?.[0]
          ?.message?.content ||
        "";
    }

    // ==============================================================
    // 3. التنظيف النهائي وتحويل النص إلى صوت
    // ==============================================================

    const cleanedAnswer =
      cleanTextForOutput(
        rawAnswer
      );

    let audioUrl = "";

    const elevenKey =
      process.env
        .ELEVENLABS_API_KEY;

    if (
      cleanedAnswer &&
      elevenKey
    ) {
      try {
        const voiceId =
          "pNInz6obpgDQGcFmaJgB";

        const ttsRes =
          await fetch(
            `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
            {
              method: "POST",

              headers: {
                Accept:
                  "audio/mpeg",
                "Content-Type":
                  "application/json",
                "xi-api-key":
                  elevenKey,
              },

              body: JSON.stringify({
                text: cleanedAnswer,

                model_id:
                  "eleven_multilingual_v2",

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
            Buffer.from(
              arrayBuffer
            ).toString(
              "base64"
            );

          audioUrl =
            `data:audio/mpeg;base64,${base64Audio}`;
        } else {
          console.error(
            "ElevenLabs Error:",
            await ttsRes.text()
          );
        }
      } catch (
        ttsError
      ) {
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
      {
        status: 500,
      }
    );
  }
}