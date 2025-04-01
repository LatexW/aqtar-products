import { NextRequest, NextResponse } from 'next/server';
import pool from '@/services/dbConfig';
import { RowDataPacket } from 'mysql2';

export async function GET(request: NextRequest) {
  try {
    // Check if we have products in the database
    const connection = await pool.getConnection();
    
    try {
      const [rows] = await connection.query<RowDataPacket[]>(
        'SELECT COUNT(*) as count FROM products'
      );
      
      const count = (rows[0] as any).count;
      
      // If we have products in the database, we're using it as our source
      const source = count > 0 ? 'database' : 'api';
      
      return NextResponse.json({ source, count });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error checking data source:', error);
    return NextResponse.json({ source: 'api', error: 'Database connection failed' });
  }
} 