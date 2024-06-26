const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'tingting_db'
};

function dbConnect() {
  return mysql.createConnection(dbConfig)
}

module.exports = dbConnect;