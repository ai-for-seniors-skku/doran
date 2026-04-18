import SelectAgentClient from "./SelectAgentClient";

type SelectAgentSearchParams = Promise<{
  topic?: string | string[];
}>;

export default async function SelectAgentPage({
  searchParams,
}: {
  searchParams: SelectAgentSearchParams;
}) {
  const params = await searchParams;
  const topicParam = params.topic;
  const topicId = Array.isArray(topicParam) ? topicParam[0] : topicParam;

  return <SelectAgentClient topicId={topicId ?? null} />;
}