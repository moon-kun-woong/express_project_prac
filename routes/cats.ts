import { mysqlTable, serial, text , int} from 'drizzle-orm/mysql-core';

export const cats = mysqlTable('cats', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  age: int('age').notNull(),
  breed: text('breed').notNull(),
});