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
    connectionLimit: 9,
    queueLimit: 0,
  },
};

const pool = mysql.createPool(config.db);

// Log the connection configuration for debugging
console.log('Database connection pool created with config:', config.db);

async function query(sql, params) {
  try {
    // Log the SQL query and parameters
    console.log('Executing query:', sql);
    console.log('With parameters:', params);

    const [rows] = await pool.execute(sql, params);
    
    // Log the result
    console.log('Query result:', rows);

    return rows;
  } catch (err) {
    // Log detailed error information
    console.error('Query error:', err.message);
    console.error('SQL query:', sql);
    console.error('Parameters:', params);

    // Optionally, log the stack trace
    console.error('Stack trace:', err.stack);

    throw err; // Re-throw the error after logging it
  }
}

module.exports = { query };
