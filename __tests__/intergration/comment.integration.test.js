import { describe, test, expect } from "bun:test";
import db from "@/lib/db";
import { createBlog, deleteBlog } from "@/lib/blog";
import {
  createComment,
  getCommentsByBlog,
  getCommentById,
  updateComment,
  deleteComment,
} from "@/lib/comment";

describe("Integration: Comment (CRUD)", () => {
  let blogId;
  let commentId;

  test(
    "setup blog",
    async () => {
      blogId = Number(await createBlog("Comment Test Blog", "Inhoud", 1));
      expect(Number.isFinite(blogId)).toBe(true);
    },
    20000
  );

  test(
    "create + read (by blog)",
    async () => {
      await createComment("Integratie reactie", 1, blogId);
      const comments = await getCommentsByBlog(blogId);
      commentId = comments.at(-1).id;
      expect(commentId).toBeDefined();
    },
    20000
  );

  test(
    "read by id",
    async () => {
      const comment = await getCommentById(commentId);
      expect(comment).not.toBeNull();
    },
    20000
  );

  test(
    "update",
    async () => {
      await updateComment(commentId, "Aangepast");
      const comment = await getCommentById(commentId);
      expect(comment.content).toBe("Aangepast");
    },
    20000
  );

  test(
    "delete",
    async () => {
      await deleteComment(commentId);
      const comment = await getCommentById(commentId);
      expect(comment).toBeNull();
    },
    20000
  );

  test(
    "cleanup blog",
    async () => {
      await deleteBlog(blogId);
      await db.query("DELETE FROM blogs WHERE id = ?", [blogId]);
      expect(true).toBe(true);
    },
    20000
  );
});