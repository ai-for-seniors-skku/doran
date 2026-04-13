export function stripMarkdown(input: string) {
  return input
    // 코드 블록
    .replace(/```[\s\S]*?```/g, (match) =>
      match.replace(/```/g, "").trim()
    )
    // 인라인 코드
    .replace(/`([^`]+)`/g, "$1")
    // 링크 [text](url) -> text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    // 이미지 ![alt](url) -> alt
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    // heading ###, ##, #
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    // blockquote >
    .replace(/^\s{0,3}>\s?/gm, "")
    // bold / italic / strike
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/~~([^~]+)~~/g, "$1")
    // 리스트 마커
    .replace(/^\s*[-*+]\s+/gm, "• ")
    .replace(/^\s*\d+\.\s+/gm, "")
    // 구분선
    .replace(/^\s*([-*_]){3,}\s*$/gm, "")
    // 과한 공백 정리
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}