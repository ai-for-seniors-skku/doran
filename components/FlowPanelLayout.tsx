import { ReactNode } from "react";

type FlowPanelLayoutProps = {
  title: string;
  promptContent: ReactNode;
  answerContent: ReactNode;
  helpContent: ReactNode;
  promptAction?: ReactNode;
  footerActions?: ReactNode;
};

function PanelHeader({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-[56px] items-center border-b border-[#d9d9d9] bg-[#EEF1EF] px-[20px] text-[24px] font-bold tracking-[-0.05em] text-black">
      {children}
    </div>
  );
}

export default function FlowPanelLayout({
  title,
  promptContent,
  answerContent,
  helpContent,
  promptAction,
  footerActions,
}: FlowPanelLayoutProps) {
  return (
    <main className="mx-auto max-w-[1280px] px-[40px] pt-[32px] pb-[16px]">
      <div className="mx-auto max-w-[1080px]">
        <h1 className="mb-[32px] text-[32px] font-bold leading-[1.3] tracking-[-0.05em] text-black">
          {title}
        </h1>

        <section className="border border-[#d9d9d9] bg-white">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_432px] lg:h-[660px]">
            <div className="flex min-w-0 flex-col border-r border-[#d9d9d9]">
              <div className="flex h-[290px] flex-col">
                <PanelHeader>AI에게 전할 말</PanelHeader>

                <div className="h-[146px] overflow-y-auto p-[16px]">
                  {promptContent}
                </div>

                <div className="flex h-[88px] items-center justify-end px-[16px]">
                  {promptAction}
                </div>
              </div>

              <div className="flex h-[370px] flex-col border-t border-[#d9d9d9]">
                <PanelHeader>AI의 대답</PanelHeader>

                <div className="h-[314px] p-[16px]">
                  {footerActions ? (
                    <div className="flex h-full flex-col">
                      <div className="min-h-0 flex-1 overflow-y-auto">
                        {answerContent}
                      </div>

                      <div className="mt-[16px] flex justify-end gap-[12px]">
                        {footerActions}
                      </div>
                    </div>
                  ) : (
                    <div className="h-full overflow-y-auto">{answerContent}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex w-full flex-col">
              <PanelHeader>도움말</PanelHeader>

              <div className="h-[604px] overflow-y-auto p-[16px]">
                {helpContent}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}