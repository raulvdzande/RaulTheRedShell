import { describe, test, expect, mock, beforeEach } from "bun:test";

let queue = [];
const queryMock = mock(async () => {
  const fn = queue.shift();
  return fn ? fn() : [[]];
});

mock.module("@/lib/db", () => ({
  default: { query: queryMock },
}));

const { getBlogAuthors, addBlogAuthor, removeBlogAuthor } = await import("@/lib/blog");

describe("Unit: BlogAuthors (M:N)", () => {
  beforeEach(() => {
    queue = [];
    queryMock.mockClear();
  });

  test("getBlogAuthors", async () => {
    queue.push(async () => [[{ id: 1, username: "raul" }]]);
    const authors = await getBlogAuthors(1);
    expect(authors.length).toBe(1);
  });

  test("addBlogAuthor", async () => {
    queue.push(async () => [{}]);
    await addBlogAuthor(1, 2);
    expect(queryMock).toHaveBeenCalled();
  });

  test("removeBlogAuthor", async () => {
    queue.push(async () => [{}]);
    await removeBlogAuthor(1, 2);
    expect(queryMock).toHaveBeenCalled();
  });
});