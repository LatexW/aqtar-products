import mysql from 'mysql2/promise';
import { ensureServer } from '@/utils/server-only';

// Ensure this code only runs on the server
ensureServer();

// MySQL database connection configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',      // Default XAMPP MySQL username
  password: '',      // Default XAMPP MySQL password is empty
  database: 'aqtar_products_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Test the database connection
export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Database connection successful');
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

export default pool; 