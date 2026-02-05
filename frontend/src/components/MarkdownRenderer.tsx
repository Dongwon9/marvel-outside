import MarkdownPreview from "@uiw/react-markdown-preview";
import rehypeExternalLinks from "rehype-external-links";
import rehypeSanitize from "rehype-sanitize";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({
  content,
  className = "",
}: MarkdownRendererProps) {
  return (
    <div className={`prose prose-sm max-w-none ${className}`}>
      <MarkdownPreview
        source={content}
        rehypePlugins={[
          rehypeSanitize,
          [
            rehypeExternalLinks,
            { target: "_blank", rel: ["noopener", "noreferrer"] },
          ],
        ]}
      />
    </div>
  );
}
