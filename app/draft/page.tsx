import DraftClient from "./DraftClient";

type DraftSearchParams = Promise<{
  topic?: string | string[];
}>;

export default async function DraftPage({
  searchParams,
}: {
  searchParams: DraftSearchParams;
}) {
  const params = await searchParams;
  const topicParam = params.topic;
  const topicId = Array.isArray(topicParam) ? topicParam[0] : topicParam;

  return <DraftClient topicId={topicId ?? null} />;
}