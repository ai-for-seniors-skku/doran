import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
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

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: prompt.trim(),
      instructions: instructions.trim() || undefined,
    });

    return NextResponse.json({
      text: response.output_text ?? "",
    });
  } catch (error) {
    console.error("chat route error:", error);

    return NextResponse.json(
      { error: "AI 응답 생성에 실패했어요." },
      { status: 500 }
    );
  }
}