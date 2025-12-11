import { getBlogById, getBlogAuthors } from "@/lib/blog";
import {
  getCommentsByBlog,
  createComment,
  updateComment,
  deleteComment,
} from "@/lib/comment";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";

/* ----------------------------------------------------
   REACTIE PLAATSEN
---------------------------------------------------- */
export async function addCommentAction(formData) {
  "use server";

  const content = formData.get("content");
  const blogId = Number(formData.get("blogId"));
  const user = await getCurrentUser();

  if (!user) throw new Error("Je moet ingelogd zijn om te reageren.");

  await createComment(content, user.id, blogId);
  revalidatePath(`/blogs/${blogId}`);
}

/* ----------------------------------------------------
   REACTIE UPDATEN
---------------------------------------------------- */
export async function editCommentAction(formData) {
  "use server";

  const content = formData.get("content");
  const commentId = Number(formData.get("commentId"));
  const blogId = Number(formData.get("blogId"));

  await updateComment(commentId, content);
  revalidatePath(`/blogs/${blogId}`);
}

/* ----------------------------------------------------
   REACTIE VERWIJDEREN
---------------------------------------------------- */
export async function deleteCommentAction(formData) {
  "use server";

  const commentId = Number(formData.get("commentId"));
  const blogId = Number(formData.get("blogId"));

  await deleteComment(commentId);
  revalidatePath(`/blogs/${blogId}`);
}

/* ----------------------------------------------------
   PAGE RENDER
---------------------------------------------------- */
export default async function BlogDetailPage({ params }) {
  const resolvedParams = await params; // Next.js 16 fix
  const blogId = Number(resolvedParams.id);

  if (!blogId || isNaN(blogId)) return notFound();

  const user = await getCurrentUser(); // ⭐ BELANGRIJK
  const blog = await getBlogById(blogId);

  if (!blog) return notFound();

  const authors = await getBlogAuthors(blogId); // ⭐ Gekoppelde gebruikers
  const comments = await getCommentsByBlog(blogId);

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-blue-50 px-4 py-10">

      {/* 🔵 TOP NAVIGATION: TERUG + BEHEER AUTEURS */}
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center">

        {/* TERUG */}
        <Link href="/blogs">
          <button className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
            ← Terug naar Blogs
          </button>
        </Link>

        {/* BEHEER AUTEURS KNOP — alleen als ingelogd */}
        {user && (
          <Link href={`/blogs/${blogId}/authors`}>
            <button className="px-5 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition">
              👥 Beheer Auteurs
            </button>
          </Link>
        )}
      </div>

      {/* BLOG CONTENT */}
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">

        {/* Titel */}
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 break-words">
          {blog.title}
        </h1>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm mb-6">
          <span>
            Gepubliceerd op{" "}
            <span className="font-medium">
              {new Date(blog.created_at).toLocaleDateString()}
            </span>
          </span>

          {authors.length > 0 && (
            <span>
              Door{" "}
              {authors.map((a, i) => (
                <span key={a.id} className="font-medium">
                  {a.username}{i < authors.length - 1 ? ", " : ""}
                </span>
              ))}
            </span>
          )}
        </div>

        {/* Inhoud */}
        <article className="prose prose-blue max-w-none text-gray-800 leading-relaxed">
          {blog.content.split("\n").map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </article>

        {/* REACTIES */}
        <section className="mt-14">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Reacties</h2>

          {/* Reactie toevoegen */}
          {user ? (
            <form
              action={addCommentAction}
              className="mb-8 bg-gray-50 border p-4 rounded-lg shadow-sm"
            >
              <input type="hidden" name="blogId" value={blogId} />

              <textarea
                name="content"
                required
                className="w-full px-3 py-2 border rounded-lg min-h-[120px] text-gray-700 focus:ring-2 focus:ring-blue-500"
                placeholder="Typ hier je reactie..."
              />

              <button
                type="submit"
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Plaatsen
              </button>
            </form>
          ) : (
            <p className="text-gray-600 mb-6">
              <Link href="/auth/login" className="text-blue-600 underline">
                Log in
              </Link>{" "}
              om reacties te plaatsen.
            </p>
          )}

          {/* Reactielijst */}
          {comments.length === 0 ? (
            <p className="text-gray-500">Nog geen reacties.</p>
          ) : (
            <div className="space-y-6">
              {comments.map((c) => (
                <CommentItem
                  key={c.id}
                  comment={c}
                  user={user}
                  blogId={blogId}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

/* ---------------------------------------------------------
   COMMENT ITEM COMPONENT (EDIT + DELETE)
--------------------------------------------------------- */
function CommentItem({ comment, user, blogId }) {
  const isOwner = user && user.id === comment.user_id;

  return (
    <div className="bg-gray-50 border p-4 rounded-lg relative">

      {/* Delete knop rechtsboven */}
      {isOwner && (
        <form action={deleteCommentAction} className="absolute top-3 right-3">
          <input type="hidden" name="commentId" value={comment.id} />
          <input type="hidden" name="blogId" value={blogId} />
          <button
            type="submit"
            className="text-red-600 hover:text-red-800 text-xl"
            title="Verwijderen"
          >
            🗑️
          </button>
        </form>
      )}

      {/* Comment text */}
      <p className="text-gray-800">{comment.content}</p>

      <p className="text-sm text-gray-500 mt-2">
        {comment.username} — {new Date(comment.created_at).toLocaleDateString()}
      </p>

      {/* Edit reactie */}
      {isOwner && (
        <details className="mt-3">
          <summary className="cursor-pointer text-blue-600 hover:underline flex items-center">
            ✏️ Bewerken
          </summary>

          <form action={editCommentAction} className="mt-3 space-y-2">
            <input type="hidden" name="commentId" value={comment.id} />
            <input type="hidden" name="blogId" value={blogId} />

            <textarea
              name="content"
              required
              defaultValue={comment.content}
              className="w-full border rounded-lg px-3 py-2 min-h-[100px] focus:ring-2 focus:ring-blue-500 text-gray-700"
            />

            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Opslaan
            </button>
          </form>
        </details>
      )}
    </div>
  );
}