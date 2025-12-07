"use client";

import { useState } from "react";

export default function CommentForm({ onSubmit }) {
  const [content, setContent] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!content.trim()) return;
        onSubmit(content);
        setContent("");
      }}
      className="mt-6"
    >
      <textarea
        className="w-full border rounded px-3 py-2"
        placeholder="Schrijf een reactie..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button
        type="submit"
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Reageren
      </button>
    </form>
  );
}