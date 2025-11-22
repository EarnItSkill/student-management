// components/MarkdownRenderer.jsx
import "prismjs/themes/prism-okaidia.css"; // সুন্দর থিম
import ReactMarkdown from "react-markdown";
import rehypePrism from "rehype-prism-plus";
import remarkGfm from "remark-gfm";

const MarkdownRenderer = ({ content }) => {
  return (
    <div className="prose max-w-none prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-xl prose-code:text-yellow-300">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypePrism]}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
