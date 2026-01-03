import { describe, test, expect } from "bun:test";
import db from "@/lib/db";
import {
  createUser,
  getUserByEmail,
  getUserById,
  getAllUsers,
} from "@/lib/user";

describe("Integration: User (create/read/readById/readAll)", () => {
  let userId;

  // ✅ UNIEK username + email
  const unique = Date.now();
  const username = `integration_${unique}`;
  const email = `integration_${unique}@test.nl`;

  test(
    "create + getUserByEmail",
    async () => {
      await createUser(username, email, "wachtwoord");

      const user = await getUserByEmail(email);
      expect(user).not.toBeNull();
      expect(user.username).toBe(username);

      userId = user.id;
    },
    20000
  );

  test(
    "getUserById",
    async () => {
      const user = await getUserById(userId);
      expect(user).not.toBeNull();
      expect(user.id).toBe(userId);
    },
    20000
  );

  test(
    "getAllUsers",
    async () => {
      const users = await getAllUsers();
      expect(users.length).toBeGreaterThan(0);
    },
    20000
  );

  test(
    "cleanup",
    async () => {
      await db.query("DELETE FROM users WHERE id = ?", [userId]);
      expect(true).toBe(true);
    },
    20000
  );
});