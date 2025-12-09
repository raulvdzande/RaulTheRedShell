"use client";

import { useState, useTransition } from "react";
import { loginAction } from "@/lib/auth";
import Link from "next/link";

export default function LoginClient() {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleLogin(e) {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    startTransition(async () => {
      const user = await loginAction(email, password);

      if (!user) {
        setError("Ongeldige inloggegevens.");
        return;
      }

      window.location.href = "/";
    });
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-blue-50 px-6">
      <div className="max-w-md w-full bg-white shadow-xl rounded-xl p-8 border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
          Inloggen
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Welkom terug bij <span className="font-semibold">RaulTheRedShell</span>
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-gray-800 font-medium mb-1">
              E-mail
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-700 outline-none transition"
              placeholder="jouw@email.com"
            />
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-1">
              Wachtwoord
            </label>
            <input
              type="password"
              name="password"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-700 outline-none transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition disabled:opacity-50"
          >
            {isPending ? "Bezig met inloggen..." : "Inloggen"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Nog geen account?{" "}
          <Link href="/auth/register" className="text-blue-600 font-semibold hover:underline">
            Registreer hier
          </Link>
        </p>
      </div>
    </main>
  );
}