export default class Blog {
  constructor({ id, title, content, createdAt }) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.createdAt = createdAt;
  }

  async create(title, content) {}

  async edit(title, content) {}

  async delete() {}

  async addAuthor(user) {}

  async removeAuthor(user) {}

  async getAuthors() {}

  async getComments() {}
}