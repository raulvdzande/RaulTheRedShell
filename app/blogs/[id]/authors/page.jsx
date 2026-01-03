import { getBlogById, getBlogAuthors, addBlogAuthor, removeBlogAuthor } from "@/lib/blog";
import { getAllUsers } from "@/lib/user";
import { getCurrentUser } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";

/* ----------------------------------------------------
   ADD AUTHOR
---------------------------------------------------- */
export async function addAuthorAction(formData) {
  "use server";

  const blogId = Number(formData.get("blogId"));
  const userId = Number(formData.get("userId"));

  await addBlogAuthor(blogId, userId);
  revalidatePath(`/blogs/${blogId}/authors`);
}

/* ----------------------------------------------------
   REMOVE AUTHOR
---------------------------------------------------- */
export async function removeAuthorAction(formData) {
  "use server";

  const blogId = Number(formData.get("blogId"));
  const userId = Number(formData.get("userId"));

  await removeBlogAuthor(blogId, userId);
  revalidatePath(`/blogs/${blogId}/authors`);
}

/* ----------------------------------------------------
   PAGE
---------------------------------------------------- */
export default async function AuthorsPage({ params }) {
  const resolvedParams = await params;
  const blogId = Number(resolvedParams.id);

  if (!blogId || isNaN(blogId)) return notFound();

  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");

  const blog = await getBlogById(blogId);
  if (!blog) return notFound();

  const authors = await getBlogAuthors(blogId);
  const users = await getAllUsers();

  const availableUsers = users.filter((u) => !authors.some((a) => a.id === u.id));

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-purple-50 px-4 py-10">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow border border-gray-200">

        {/* TERUG (geen button in a) */}
        <Link
          href={`/blogs/${blogId}`}
          className="inline-block mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          ← Terug naar blog
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          👥 Auteurs beheren — "{blog.title}"
        </h1>

        {/* HUIDIGE AUTEURS */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Gekoppelde auteurs</h2>

          {authors.length === 0 ? (
            <p className="text-gray-500">Nog geen auteurs gekoppeld.</p>
          ) : (
            <div className="space-y-3">
              {authors.map((author) => (
                <div
                  key={author.id}
                  className="flex items-center justify-between bg-gray-50 p-3 text-gray-700 border rounded-lg"
                >
                  <span className="font-medium text-gray-800">{author.username}</span>

                  {/* validator-proof action + server action via formAction */}
                  <form method="post" action={`/blogs/${blogId}/authors`}>
                    <input type="hidden" name="blogId" value={blogId} />
                    <input type="hidden" name="userId" value={author.id} />

                    <button
                      formAction={removeAuthorAction}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                      Verwijderen
                    </button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* GEBRUIKERS TOEVOEGEN */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Auteur toevoegen</h2>

          {availableUsers.length === 0 ? (
            <p className="text-gray-700">Geen gebruikers beschikbaar om toe te voegen.</p>
          ) : (
            <form
              method="post"
              action={`/blogs/${blogId}/authors`}
              className="flex flex-col sm:flex-row gap-4 items-start"
            >
              <input type="hidden" name="blogId" value={blogId} />

              <select
                name="userId"
                className="border p-2 rounded-lg flex-1 text-gray-700"
                required
              >
                <option value="" className="text-gray-700">Kies een gebruiker...</option>
                {availableUsers.map((u) => (
                  <option className="text-gray-700" key={u.id} value={u.id}>
                    {u.username}
                  </option>
                ))}
              </select>

              <button
                formAction={addAuthorAction}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Toevoegen
              </button>
            </form>
          )}
        </section>

      </div>
    </main>
  );
}