export default class User {
  constructor({ id, username, email, passwordHash, createdAt }) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.passwordHash = passwordHash;
    this.createdAt = createdAt;
  }

  // Domeinlogica
  async register(username, email, password) {
    // validaties → database calls komen in /lib/user.js
  }

  async login(email, password) {}

  async getBlogs() {}

  async getComments() {}
}