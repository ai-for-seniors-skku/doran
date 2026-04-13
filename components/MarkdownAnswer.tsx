import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownAnswer({
  children,
}: {
  children: string;
}) {
  return (
    <div className="prose prose-neutral max-w-none text-black">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="mb-3 text-[24px] font-bold leading-[1.4] tracking-[-0.05em] text-black">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mb-3 text-[22px] font-bold leading-[1.4] tracking-[-0.05em] text-black">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-3 text-[20px] font-bold leading-[1.4] tracking-[-0.05em] text-black">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mb-3 font-maruburi text-[20px] leading-[1.7] tracking-[-0.05em] text-black">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="mb-3 list-disc pl-6">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-3 list-decimal pl-6">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="mb-1 font-maruburi text-[20px] leading-[1.7] tracking-[-0.05em] text-black">
              {children}
            </li>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-black">{children}</strong>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}