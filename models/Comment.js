export default class Comment {
  constructor({ id, content, createdAt, userId, blogId }) {
    this.id = id;
    this.content = content;
    this.createdAt = createdAt;
    this.userId = userId;
    this.blogId = blogId;
  }

  async create(content) {}

  async edit(content) {}

  async delete() {}
}