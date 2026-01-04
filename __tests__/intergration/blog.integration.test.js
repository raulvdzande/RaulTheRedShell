import { describe, test, expect } from "bun:test";
import db from "@/lib/db";
import { createBlog, getBlogById, updateBlog, deleteBlog } from "@/lib/blog";

describe("Integration: Blog (CRUD)", () => {
  let blogId;

  test(
    "create + read",
    async () => {
      const created = await createBlog("Int Blog", "Inhoud", 1);
      blogId = Number(created);
      expect(Number.isFinite(blogId)).toBe(true);

      const blog = await getBlogById(blogId);
      expect(blog).not.toBeNull();
      expect(blog.title).toBe("Int Blog");
    },
    20000
  );

  test(
    "update",
    async () => {
      await updateBlog(blogId, "Updated", "Nieuwe inhoud");
      const blog = await getBlogById(blogId);
      expect(blog.title).toBe("Updated");
    },
    20000
  );

  test(
    "delete",
    async () => {
      await deleteBlog(blogId);
      const blog = await getBlogById(blogId);
      expect(blog).toBeNull();
    },
    20000
  );

  // extra safety cleanup voor als iets faalt
  test(
    "cleanup safety",
    async () => {
      if (Number.isFinite(blogId)) {
        await db.query("DELETE FROM blogs WHERE id = ?", [blogId]);
        await db.query("DELETE FROM blog_authors WHERE blog_id = ?", [blogId]);
        await db.query("DELETE FROM comments WHERE blog_id = ?", [blogId]);
      }
      expect(true).toBe(true);
    },
    20000
  );
});