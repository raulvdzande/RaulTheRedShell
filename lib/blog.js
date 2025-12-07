import db from "./db.js";

export async function getAllBlogs() {
  const [rows] = await db.query("SELECT * FROM blogs ORDER BY created_at DESC");
  return rows;
}

export async function getBlogById(id) {
  const [rows] = await db.query("SELECT * FROM blogs WHERE id = ?", [id]);
  return rows[0] || null;
}

export async function createBlog(title, content, userId) {
  const [result] = await db.query(
    "INSERT INTO blogs (title, content) VALUES (?, ?)",
    [title, content]
  );

  const blogId = result.insertId;

  // auteur koppelen
  await db.query(
    "INSERT INTO blog_authors (user_id, blog_id) VALUES (?, ?)",
    [userId, blogId]
  );

  return blogId;
}

export async function updateBlog(id, title, content) {
  await db.query(
    "UPDATE blogs SET title = ?, content = ? WHERE id = ?",
    [title, content, id]
  );
}

export async function deleteBlog(id) {
  // eerst reacties verwijderen
  await db.query("DELETE FROM comments WHERE blog_id = ?", [id]);

  // co-auteurs verwijderen
  await db.query("DELETE FROM blog_authors WHERE blog_id = ?", [id]);

  // blog zelf verwijderen
  await db.query("DELETE FROM blogs WHERE id = ?", [id]);
}

export async function getBlogAuthors(blogId) {
  const [rows] = await db.query(
    `
    SELECT users.* 
    FROM users
    JOIN blog_authors ON users.id = blog_authors.user_id
    WHERE blog_authors.blog_id = ?
    `,
    [blogId]
  );
  return rows;
}

export async function addBlogAuthor(blogId, userId) {
  await db.query(
    "INSERT IGNORE INTO blog_authors (user_id, blog_id) VALUES (?, ?)",
    [userId, blogId]
  );
}

export async function removeBlogAuthor(blogId, userId) {
  await db.query(
    "DELETE FROM blog_authors WHERE user_id = ? AND blog_id = ?",
    [userId, blogId]
  );
}