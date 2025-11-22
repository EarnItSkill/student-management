import MarkdownRenderer from "./MarkdownRenderer";

const sample = `
### C কোড উদাহরণ:

\`\`\`html
<!DOCTYPE html>
<html>
  <head>
    <title>Page Title</title>
  </head>
<body>

\t<h1>This is a Heading</h1>
\t<p>This is a paragraph.</p>

</body>
</html>
\`\`\`
`;

export default function MarkdownRender() {
  return <MarkdownRenderer content={sample} />;
}
