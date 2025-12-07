// app/page.tsx
import Link from "next/link";
import { getAllBlogs } from "@/lib/blog";
import { getCurrentUser } from "@/lib/auth";
import BlogCard from "./components/BlogCard";

export default async function HomePage() {
  const user = await getCurrentUser();
  const blogs = await getAllBlogs();

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-white via-blue-50 to-blue-100">
      {/* Hero Section */}
      <section className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-4 leading-tight">
          Welcome to{" "}
          <span className="text-blue-600 drop-shadow-sm">
            RaulTheRedShell
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto mt-3">
          Bekijk mijn game-progress, lees mijn blogs, reageer mee en volg
          mijn journey als Nintendo-fan en livestreamer.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4 sm:gap-6">
          <Link href="/blogs">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold shadow hover:bg-blue-700 transition w-full sm:w-auto">
              Bekijk Blogs
            </button>
          </Link>

          {user ? (
            <Link href="/blogs/new">
              <button className="px-6 py-3 bg-gray-100 border border-gray-300 text-gray-800 rounded-lg text-lg font-semibold hover:bg-gray-200 transition w-full sm:w-auto">
                Nieuwe Blog
              </button>
            </Link>
          ) : (
            <Link href="/auth/login">
              <button className="px-6 py-3 bg-gray-100 border border-gray-300 text-gray-800 rounded-lg text-lg font-semibold hover:bg-gray-200 transition w-full sm:w-auto">
                Inloggen
              </button>
            </Link>
          )}
        </div>
      </section>

      {/* Recent Blogs */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
          Recente Blogs
        </h2>

        {blogs.length === 0 ? (
          <p className="text-center text-gray-600">Nog geen blogs geplaatst.</p>
        ) : (
          <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.slice(0, 6).map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link href="/blogs">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition">
              Bekijk alle blogs
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t py-6 text-center text-gray-500 text-sm bg-white/60 backdrop-blur">
        © 2025 RaulTheRedShell — All Rights Reserved.
      </footer>
    </main>
  );
}