import db from "./db.js";

export async function getCommentsByBlog(blogId) {
  const [rows] = await db.query(
    `
    SELECT comments.*, users.username 
    FROM comments
    JOIN users ON comments.user_id = users.id
    WHERE comments.blog_id = ?
    ORDER BY comments.created_at ASC
    `,
    [blogId]
  );
  return rows;
}

export async function createComment(content, userId, blogId) {
  await db.query(
    "INSERT INTO comments (content, user_id, blog_id) VALUES (?, ?, ?)",
    [content, userId, blogId]
  );
}

export async function updateComment(commentId, content) {
  await db.query(
    "UPDATE comments SET content = ? WHERE id = ?",
    [content, commentId]
  );
}

export async function deleteComment(commentId) {
  await db.query("DELETE FROM comments WHERE id = ?", [commentId]);
}

export async function getCommentById(commentId) {
  const [rows] = await db.query(
    "SELECT * FROM comments WHERE id = ? LIMIT 1",
    [commentId]
  );
  return rows[0] || null;
}