"use client";

import { useState, useTransition } from "react";
import { registerAction } from "@/lib/auth";
import Link from "next/link";

export default function RegisterClient() {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleRegister(e) {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.target);
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");

    startTransition(async () => {
      const user = await registerAction(username, email, password);

      if (!user) {
        setError("Registratie mislukt. Gebruik een andere e-mail.");
        return;
      }

      window.location.href = "/";
    });
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-blue-50 px-6">
      <div className="max-w-md w-full bg-white shadow-xl rounded-xl p-8 border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
          Registreren
        </h1>

        <p className="text-center text-gray-600 mb-6">
          Maak een account aan bij{" "}
          <span className="font-semibold">RaulTheRedShell</span>
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-gray-800 font-medium mb-1">
              Gebruikersnaam
            </label>
            <input
              type="text"
              name="username"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-700 outline-none transition"
              placeholder="Jouw naam"
            />
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-1">
              E-mail
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-700 outline-none transition"
              placeholder="jij@example.com"
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
            {isPending ? "Bezig met registreren..." : "Account aanmaken"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Heb je al een account?{" "}
          <Link href="/auth/login" className="text-blue-600 font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}