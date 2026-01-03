import { describe, test, expect } from "bun:test";
import db from "@/lib/db";
import { createBlog, deleteBlog, addBlogAuthor, removeBlogAuthor, getBlogAuthors } from "@/lib/blog";

describe("Integration: BlogAuthors (M:N)", () => {
  let blogId;

  test(
    "setup blog",
    async () => {
      blogId = Number(await createBlog("Author Test Blog", "Inhoud", 1));
      expect(Number.isFinite(blogId)).toBe(true);
    },
    20000
  );

  test(
    "add + read",
    async () => {
      await addBlogAuthor(blogId, 1);
      const authors = await getBlogAuthors(blogId);
      expect(authors.length).toBeGreaterThan(0);
    },
    20000
  );

  test(
    "remove + read",
    async () => {
      await removeBlogAuthor(blogId, 1);
      const authors = await getBlogAuthors(blogId);
      expect(authors.find((a) => a.id === 1)).toBeUndefined();
    },
    20000
  );

  test(
    "cleanup blog",
    async () => {
      await deleteBlog(blogId);
      await db.query("DELETE FROM blogs WHERE id = ?", [blogId]);
      await db.query("DELETE FROM blog_authors WHERE blog_id = ?", [blogId]);
      expect(true).toBe(true);
    },
    20000
  );
});