import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function POST(req: Request) {
  try {
    if (!ai) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY가 설정되지 않았어요." },
        { status: 500 }
      );
    }

    const body = await req.json();

    const prompt = typeof body.prompt === "string" ? body.prompt : "";
    const instructions =
      typeof body.instructions === "string" ? body.instructions : "";

    if (!prompt.trim()) {
      return NextResponse.json(
        { error: "prompt가 비어 있어요." },
        { status: 400 }
      );
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt.trim(),
      config: instructions.trim()
        ? {
            systemInstruction: instructions.trim(),
          }
        : undefined,
    });

    const text = response.text?.trim() ?? "";

    if (!text) {
      return NextResponse.json(
        { error: "Gemini 응답이 비어 있어요." },
        { status: 500 }
      );
    }

    return NextResponse.json({ text });
  } catch (error) {
    console.error("gemini route error:", error);

    return NextResponse.json(
      { error: "Gemini 응답 생성에 실패했어요." },
      { status: 500 }
    );
  }
}