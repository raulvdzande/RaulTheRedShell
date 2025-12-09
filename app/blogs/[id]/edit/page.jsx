import { getBlogById, updateBlog } from "@/lib/blog";
import { getCurrentUser } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { revalidatePath } from "next/cache";

/* -------- SERVER ACTION: UPDATE BLOG -------- */
export async function updateBlogAction(formData) {
  "use server";

  const blogId = formData.get("blogId");
  const title = formData.get("title");
  const content = formData.get("content");

  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");

  await updateBlog(blogId, title, content);

  revalidatePath(`/blogs/${blogId}`);
  redirect(`/blogs/${blogId}`);
}

/* --------------- PAGE COMPONENT --------------- */
export default async function EditBlogPage({ params }) {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);

  if (isNaN(id)) return notFound();

  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");

  const blog = await getBlogById(id);
  if (!blog) return notFound();

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 px-4 py-12">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg border">

        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Blog Bewerken
        </h1>

        <form action={updateBlogAction} className="space-y-4">
          <input type="hidden" name="blogId" value={id} />

          <div>
            <label className="font-semibold text-gray-700">Titel</label>
            <input
              name="title"
              defaultValue={blog.title}
              required
              className="w-full px-4 py-2 border rounded-lg text-gray-700 shadow-sm"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700">Inhoud</label>
            <textarea
              name="content"
              defaultValue={blog.content}
              required
              className="w-full px-4 py-2 border rounded-lg shadow-sm text-gray-700 min-h-[200px]"
            />
          </div>

          <div className="flex justify-between mt-6">
            <a
              href={`/blogs/${id}`}
              className="px-5 py-2 bg-gray-500 rounded-lg border text-white transition"
            >
              Annuleren
            </a>

            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow"
            >
              Opslaan
            </button>
          </div>
        </form>

      </div>
    </main>
  );
}