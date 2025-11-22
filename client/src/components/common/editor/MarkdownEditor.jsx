// components/MarkdownEditor.jsx
import { useState } from "react";
import MarkdownRender from "../MarkdownRender";

export default function MarkdownEditor({ value, onChange }) {
  const [tab, setTab] = useState("edit");

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex border-b mb-2">
        <button
          className={`px-4 py-2 ${
            tab === "edit" ? "font-bold border-b-2 border-blue-500" : ""
          }`}
          onClick={() => setTab("edit")}
        >
          Edit
        </button>
        <button
          className={`px-4 py-2 ${
            tab === "preview" ? "font-bold border-b-2 border-green-500" : ""
          }`}
          onClick={() => setTab("preview")}
        >
          Preview
        </button>
      </div>

      {/* Editor */}
      {tab === "edit" && (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-60 p-3 border rounded-lg font-mono"
          placeholder="Write markdown here..."
        ></textarea>
      )}

      {/* Preview */}
      {tab === "preview" && (
        <div className="border p-3 rounded-lg bg-gray-50">
          <MarkdownRender content={value || "*Nothing to preview*"} />
        </div>
      )}
    </div>
  );
}
