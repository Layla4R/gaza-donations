import { NextRequest, NextResponse } from "next/server";

// 🌟 السماح لـ Next.js بالانتظار حتى 120 ثانية (لأن CrewAI يحتاج ~75 ثانية لمعالجة الـ PDFs)
export const maxDuration = 120;
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const apiKey = process.env.CREWAI_API_KEY;
    let rawUrl = (process.env.CREWAI_WORKFLOW_URL || "").trim().replace(/\/+$/, "");

    if (!rawUrl || !apiKey) {
      throw new Error("CrewAI environment variables missing");
    }

    const baseUrl = rawUrl.replace(/\/kickoff$/, "");
    const kickoffUrl = `${baseUrl}/kickoff`;

    const headers = {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    };

    console.log(`[CrewAI] Starting kickoff for: "${message}"`);

    // 1. البدء بحقل visitor_question الدقيق
    const kickoffRes = await fetch(kickoffUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({
        inputs: {
          visitor_question: message,
        },
      }),
    });

    if (!kickoffRes.ok) {
      const errText = await kickoffRes.text();
      console.error(`[CrewAI Kickoff Error] Status: ${kickoffRes.status}`, errText);
      throw new Error(`CrewAI returned status ${kickoffRes.status}`);
    }

    const kickoffData = await kickoffRes.json();
    const kickoffId = kickoffData.kickoff_id || kickoffData.id;

    if (!kickoffId) {
      throw new Error("No kickoff_id received from CrewAI");
    }

    console.log(`[CrewAI Task Started] Kickoff ID: ${kickoffId}`);

    // 2. المتابعة (Polling) لمدة تصل لـ 120 ثانية متوافقة مع سرعة سيرفر CrewAI
    const statusUrl = `${baseUrl}/status/${kickoffId}`;
    const maxAttempts = 60; // 60 محاولة * 2 ثانية = 120 ثانية كحد أقصى
    let attempts = 0;
    let finalData: any = null;

    while (attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      attempts++;

      const statusRes = await fetch(statusUrl, { headers });
      if (statusRes.ok) {
        const statusData = await statusRes.json();
        console.log(`[CrewAI Poll #${attempts}] State: ${statusData.state || statusData.status}`);

        if (statusData.state === "SUCCESS" || statusData.status === "SUCCESS") {
          finalData = statusData;
          break;
        } else if (
          statusData.state === "FAILED" ||
          statusData.status === "FAILED" ||
          statusData.state === "ERROR"
        ) {
          throw new Error("CrewAI task execution failed.");
        }
      }
    }

    if (!finalData) {
      throw new Error("CrewAI response timed out after 120 seconds.");
    }

    let answer = "";
    if (typeof finalData.result === "string") {
      answer = finalData.result;
    } else if (finalData.result?.raw) {
      answer = finalData.result.raw;
    } else if (finalData.result_json?.raw) {
      answer = finalData.result_json.raw;
    } else if (finalData.raw) {
      answer = finalData.raw;
    }

    if (!answer) {
      answer = "عذراً، لم أتمكن من العثور على إجابة حالياً.";
    }

    console.log(`[CrewAI Completed Successfully] Answer length: ${answer.length} chars`);

    return NextResponse.json({ answer });
  } catch (error: any) {
    console.error("[Chat API Error]:", error);
    return NextResponse.json(
      { error: error.message || "حدث خطأ أثناء الاتصال بالمساعد الذكي" },
      { status: 500 }
    );
  }
}