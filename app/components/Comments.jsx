"use client";

export default function Comment({ comment, user, onEdit, onDelete }) {
  const isOwner = user && user.id === comment.user_id;

  return (
    <div className="border rounded p-4 bg-white shadow-sm mb-3">
      <p className="font-semibold">{comment.username}</p>
      <p className="text-gray-700 mt-1">{comment.content}</p>
      <p className="text-sm text-gray-400 mt-2">
        {new Date(comment.created_at).toLocaleString()}
      </p>

      {isOwner && (
        <div className="flex gap-3 mt-3">
          <button
            onClick={() => onEdit(comment)}
            className="text-blue-600 hover:underline"
          >
            Bewerken
          </button>
          <button
            onClick={() => onDelete(comment.id)}
            className="text-red-600 hover:underline"
          >
            Verwijderen
          </button>
        </div>
      )}
    </div>
  );
}