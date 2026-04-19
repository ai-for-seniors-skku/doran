export async function fileToOptimizedDataUrl(
  file: File,
  maxSize = 1024,
  quality = 0.82
): Promise<string> {
  const originalDataUrl = await readFileAsDataUrl(file);
  return resizeDataUrl(originalDataUrl, maxSize, quality);
}

export async function resizeDataUrl(
  dataUrl: string,
  maxSize = 1024,
  quality = 0.82
): Promise<string> {
  const image = await loadImage(dataUrl);

  const { width, height } = fitSize(
    image.width,
    image.height,
    maxSize,
    maxSize
  );

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("캔버스를 만들지 못했어요.");
  }

  context.drawImage(image, 0, 0, width, height);

  return canvas.toDataURL("image/jpeg", quality);
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      if (!result) {
        reject(new Error("파일을 읽지 못했어요."));
        return;
      }
      resolve(result);
    };

    reader.onerror = () => reject(new Error("파일 읽기 중 오류가 났어요."));
    reader.readAsDataURL(file);
  });
}

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("이미지를 불러오지 못했어요."));
    image.src = dataUrl;
  });
}

function fitSize(
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number
) {
  if (width <= maxWidth && height <= maxHeight) {
    return { width, height };
  }

  const ratio = Math.min(maxWidth / width, maxHeight / height);

  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio),
  };
}