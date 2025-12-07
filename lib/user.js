import db from "./db.js";
import bcrypt from "bcrypt";

export async function createUser(username, email, password) {
  const hash = await bcrypt.hash(password, 10);

  await db.query(
    "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
    [username, email, hash]
  );
}

export async function getUserByEmail(email) {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE email = ? LIMIT 1",
    [email]
  );
  return rows[0] || null;
}

export async function verifyUser(email, password) {
  const user = await getUserByEmail(email);
  if (!user) return null;

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return null;

  return user;
}

export async function getUserById(id) {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE id = ? LIMIT 1",
    [id]
  );
  return rows[0] || null;
}