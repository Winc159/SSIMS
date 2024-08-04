const mysql = require('mysql2/promise');
require("dotenv").config();

const config = {
  db: {
    host: process.env.DB_CONTAINER,
    port: process.env.DB_PORT,
    user: process.env.MYSQL_ROOT_USER,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  },
};

const pool = mysql.createPool(config.db);

async function query(sql, params) {
  try {
    const [rows] = await pool.execute(sql, params);
    console.log('Query result:', rows); // 打印返回的结果
    return rows; // 直接返回 rows，而不是 `[rows]`
  } catch (err) {
    console.error('Query error:', err.message);
    throw err;
  }
}

module.exports = { query };
