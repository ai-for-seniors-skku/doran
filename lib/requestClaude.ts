export async function requestClaude(prompt: string, instructions?: string) {
  const response = await fetch("/api/claude", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      instructions,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || "Claude 요청에 실패했어요.");
  }

  return data.text as string;
}