export type Stage1Option = {
  id: string;
  label: string;
};

export type Stage2Option = {
  id: string;
  label: string;
  promptText: string;
};

export type Topic = {
  id: string;
  title: string;
  cardTitle: string;
  draft: {
    firstPrompt: string;
    aiInstruction?: string;
    helpText: string;
    waitingText: string;
  };
  stage1: {
    helpText: string;
    selectionSuffix: string;
    defaultSelectedIds: string[];
    options: Stage1Option[];
  };
  stage2: {
    helpText: string;
    defaultSelectedId: string | null;
    options: Stage2Option[];
  };
};

export const topics: Topic[] = [
  {
    id: "grandchild-message",
    title: "손주에게 다정하게 메시지 보내기",
    cardTitle: "손주에게 다정하게 메시지\n보내기",
    draft: {
      firstPrompt: "손주에게 다정하게 문자를 보내고 싶어.",
      aiInstruction:
        "답변은 손주에게 바로 보낼 수 있는 문자 메시지 하나만 작성해줘. 말투는 따뜻하고 다정하게, 길지 않아야하지만 지나치게 짧은 것도 안돼. 가족이 자연스럽게 전하는 말처럼 써주고, 과하게 형식적인 표현은 피하고, 이모지는 많아도 1개까지만 사용해줘.",
      helpText:
        "우선 간단한 질문으로 답변을 확인해볼까요?\n더 자세히 말하는 방법은 곧 알려드릴게요.",
      waitingText: "대답을 기다리고 있어요.",
    },
    stage1: {
      helpText:
        "아래의 버튼을 눌러서 AI에게 전할 말을 좀 더 자세히 만들어볼까요?\n하고 싶으신 말을 여러 개 선택하신 후,\n‘AI에게 전할 말’을 확인해보세요.",
      selectionSuffix: "라는 말을 추가해줘.",
      defaultSelectedIds: [],
      options: [
        { id: "birthday", label: "생일을 축하해" },
        { id: "miss-you", label: "보고 싶어" },
        { id: "exercise", label: "운동 꼭 하고" },
        { id: "call-today", label: "오늘 꼭 연락하렴" },
      ],
    },
    stage2: {
      helpText:
        "AI와 나눈 대화는 모두 맥락이 저장됩니다.\n분위기를 바꾸거나 번역을 부탁해도 앞에서 고른 내용에 맞춰 답이 바뀌어요.\n이번에는 하나만 선택해볼까요?",
      defaultSelectedId: null,
      options: [
        {
          id: "funny",
          label: "재미있게 다시 써줘",
          promptText: "재미있게 다시 써 줘",
        },
        {
          id: "english",
          label: "영어로 써 줘",
          promptText: "영어로 써 줘",
        },
        {
          id: "japanese",
          label: "일본어로 써줘",
          promptText: "일본어로 써 줘",
        },
      ],
    },
  },
  {
    id: "trip-2n3d-hot",
    title: "국내로 2박 3일 추천 여행지 찾기",
    cardTitle: "국내로 2박3일!!\n추천 여행지 찾기",
    draft: {
      firstPrompt: "국내로 2박 3일 여행을 가고 싶어. 여행지를 추천해줘.",
      aiInstruction: `여러 후보를 보여주지 말고 국내 여행지 한 군데만 추천해줘.
        사용자가 고른 조건을 반영해서 왜 잘 맞는지 분명하게 설명해줘.
        여행지는 2박 3일 일정에 잘 맞아야 해.
        답변은 읽기 쉬운 markdown 형식으로 작성해줘.
        코드블록은 사용하지 말고, 제목/소제목/목록 정도만 사용해줘.
        첫 줄은 **추천 여행지: 지역명** 형식으로 써줘.
        그 다음에는 짧은 소개 문단을 1개 써줘.
        이후에는 반드시 아래 순서로 정리해줘.

        ### 추천 이유
        - 조건에 맞는 이유를 2~4개

        ### 여행 일정
        - 1일차
        - 2일차
        - 3일차

        ### 참고할 점
        - 이동, 숙소, 날씨, 준비물 같은 실용 팁을 2~3개

        문장은 너무 길지 않게 쓰고, 과장된 표현은 피하고, 바로 이해할 수 있게 정리해줘.`,
      helpText:
        "먼저 간단한 조건으로 추천을 받아볼게요.\n다음 단계에서 원하는 여행 스타일을 더 자세히 고를 수 있어요.",
      waitingText: "대답을 기다리고 있어요.",
    },
    stage1: {
      helpText:
        "어떤 여행이 좋으신지 골라볼까요?\n여러 개를 함께 선택하면 더 잘 맞는 여행지를 추천받을 수 있어요.",
      selectionSuffix: "조건을 반영해서 추천해줘.",
      defaultSelectedIds: [],
      options: [
        { id: "low-walking", label: "많이 걷지 않아도 돼" },
        { id: "famous-restaurants", label: "유명한 맛집이 많아" },
        { id: "nice-hotel", label: "숙소가 편하고 좋아" },
        { id: "ocean-view", label: "바다를 볼 수 있어" },
      ],
    },
    stage2: {
      helpText:
        "이제 추천 결과를 어떻게 정리할지 골라볼까요?\n하나를 선택하면 같은 여행지도 더 알맞은 방식으로 정리해드려요.",
      defaultSelectedId: null,
      options: [
        {
          id: "car-free",
          label: "차 없이도 다녀오기 좋아",
          promptText: "차 없이도 다녀오기 좋게 정리해 줘",
        },
        {
          id: "rainy-day",
          label: "비가 와도 괜찮아",
          promptText: "비가 와도 괜찮게 정리해 줘",
        },
        {
          id: "itinerary",
          label: "일정표처럼 정리해줘",
          promptText: "일정표처럼 정리해 줘",
        },
      ],
    },
  },
  {
    id: "snack-recipe",
    title: "간단하게 만들 수 있는 간식 조리법 보기",
    cardTitle: "간단하게 만들 수 있는\n간식 조리법 보기",
    draft: {
      firstPrompt: "간단하게 만들 수 있는 간식 조리법을 알려줘.",
      aiInstruction: `간식은 한 가지만 추천해줘.
        처음 요리를 해보는 사람에게 차근차근 알려주듯 부드럽고 쉬운 말투로 설명해줘.
        답변은 읽기 쉬운 markdown 형식으로 작성해줘.
        코드블록은 사용하지 말고, 제목/소제목/목록 정도만 사용해줘.
        첫 줄은 **추천 간식: 이름** 형식으로 써줘.
        그 다음에는 왜 이 간식이 잘 맞는지 짧게 소개해줘.
        이후에는 반드시 아래 순서로 정리해줘.

        ### 필요한 재료
        - 재료를 3~6개 정도 목록으로

        ### 만드는 순서
        1. 순서대로 짧고 쉬운 문장으로 설명
        2. 한 단계는 한 문장 또는 두 문장 정도로 짧게
        3. 너무 복잡한 조리 용어는 쓰지 말 것

        ### 마지막 팁
        - 뜨거움 주의
        - 더 맛있게 먹는 방법
        - 보관이나 설거지 팁
        이런 식의 실용적인 내용을 1~3개

        과장된 표현이나 블로그 후기 같은 말투는 피하고,
        부담 없이 따라 할 수 있게 짧고 친절하게 써줘.`,
      helpText:
        "먼저 쉬운 간식 하나를 추천받아볼게요.\n다음 단계에서 재료나 방식 조건을 더 자세히 고를 수 있어요.",
      waitingText: "대답을 기다리고 있어요.",
    },
    stage1: {
      helpText:
        "어떤 간식이 좋으신지 골라볼까요?\n여러 개를 함께 선택하면 더 내 상황에 맞는 조리법을 알려드릴 수 있어요.",
      selectionSuffix: "조건을 반영해서 알려줘.",
      defaultSelectedIds: [],
      options: [
        { id: "egg-main", label: "달걀을 주 재료로" },
        { id: "no-fire", label: "불 없이 만들고 싶어" },
        { id: "sweet", label: "달콤했으면 좋겠어" },
        { id: "under-10min", label: "10분 안에 끝내고 싶어" },
      ],
    },
    stage2: {
      helpText:
        "이제 설명 방식을 골라볼까요?\n단계를 자세히 볼 수도 있고,\n아이와 함께 만들기 쉽게 바꿀 수도 있어요.",
      defaultSelectedId: null,
      options: [
        {
          id: "detail",
          label: "단계별로 자세히",
          promptText: "단계별로 자세히 알려 줘",
        },
        {
          id: "with-kid",
          label: "아이와 함께 만들 수 있게",
          promptText: "아이와 함께 만들 수 있게 알려 줘",
        },
        {
          id: "less-dishes",
          label: "설거지 적게 나오게",
          promptText: "설거지 적게 나오게 알려 줘",
        },
      ],
    },
  },
];

const DEFAULT_TOPIC_ID = "grandchild-message";

export function getTopicById(topicId?: string | null) {
  return (
    topics.find((topic) => topic.id === topicId) ??
    topics.find((topic) => topic.id === DEFAULT_TOPIC_ID)!
  );
}

export function findStage2Item(topic: Topic, stage2Id?: string | null) {
  if (!stage2Id) {
    return null;
  }

  return topic.stage2.options.find((item) => item.id === stage2Id) ?? null;
}

export function buildStage1Prompt(topic: Topic, selectedIds: string[]) {
  const selectedItems = topic.stage1.options.filter((item) =>
    selectedIds.includes(item.id)
  );

  if (selectedItems.length === 0) {
    return topic.draft.firstPrompt;
  }

  const text = selectedItems.map((item) => `“${item.label}”`).join(", ");
  return `${topic.draft.firstPrompt} ${text}${topic.stage1.selectionSuffix}`;
}