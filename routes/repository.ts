import mysql2 from 'mysql2/promise';

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'tingting_db'
};

function dbConnect() {
  return mysql2.createConnection(dbConfig)
}

export default dbConnect;