import AgentFinalClient from "./AgentFinalClient";

type AgentFinalSearchParams = Promise<{
  topic?: string | string[];
}>;

export default async function AgentFinalPage({
  searchParams,
}: {
  searchParams: AgentFinalSearchParams;
}) {
  const params = await searchParams;
  const topicParam = params.topic;
  const topicId = Array.isArray(topicParam) ? topicParam[0] : topicParam;

  return <AgentFinalClient topicId={topicId ?? null} />;
}