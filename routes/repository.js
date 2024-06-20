// Connect DB
const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'tingting_db'
};

async function dbConnect() {
  const connection = await mysql.createConnection(dbConfig);
  return connection;
}

module.exports = dbConnect;