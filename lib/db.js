import mysql from "mysql2/promise";

const db = await mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "raulthetshell",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default db;