import { describe, test, expect, mock, beforeEach } from "bun:test";

let queue = [];
const queryMock = mock(async () => {
  const fn = queue.shift();
  return fn ? fn() : [[]];
});

mock.module("@/lib/db", () => ({
  default: {
    query: queryMock,
  },
}));

mock.module("bcrypt", () => {
  const hash = async () => "hashed-password";
  const compare = async () => true;

  return {
    hash,
    compare,
    default: { hash, compare },
  };
});

const {
  createUser,
  getUserByEmail,
  getUserById,
  getAllUsers,
} = await import("@/lib/user");

describe("Unit: User (create/read/readById/readAll)", () => {
  beforeEach(() => {
    queue = [];
    queryMock.mockClear();
  });

  test("createUser", async () => {
    queue.push(async () => [{}]);

    await createUser("raul", "raul@test.nl", "wachtwoord");

    expect(queryMock).toHaveBeenCalled();
  });

  test("getUserByEmail", async () => {
    queue.push(async () => [[{ id: 1, email: "a@b.nl" }]]);

    const user = await getUserByEmail("a@b.nl");

    expect(user.email).toBe("a@b.nl");
  });

  test("getUserById", async () => {
    queue.push(async () => [[{ id: 1, username: "raul" }]]);

    const user = await getUserById(1);

    expect(user.id).toBe(1);
  });

  test("getAllUsers", async () => {
    queue.push(async () => [[{ id: 1 }, { id: 2 }]]);

    const users = await getAllUsers();

    expect(users.length).toBe(2);
  });
});