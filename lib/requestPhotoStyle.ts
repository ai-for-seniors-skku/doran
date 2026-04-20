type RequestPhotoStyleParams = {
  sourceImageDataUrl: string;
  styleId?: string;
  customPrompt?: string;
};

export async function requestPhotoStyle({
  sourceImageDataUrl,
  styleId,
  customPrompt,
}: RequestPhotoStyleParams) {
  const response = await fetch("/api/photo-style", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sourceImageDataUrl,
      styleId,
      customPrompt,
    }),
  });

  if (!response.ok) {
    const contentType = response.headers.get("content-type") || "";
    const rawText = await response.text();

    console.error("photo-style error status:", response.status);
    console.error("photo-style error content-type:", contentType);
    console.error("photo-style error body:", rawText);

    if (contentType.includes("application/json")) {
      try {
        const data = JSON.parse(rawText);
        throw new Error(data?.error || "이미지 변환 요청에 실패했어요.");
      } catch {
        throw new Error("이미지 변환 요청에 실패했어요.");
      }
    }

    throw new Error("이미지 변환 요청에 실패했어요.");
  }

  return await response.blob();
}