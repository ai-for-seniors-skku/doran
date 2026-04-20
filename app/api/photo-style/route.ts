import OpenAI from "openai";
import { toFile } from "openai/uploads";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const STYLE_PROMPTS: Record<string, string> = {
  "warm-watercolor":
    "Transform this face photo into a warm watercolor portrait. Preserve the same person, facial identity, pose, framing, and major clothing details. Keep it natural, family-friendly, and visually pleasing. Do not add text, extra people, or unrelated objects.",
  "bright-illustration":
    "Transform this face photo into a bright illustration portrait. Preserve the same person, facial identity, pose, framing, and major clothing details. Keep it cheerful, clean, and family-friendly. Do not add text, extra people, or unrelated objects.",
  "pencil-caricature":
    "Transform this face photo into a pencil caricature portrait. Preserve the same person, facial identity, pose, framing, and major clothing details. Make it playful but respectful and family-friendly. Do not add text, extra people, or unrelated objects.",
  "neat-id-photo":
    "Transform this face photo into a neat ID photo style portrait. Preserve the same person, facial identity, and realistic facial features as much as possible. Keep it clean, natural, and family-friendly. Do not add text or unrelated objects.",
};

function parseDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);

  if (!match) {
    throw new Error("올바른 이미지 형식이 아니에요.");
  }

  const [, mimeType, base64] = match;
  const buffer = Buffer.from(base64, "base64");

  const extension =
    mimeType === "image/png"
      ? "png"
      : mimeType === "image/webp"
      ? "webp"
      : "jpg";

  return { mimeType, buffer, extension };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const sourceImageDataUrl =
      typeof body.sourceImageDataUrl === "string" ? body.sourceImageDataUrl : "";
    const styleId = typeof body.styleId === "string" ? body.styleId : "";
    const customPrompt =
      typeof body.customPrompt === "string" ? body.customPrompt.trim() : "";

    if (!sourceImageDataUrl) {
      return NextResponse.json(
        { error: "원본 이미지가 없어요." },
        { status: 400 }
      );
    }

    let prompt = "";

    if (customPrompt) {
      prompt = `Edit this photo according to the user's request: ${customPrompt}
Preserve the same people, facial identity, pose, framing, and major clothing details as much as possible.
Keep the result natural, family-friendly, and visually pleasing.
Do not add unrelated people, text, or unnecessary objects.`;
    } else if (styleId && STYLE_PROMPTS[styleId]) {
      prompt = STYLE_PROMPTS[styleId];
    }

    if (!prompt) {
      return NextResponse.json(
        { error: "스타일 또는 프롬프트가 필요해요." },
        { status: 400 }
      );
    }

    const { mimeType, buffer, extension } = parseDataUrl(sourceImageDataUrl);

    const imageFile = await toFile(buffer, `source.${extension}`, {
      type: mimeType,
    });

    const response = await client.images.edit({
      model: "gpt-image-1.5",
      image: imageFile,
      prompt,
      input_fidelity: "high",
      quality: "medium",
      size: "auto",
      output_format: "jpeg",
      output_compression: 80,
      background: "auto",
    });

    const base64 = response.data?.[0]?.b64_json;

    if (!base64) {
      return NextResponse.json(
        { error: "변환된 이미지를 받지 못했어요." },
        { status: 500 }
      );
    }

    const resultBuffer = Buffer.from(base64, "base64");

    return new Response(resultBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("photo-style route error full:", error);

    if (error instanceof Error) {
      console.error("photo-style route error message:", error.message);
      console.error("photo-style route error stack:", error.stack);
    }

    return NextResponse.json(
      { error: "이미지 변환에 실패했어요." },
      { status: 500 }
    );
  }
}