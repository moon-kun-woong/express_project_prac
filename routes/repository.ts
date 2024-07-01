import mysql2 from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'tingting_db'
};

async function dbConnect() {
  return drizzle(await mysql2.createConnection(dbConfig));
}

export default dbConnect;