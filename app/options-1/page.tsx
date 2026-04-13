import Options1Client from "./Options1Client";

type Options1SearchParams = Promise<{
  topic?: string | string[];
}>;

export default async function Options1Page({
  searchParams,
}: {
  searchParams: Options1SearchParams;
}) {
  const params = await searchParams;
  const topicParam = params.topic;
  const topicId = Array.isArray(topicParam) ? topicParam[0] : topicParam;

  return <Options1Client topicId={topicId ?? null} />;
}