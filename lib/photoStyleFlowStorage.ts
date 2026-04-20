export type PhotoStyleFlowState = {
  sourceImageDataUrl?: string;
  sourceMethod?: "camera" | "upload";
  selectedStyleId?: string;
  resultImageDataUrl?: string;
  refinePrompt?: string;
  refinedImageDataUrl?: string;
};

const STORAGE_KEY = "doran-photo-style-flow";

export function readPhotoStyleFlow(): PhotoStyleFlowState {
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

export function writePhotoStyleFlow(next: PhotoStyleFlowState) {
  if (typeof window === "undefined") {
    return;
  }

  const current = readPhotoStyleFlow();
  window.sessionStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      ...current,
      ...next,
    })
  );
}

export function clearPhotoStyleFlow() {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(STORAGE_KEY);
}