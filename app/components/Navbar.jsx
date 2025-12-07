"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar({ user }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const linkClasses = (path) =>
    pathname === path
      ? "text-blue-500 font-semibold"
      : "text-gray-600 hover:text-black";

  return (
    <nav className="w-full border-b bg-white/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600">
          RaulTheRedShell
        </Link>

        <button
          className="md:hidden text-gray-700"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>

        <div
          className={`${
            open ? "block" : "hidden"
          } md:flex md:items-center gap-6`}
        >
          <Link href="/blogs" className={linkClasses("/blogs")}>
            Blogs
          </Link>
          <Link href="/blogs/new" className={linkClasses("/blogs/new")}>
            Nieuwe Blog
          </Link>

          {user ? (
            <>
              <span className="text-gray-700 ml-2">Hi, {user.username}</span>
              <form action="/auth/logout" method="post">
                <button className="ml-4 bg-red-500 px-4 py-2 rounded text-white">
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/auth/login" className={linkClasses("/auth/login")}>
                Login
              </Link>
              <Link
                href="/auth/register"
                className={linkClasses("/auth/register")}
              >
                Registreren
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}