import RewriteClient from "./RewriteClient";

type RewriteSearchParams = Promise<{
  topic?: string | string[];
}>;

export default async function RewritePage({
  searchParams,
}: {
  searchParams: RewriteSearchParams;
}) {
  const params = await searchParams;
  const topicParam = params.topic;
  const topicId = Array.isArray(topicParam) ? topicParam[0] : topicParam;

  return <RewriteClient topicId={topicId ?? null} />;
}