import mysql from 'mysql2/promise';
import { RowDataPacket } from 'mysql2';

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

// Removed the `pool.getConnection()` test to avoid issues in non-server environments
// Ensure the `query` function is used only in server-side code

export const query = async <T extends RowDataPacket[]>(sql: string, params?: any[]): Promise<[T, any]> => {
  try {
    if (params && params.some(param => param === undefined)) {
      console.error('Query parameters contain undefined values:', params);
      throw new Error('Query parameters must not contain undefined values');
    }
    const results = await pool.execute(sql, params);
    return results as [T, any];
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};