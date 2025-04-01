import { NextResponse } from 'next/server';
import { getAllProducts } from '@/services/productService';
import pool from '@/services/dbConfig';
import { RowDataPacket } from 'mysql2';

export async function GET() {
  try {
    // First check if we have products in the database
    const connection = await pool.getConnection();
    
    try {
      const [countResult] = await connection.query<RowDataPacket[]>(
        'SELECT COUNT(*) as count FROM products'
      );
      
      const count = (countResult[0] as any).count;
      
      // If we already have products, return success
      if (count > 0) {
        return NextResponse.json({ 
          success: true, 
          message: `Database already contains ${count} products. No sync needed.`,
          count
        });
      }
      
      // If no products, get them from the API and insert into database
      const products = await getAllProducts();
      let successCount = 0;
      
      for (const product of products) {
        try {
          await connection.query(
            `INSERT INTO products (
              id, title, price, description, category, image, rating_rate, rating_count
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              product.id,
              product.title,
              product.price,
              product.description,
              product.category,
              product.image,
              product.rating?.rate || 0,
              product.rating?.count || 0
            ]
          );
          successCount++;
        } catch (error) {
          console.error(`Error inserting product ${product.id}:`, error);
        }
      }
      
      return NextResponse.json({ 
        success: true, 
        message: `Initialized database with ${successCount} products.`,
        count: successCount
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to initialize database', error: (error as Error).message },
      { status: 500 }
    );
  }
} 