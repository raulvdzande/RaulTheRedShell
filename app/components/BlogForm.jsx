"use client";

import { useState } from "react";

export default function BlogForm({ defaultValues = {}, onSubmit }) {
  const [title, setTitle] = useState(defaultValues.title || "");
  const [content, setContent] = useState(defaultValues.content || "");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ title, content });
      }}
      className="max-w-3xl mx-auto bg-white p-6 rounded shadow"
    >
      <h1 className="text-2xl font-bold mb-4">
        {defaultValues.id ? "Blog Bewerken" : "Nieuwe Blog"}
      </h1>

      <label className="block mb-2 font-medium">Titel</label>
      <input
        className="w-full border rounded px-3 py-2 mb-4"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <label className="block mb-2 font-medium">Inhoud</label>
      <textarea
        className="w-full border rounded px-3 py-2 min-h-[200px]"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />

      <button
        type="submit"
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Opslaan
      </button>
    </form>
  );
}