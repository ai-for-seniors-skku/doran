import FinalClient from "./FinalClient";

type FinalSearchParams = Promise<{
  topic?: string | string[];
  stage1?: string | string[];
  stage2?: string | string[];
}>;

export default async function FinalPage({
  searchParams,
}: {
  searchParams: FinalSearchParams;
}) {
  const params = await searchParams;

  const topicParam = params.topic;
  const stage1Param = params.stage1;
  const stage2Param = params.stage2;

  const topicId = Array.isArray(topicParam) ? topicParam[0] : topicParam;
  const stage1 = Array.isArray(stage1Param) ? stage1Param[0] : stage1Param;
  const stage2 = Array.isArray(stage2Param) ? stage2Param[0] : stage2Param;

  return (
    <FinalClient
      topicId={topicId ?? null}
      stage1={stage1 ?? ""}
      stage2={stage2 ?? null}
    />
  );
}