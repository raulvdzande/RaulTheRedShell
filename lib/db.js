import mysql from "mysql2/promise";

const db = await mysql.createPool({
  host: "0i9zct.h.filess.io",
  user: "raultheredshell_hitrulerin",
  password: "9b5b894f9a075c5508210fd0c7173ee9b38f79e6",
  database: "raultheredshell_hitrulerin",
  port: 61032,
  connectTimeout: 60000,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default db;