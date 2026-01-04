import { describe, test, expect, mock, beforeEach } from "bun:test";

// ---- mock db BEFORE importing lib/blog
let queue = [];
const queryMock = mock(async () => {
  const fn = queue.shift();
  return fn ? fn() : [[]];
});

mock.module("@/lib/db", () => ({
  default: { query: queryMock },
}));

const {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} = await import("@/lib/blog");

describe("Unit: Blog (CRUD)", () => {
  beforeEach(() => {
    queue = [];
    queryMock.mockClear();
  });

  test("getAllBlogs", async () => {
    queue.push(async () => [[{ id: 1, title: "Blog" }]]);
    const blogs = await getAllBlogs();
    expect(blogs.length).toBe(1);
  });

  test("getBlogById", async () => {
    queue.push(async () => [[{ id: 1, title: "Blog" }]]);
    const blog = await getBlogById(1);
    expect(blog.id).toBe(1);
  });

  test("createBlog", async () => {
    queue.push(async () => [{ insertId: 5 }]); // insert blogs
    queue.push(async () => [{}]); // insert blog_authors

    const id = await createBlog("Titel", "Inhoud", 1);
    expect(id).toBe(5);
  });

  test("updateBlog", async () => {
    queue.push(async () => [{}]);
    await updateBlog(1, "Nieuw", "Update");
    expect(queryMock).toHaveBeenCalled();
  });

  test("deleteBlog", async () => {
    // deleteBlog doet meerdere queries voor comments, authors, blog
    queue.push(async () => [{}]);
    queue.push(async () => [{}]);
    queue.push(async () => [{}]);

    await deleteBlog(1);
    expect(queryMock).toHaveBeenCalled();
  });
});