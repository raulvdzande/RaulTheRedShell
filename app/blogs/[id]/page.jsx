import { getBlogById, getBlogAuthors } from "@/lib/blog";
import { getCommentsByBlog, createComment } from "@/lib/comment";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";

/* --- SERVER ACTION: REACTIE PLAATSEN --- */
export async function addCommentAction(formData) {
  "use server";

  const content = formData.get("content");
  const blogId = Number(formData.get("blogId"));
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Je moet ingelogd zijn om te reageren.");
  }

  await createComment(content, user.id, blogId);

  revalidatePath(`/blogs/${blogId}`);
}

export default async function BlogDetailPage({ params }) {
  const resolvedParams = await params;
  const blogId = Number(resolvedParams.id);

  if (!blogId || isNaN(blogId)) return notFound();

  const user = await getCurrentUser();
  const blog = await getBlogById(blogId);
  if (!blog) return notFound();

  const authors = await getBlogAuthors(blogId);
  const comments = await getCommentsByBlog(blogId);

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-blue-50 px-4 py-10">

      {/* ⬅️ TERUG NAAR BLOGS */}
      <div className="max-w-4xl mx-auto mb-6">
        <Link href="/blogs">
          <button className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
            ← Terug naar Blogs
          </button>
        </Link>
      </div>

      {/* BLOG DETAIL CARD */}
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

        {/* Reacties */}
        <section className="mt-14">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Reacties</h2>

          {/* --- Reactie formulier --- */}
          {user ? (
            <form
              action={addCommentAction}
              className="mb-8 bg-gray-50 border p-4 rounded-lg shadow-sm"
            >
              <input type="hidden" name="blogId" value={blogId} />

              <label className="block font-medium mb-2 text-gray-700">Jouw reactie</label>
              <textarea
                name="content"
                required
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 text-gray-700 focus:ring-blue-500 min-h-[120px]"
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
              om een reactie te plaatsen.
            </p>
          )}

          {/* --- Reactie lijst --- */}
          {comments.length === 0 ? (
            <p className="text-gray-500">Nog geen reacties.</p>
          ) : (
            <div className="space-y-4">
              {comments.map((c) => (
                <div key={c.id} className="bg-gray-50 border p-4 rounded-lg">
                  <p className="text-gray-700 mb-2">{c.content}</p>
                  <p className="text-sm text-gray-700 mt-2">
                    {c.username} —{" "}
                    {new Date(c.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}