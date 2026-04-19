"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import PrimaryActionButton from "@/components/buttons/PrimaryActionButton";
import SecondaryActionButton from "@/components/buttons/SecondaryActionButton";
import MaterialIcon from "@/components/icons/MaterialIcon";
import {
  clearPhotoStyleFlow,
  writePhotoStyleFlow,
} from "@/lib/photoStyleFlowStorage";
import {
  fileToOptimizedDataUrl,
  resizeDataUrl,
} from "@/lib/imageToDataUrl";

type CameraState =
  | "idle"
  | "requesting"
  | "ready"
  | "unsupported"
  | "denied"
  | "missing"
  | "error";

export default function CaptureClient() {
  const router = useRouter();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraState, setCameraState] = useState<CameraState>("idle");
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  useEffect(() => {
    clearPhotoStyleFlow();

    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
    if (cameraState !== "ready") return;
    void attachStreamToVideo();
  }, [cameraState]);

  const attachStreamToVideo = async () => {
    const video = videoRef.current;
    const stream = streamRef.current;

    if (!video || !stream) return;

    try {
      if (video.srcObject !== stream) {
        video.srcObject = stream;
      }

      await video.play().catch(() => {
        // metadata loaded 후 다시 재생 시도
      });
    } catch (error) {
      console.error("attachStreamToVideo error:", error);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }
  };

  const startCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraState("unsupported");
      return;
    }

    try {
      setCameraState("requesting");
      stopCamera();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 960 },
        },
        audio: false,
      });

      streamRef.current = stream;
      setCameraState("ready");

      requestAnimationFrame(() => {
        void attachStreamToVideo();
      });
    } catch (error) {
      const name =
        error && typeof error === "object" && "name" in error
          ? String((error as { name?: unknown }).name)
          : "";

      if (name === "NotAllowedError" || name === "SecurityError") {
        setCameraState("denied");
        return;
      }

      if (name === "NotFoundError" || name === "DevicesNotFoundError") {
        setCameraState("missing");
        return;
      }

      console.error("startCamera error:", error);
      setCameraState("error");
    }
  };

  const takePhotoAndGoNext = async () => {
    if (!videoRef.current || isProcessingImage) return;

    try {
      setIsProcessingImage(true);

      const video = videoRef.current;
      const width = video.videoWidth || 720;
      const height = video.videoHeight || 960;

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext("2d");
      if (!context) {
        throw new Error("캔버스를 만들지 못했어요.");
      }

      context.drawImage(video, 0, 0, width, height);

      const rawDataUrl = canvas.toDataURL("image/jpeg", 0.9);
      const optimizedDataUrl = await resizeDataUrl(rawDataUrl, 1024, 0.82);

      writePhotoStyleFlow({
        sourceImageDataUrl: optimizedDataUrl,
        sourceMethod: "camera",
        selectedStyleId: undefined,
        resultImageDataUrl: undefined,
      });

      stopCamera();
      router.push("/photo-style/style");
    } catch (error) {
      console.error(error);
      alert("사진을 처리하지 못했어요.");
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleOpenUpload = () => {
    fileInputRef.current?.click();
  };

  const handleUploadChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || isProcessingImage) return;

    try {
      setIsProcessingImage(true);

      const optimizedDataUrl = await fileToOptimizedDataUrl(file, 1024, 0.82);

      writePhotoStyleFlow({
        sourceImageDataUrl: optimizedDataUrl,
        sourceMethod: "upload",
        selectedStyleId: undefined,
        resultImageDataUrl: undefined,
      });

      stopCamera();
      router.push("/photo-style/style");
    } catch (error) {
      console.error(error);
      alert("사진을 처리하지 못했어요.");
    } finally {
      setIsProcessingImage(false);
      event.target.value = "";
    }
  };

  const cameraStatusText =
    cameraState === "denied"
      ? "카메라 권한이 없어요. 사진 업로드로 진행해주세요."
      : cameraState === "missing"
      ? "이 컴퓨터에서는 카메라를 찾지 못했어요. 사진 업로드로 진행해주세요."
      : cameraState === "unsupported"
      ? "이 브라우저에서는 카메라 촬영을 지원하지 않아요. 사진 업로드로 진행해주세요."
      : cameraState === "error"
      ? "카메라를 시작하지 못했어요. 다시 시도하거나 사진 업로드로 진행해주세요."
      : cameraState === "requesting"
      ? "카메라를 준비하고 있어요."
      : isProcessingImage
      ? "사진을 준비하고 있어요."
      : "";

  const showVideo = cameraState === "ready";

  return (
    <>
      <SiteHeader showHomeButton />

      <main className="mx-auto max-w-[1280px] px-[40px] pt-[32px] pb-[16px]">
        <div className="mx-auto max-w-[1080px]">
          <h1 className="mb-[32px] text-[32px] font-bold leading-[1.3] tracking-[-0.05em] text-black">
            사진을 원하는 스타일로 바꾸기
          </h1>

          <div className="grid lg:grid-cols-[minmax(0,1fr)_416px] lg:gap-[16px]">
            <section className="border border-[#d9d9d9] bg-white">
              <div className="flex min-w-0 flex-col lg:h-[660px]">
                <div className="flex h-[56px] items-center border-b border-[#d9d9d9] bg-[#EEF1EF] px-[20px] text-[24px] font-bold tracking-[-0.05em] text-black">
                  사진 준비
                </div>

                <div className="flex h-[604px] flex-col p-[16px]">
                  <div className="relative flex min-h-0 flex-1 items-center justify-center rounded-[12px] border border-[#d9d9d9] bg-[#f8f8f8]">
                    <div className="w-full max-w-[328px]">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        onLoadedMetadata={() => {
                          void attachStreamToVideo();
                        }}
                        className={`aspect-[3/4] w-full rounded-[12px] object-cover ${
                          showVideo ? "block" : "hidden"
                        }`}
                      />
                    </div>

                    {!showVideo && (
                      <div className="absolute inset-0 flex items-center justify-center px-[24px] text-center text-[20px] leading-[30px] tracking-[-0.05em] text-[#666]">
                        카메라를 켜거나 사진을 업로드해 주세요.
                      </div>
                    )}
                  </div>

                  <div className="mt-[16px] flex flex-wrap justify-end gap-[12px]">
                    {!showVideo ? (
                      <>
                        <SecondaryActionButton
                          onClick={handleOpenUpload}
                          icon={
                            <MaterialIcon
                              name="upload"
                              className="text-[24px]"
                            />
                          }
                          className={
                            isProcessingImage
                              ? "pointer-events-none opacity-70"
                              : ""
                          }
                        >
                          {isProcessingImage ? "처리 중" : "사진 업로드"}
                        </SecondaryActionButton>

                        <PrimaryActionButton
                          onClick={startCamera}
                          disabled={
                            cameraState === "requesting" || isProcessingImage
                          }
                          icon={
                            <MaterialIcon
                              name="photo_camera"
                              className="text-[24px]"
                            />
                          }
                        >
                          {cameraState === "requesting" ? "준비 중" : "사진 찍기"}
                        </PrimaryActionButton>
                      </>
                    ) : (
                      <>
                        <SecondaryActionButton
                          onClick={() => {
                            stopCamera();
                            setCameraState("idle");
                          }}
                          icon={
                            <MaterialIcon
                              name="close"
                              className="text-[24px]"
                            />
                          }
                          className={
                            isProcessingImage
                              ? "pointer-events-none opacity-70"
                              : ""
                          }
                        >
                          취소
                        </SecondaryActionButton>

                        <PrimaryActionButton
                          onClick={takePhotoAndGoNext}
                          disabled={isProcessingImage}
                          icon={
                            <MaterialIcon
                              name="photo_camera"
                              className="text-[24px]"
                            />
                          }
                        >
                          {isProcessingImage ? "처리 중" : "사진 찍기"}
                        </PrimaryActionButton>
                      </>
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleUploadChange}
                  />
                </div>
              </div>
            </section>

            <section className="overflow-hidden rounded-[16px] border-2 border-[#2F6FED] bg-[linear-gradient(180deg,#F0F6FF_0%,#FFFFFF_100%)]">
              <div className="flex w-full flex-col lg:h-[660px]">
                <div className="flex h-[56px] items-center border-b border-[#BFD4FF] bg-transparent px-[20px] text-[24px] font-bold tracking-[-0.05em] text-black">
                  도움말
                </div>

                <div className="h-[604px] overflow-y-auto p-[16px] text-[20px] leading-[32px] tracking-[-0.05em] text-black">
                  <p className="mb-[24px]">
                    내 사진을 색다른 스타일로 바꿔볼까요?
                  </p>

                  <p className="mb-[24px] whitespace-pre-line">
                    컴퓨터 카메라로 사진을 찍거나
                    {"\n"}
                    바꾸고 싶은 사진을 업로드해주세요.
                  </p>

                  <p className="mb-[24px] whitespace-pre-line">
                    얼굴이 잘 보이는 사진일수록
                    {"\n"}
                    더 자연스럽게 바뀐답니다.
                  </p>

                  {cameraStatusText && <p>{cameraStatusText}</p>}
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}