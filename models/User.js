export default class User {
  constructor({ id, username, email, passwordHash, createdAt }) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.passwordHash = passwordHash;
    this.createdAt = createdAt;
  }

  async register(username, email, password) {
  }

  async login(email, password) {}

  async getBlogs() {}

  async getComments() {}
}