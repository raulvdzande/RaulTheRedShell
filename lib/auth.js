"use server";

import { cookies } from "next/headers";
import { verifyUser, createUser, getUserById } from "./user.js";

/**
 * Login — controleer e-mail en wachtwoord
 */
export async function loginAction(email, password) {
  const user = await verifyUser(email, password);
  if (!user) return null;

  // session cookie zetten
  cookies().set("sessionId", String(user.id), {
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

  // Na registratie automatisch inloggen
  const user = await verifyUser(email, password);

  cookies().set("sessionId", String(user.id), {
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
  cookies().delete("sessionId");
}

/**
 * Huidige gebruiker ophalen
 */
export async function getCurrentUser() {
  const cookieStore = cookies();
  const session = cookieStore.get("sessionId");

  if (!session) return null;

  const user = await getUserById(session.value);
  return user || null;
}

/**
 * Middleware-helper: check of gebruiker ingelogd is
 * (te gebruiken in server components)
 */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) return null;
  return user;
}