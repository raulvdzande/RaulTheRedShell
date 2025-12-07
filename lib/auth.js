"use server";

import { cookies } from "next/headers";
import { verifyUser, createUser, getUserById } from "./user.js";

/**
 * Login
 */
export async function loginAction(email, password) {
  const user = await verifyUser(email, password);
  if (!user) return null;

  const cookieStore = await cookies(); // ✅ nieuwe async API

  cookieStore.set("sessionId", String(user.id), {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 dagen
  });

  return user;
}

/**
 * Registreren
 */
export async function registerAction(username, email, password) {
  await createUser(username, email, password);

  // automatisch inloggen
  const user = await verifyUser(email, password);

  const cookieStore = await cookies(); // ✅ nieuwe API

  cookieStore.set("sessionId", String(user.id), {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return user;
}

/**
 * Uitloggen
 */
export async function logoutAction() {
  const cookieStore = await cookies(); // ✅ nieuwe API
  cookieStore.delete("sessionId");
}

/**
 * Huidige gebruiker ophalen
 */
export async function getCurrentUser() {
  const cookieStore = await cookies(); // ✅ nieuwe API
  const session = cookieStore.get("sessionId");

  if (!session) return null;

  const user = await getUserById(session.value);
  return user || null;
}

/**
 * Middleware-helper
 */
export async function requireUser() {
  const user = await getCurrentUser();
  return user || null;
}