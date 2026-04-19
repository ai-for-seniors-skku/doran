import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const apiKey = process.env.ANTHROPIC_API_KEY;

const client = apiKey
  ? new Anthropic({
      apiKey,
    })
  : null;

export async function POST(req: Request) {
  try {
    if (!client) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY가 설정되지 않았어요." },
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

    const claudeHelperInstruction = `
정보가 조금 부족하더라도 바로 되묻지 말고, 가장 자연스러운 가정을 1~2개만 세워서 답변을 완성해줘.
꼭 필요한 경우가 아니면 추가 질문을 하지 말고, 우선 사용자가 바로 활용할 수 있는 답을 먼저 줘.
가정한 내용이 있다면 답변 첫머리에 짧게 한 줄로만 밝혀줘.
질문으로 답변을 끝내지 말고, 항상 완성된 초안이나 추천안을 먼저 제시해줘.

가장 중요한 규칙:
- 답변 본문만 출력해줘.
- 요청한 결과 외의 추가 제안, 추가 도움말, 참고 문구, 마무리 인사, 후속 안내를 붙이지 마.
- "원하시면", "추가로", "더 도와드릴까요", "참고로" 같은 표현을 쓰지 마.
- 답변은 필요한 내용만 깔끔하게 끝내.
- 사용자가 요청한 형식이 있으면 그 형식만 지켜서 출력해.
`.trim();

    const mergedInstructions = [instructions.trim(), claudeHelperInstruction]
      .filter(Boolean)
      .join("\n\n");

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: mergedInstructions || undefined,
      messages: [
        {
          role: "user",
          content: prompt.trim(),
        },
      ],
    });

    const text = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n")
      .trim();

    if (!text) {
      return NextResponse.json(
        { error: "Claude 응답이 비어 있어요." },
        { status: 500 }
      );
    }

    return NextResponse.json({ text });
  } catch (error) {
    console.error("claude route error:", error);

    return NextResponse.json(
      { error: "Claude 응답 생성에 실패했어요." },
      { status: 500 }
    );
  }
}