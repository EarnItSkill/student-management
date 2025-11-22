import { useState } from "react";
import MarkdownEditor from "../components/MarkdownEditor";

export default function CreateQuestion() {
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    await fetch("/code.json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "New Question",
        content,
      }),
    });
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Create Question</h1>

      <MarkdownEditor value={content} onChange={setContent} />

      <button
        onClick={handleSubmit}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Save Question
      </button>
    </div>
  );
}
