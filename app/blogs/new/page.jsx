import { getCurrentUser } from "@/lib/auth";
import { createBlog } from "@/lib/blog";
import { redirect } from "next/navigation";

export default async function NewBlogPage() {
  const user = await getCurrentUser();

  // Niet ingelogd? → redirect
  if (!user) redirect("/auth/login");

  // Server Action voor blog aanmaken
  async function handleCreateBlog(formData) {
    "use server";

    const title = formData.get("title");
    const content = formData.get("content");

    const blogId = await createBlog(title, content, user.id);

    redirect(`/blogs/${blogId}`);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-blue-50 px-4 py-12">

      {/* ⬅️ Terug naar Blogs — BOVENAAN */}
      <div className="max-w-3xl mx-auto mb-6">
        <a
          href="/blogs"
          className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition inline-block"
        >
          ← Terug naar Blogs
        </a>
      </div>

      {/* FORM CARD */}
      <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 border border-gray-200">

        <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">
          Nieuwe Blog
        </h1>

        <form action={handleCreateBlog}>
          <div className="space-y-6">
            
            {/* Titel */}
            <div>
              <label className="block mb-2 font-semibold text-gray-800">
                Titel
              </label>
              <input
                name="title"
                required
                className="w-full border rounded-lg px-4 py-2 text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="Titel van je blog..."
              />
            </div>

            {/* Inhoud */}
            <div>
              <label className="block mb-2 font-semibold text-gray-800">
                Inhoud
              </label>
              <textarea
                name="content"
                required
                className="w-full border rounded-lg px-4 py-2 min-h-[220px] text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="Schrijf hier je verhaal..."
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
            >
              Publiceren
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}