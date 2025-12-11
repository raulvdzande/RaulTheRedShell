import { getCurrentUser } from "@/lib/auth";
import {
  getBlogById,
  getBlogAuthors,
  addBlogAuthor,
  removeBlogAuthor,
} from "@/lib/blog";
import { getAllUsers } from "@/lib/user";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";

/* ----------------------------------------------------
   ADD AUTHOR — SERVER ACTION
---------------------------------------------------- */
export async function addAuthorAction(formData) {
  "use server";

  const userId = Number(formData.get("userId"));
  const blogId = Number(formData.get("blogId"));

  await addBlogAuthor(blogId, userId);
  revalidatePath(`/blogs/${blogId}/authors`);
}

/* ----------------------------------------------------
   REMOVE AUTHOR — SERVER ACTION
---------------------------------------------------- */
export async function removeAuthorAction(formData) {
  "use server";

  const userId = Number(formData.get("userId"));
  const blogId = Number(formData.get("blogId"));

  await removeBlogAuthor(blogId, userId);
  revalidatePath(`/blogs/${blogId}/authors`);
}

/* ----------------------------------------------------
   PAGE RENDER
---------------------------------------------------- */
export default async function BlogAuthorsPage({ params }) {
  const resolvedParams = await params;
  const blogId = Number(resolvedParams.id);

  if (!blogId || isNaN(blogId)) return notFound();

  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");

  const blog = await getBlogById(blogId);
  if (!blog) return notFound();

  const authors = await getBlogAuthors(blogId);
  const allUsers = await getAllUsers();

  const authorIds = new Set(authors.map((a) => a.id));

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-blue-50 px-4 py-10">

      {/* TOP NAVIGATION */}
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center">
        <Link href={`/blogs/${blogId}`}>
          <button className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
            ← Terug naar Blog
          </button>
        </Link>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Auteurs beheren
        </h1>
      </div>

      {/* MAIN CARD */}
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">

        {/* CURRENT AUTHORS */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Gekoppelde auteurs
          </h2>

          {authors.length === 0 ? (
            <p className="text-gray-500">Nog geen auteurs gekoppeld.</p>
          ) : (
            <ul className="space-y-3">
              {authors.map((author) => (
                <li
                  key={author.id}
                  className="flex justify-between items-center bg-gray-50 border rounded-lg p-3"
                >
                  <span className="font-medium text-gray-800">{author.username}</span>

                  <form action={removeAuthorAction}>
                    <input type="hidden" name="userId" value={author.id} />
                    <input type="hidden" name="blogId" value={blogId} />

                    <button
                      type="submit"
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      ❌ Verwijder
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* ADD NEW AUTHOR */}
        <section className="mt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Auteur toevoegen
          </h2>

          <form action={addAuthorAction} className="flex flex-col sm:flex-row gap-3">
            <input type="hidden" name="blogId" value={blogId} />

            <select
              name="userId"
              className="flex-1 border px-3 py-2 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {allUsers
                .filter((u) => !authorIds.has(u.id))
                .map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.username}
                  </option>
                ))}
            </select>

            <button
              type="submit"
              className="px-5 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
            >
              Voeg toe
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}