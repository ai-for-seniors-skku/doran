export type FlowAnswers = {
  draftAnswer?: string;
  stage1Answer?: string;
  finalAnswer?: string;
};

const STORAGE_KEY = "doran-flow-answers";

export function readFlowAnswers(): FlowAnswers {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function writeFlowAnswers(next: FlowAnswers) {
  if (typeof window === "undefined") {
    return;
  }

  const current = readFlowAnswers();
  window.sessionStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      ...current,
      ...next,
    })
  );
}

export function clearFlowAnswers() {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(STORAGE_KEY);
}