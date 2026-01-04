import Link from "next/link";
import { getAllBlogs, deleteBlog } from "@/lib/blog";
import { getCurrentUser } from "@/lib/auth";
import BlogCard from "../components/BlogCard";
import { revalidatePath } from "next/cache";

export async function deleteBlogAction(formData) {
  "use server";

  const blogId = formData.get("blogId");
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Niet ingelogd — geen toestemming om te verwijderen.");
  }

  await deleteBlog(blogId);

  // zorgt dat blog direct uit UI verdwijnt zonder refresh
  revalidatePath("/blogs");
}

export default async function BlogListPage() {
  const blogs = await getAllBlogs();
  const user = await getCurrentUser();

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 px-4 py-12">

      <div className="max-w-6xl mx-auto flex justify-between items-center mb-10 px-2">

        <Link
          href="/"
          className="px-5 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg shadow hover:bg-gray-100 transition font-medium"
        >
          ← Home
        </Link>

        {user && (
          <Link
            href="/blogs/new"
            className="px-5 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition font-medium"
          >
            + Nieuwe Blog
          </Link>
        )}
      </div>

      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-8">
          Alle Blogs
        </h1>
      </div>

      <div className="max-w-6xl mx-auto">
        {blogs.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            Er zijn nog geen blogs geplaatst.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="relative border rounded-lg bg-white shadow-sm hover:shadow-lg transition overflow-hidden"
              >
                {user && (
                  <div className="absolute top-2 right-2 flex gap-2 z-10">
                    {/* Edit */}
                    <Link
                      href={`/blogs/${blog.id}/edit`}
                      title="Bewerken"
                      className="p-2 bg-white border rounded-full shadow hover:bg-gray-100 transition"
                    >
                      ✏️
                    </Link>

                    <form action={deleteBlogAction}>
                      <input type="hidden" name="blogId" value={blog.id} />
                      <button
                        type="submit"
                        title="Verwijderen"
                        className="p-2 bg-white border rounded-full shadow hover:bg-red-100 transition"
                      >
                        🗑️
                      </button>
                    </form>
                  </div>
                )}

                <BlogCard blog={blog} />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}