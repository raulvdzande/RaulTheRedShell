import { getBlogById, getBlogAuthors } from "@/lib/blog";
import { getCommentsByBlog } from "@/lib/comment";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function BlogDetailPage({ params }) {
  // ⭐ Next.js 16: params is a Promise → unwrap it first
  const resolvedParams = await params;
  console.log("REAL PARAMS:", resolvedParams);

  const blogId = Number(resolvedParams.id);

  if (!blogId || isNaN(blogId)) {
    console.error("Invalid Blog ID:", resolvedParams.id);
    return notFound();
  }

  const blog = await getBlogById(blogId);
  if (!blog) return notFound();

  const authors = await getBlogAuthors(blogId);
  const comments = await getCommentsByBlog(blogId);

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-blue-50 px-4 py-10">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 break-words leading-tight">
          {blog.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm mb-6">
          <span>
            Gepubliceerd op:{" "}
            <span className="font-medium">
              {new Date(blog.created_at).toLocaleDateString()}
            </span>
          </span>

          {authors.length > 0 && (
            <span>
              Door{" "}
              {authors.map((a, i) => (
                <span className="font-medium" key={a.id}>
                  {a.username}{i < authors.length - 1 ? ", " : ""}
                </span>
              ))}
            </span>
          )}
        </div>

        <article className="prose prose-blue max-w-none text-gray-800 leading-relaxed">
          {blog.content.split("\n").map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </article>

        <div className="mt-10">
          <Link href="/blogs">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg">
              ← Terug naar Blogs
            </button>
          </Link>
        </div>

        <section className="mt-14">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Reacties</h2>

          {comments.length === 0 ? (
            <p className="text-gray-500">Nog geen reacties.</p>
          ) : (
            <div className="space-y-4">
              {comments.map((c) => (
                <div key={c.id} className="bg-gray-50 border p-4 rounded-lg">
                  <p>{c.content}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {c.username} – {new Date(c.created_at).toLocaleDateString()}
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