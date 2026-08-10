import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

async function translateText(text: string, targetLang: string): Promise<string> {
  if (!text || typeof text !== "string" || !text.trim()) return text;
  
  if (text.startsWith("http://") || text.startsWith("https://") || text.startsWith("/")) return text;

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ar&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    if (!res.ok) return text;
    
    const data = await res.json();
    if (data && data[0]) {
      return data[0].map((item: any) => item[0]).join("");
    }
    return text;
  } catch {
    return text; 
  }
}

async function translateObject(obj: any, targetLang: string): Promise<any> {
  if (!obj) return obj;

  if (typeof obj === "string") {
    return await translateText(obj, targetLang);
  }

  if (Array.isArray(obj)) {
    const newArr = [];
    for (const item of obj) {
      newArr.push(await translateObject(item, targetLang));
    }
    return newArr;
  }

  if (typeof obj === "object") {
    const newObj: Record<string, any> = {};
    for (const key of Object.keys(obj)) {
      if (
        key === "id" || key === "type" || key === "image" || 
        key === "src" || key === "videoUrl" || key === "url" || 
        key.toLowerCase().includes("color") || key.toLowerCase().includes("link")
      ) {
        newObj[key] = obj[key];
      } else {
        newObj[key] = await translateObject(obj[key], targetLang);
      }
    }
    return newObj;
  }

  return obj;
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { sections, targetLang } = await req.json();

    if (!sections || !Array.isArray(sections)) {
      return NextResponse.json({ error: "No sections provided" }, { status: 400 });
    }

    const translatedSections = await translateObject(sections, targetLang || "en");

    return NextResponse.json({ sections: translatedSections });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Translation failed" }, { status: 500 });
  }
}