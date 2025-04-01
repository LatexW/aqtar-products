import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts } from '@/services/productService';
import pool from '@/services/dbConfig';
import { ResultSetHeader } from 'mysql2';

export async function GET(request: NextRequest) {
  try {
    // Get products from the external API
    const products = await getAllProducts();
    
    // Create a connection from the pool
    const connection = await pool.getConnection();
    
    try {
      // Begin transaction
      await connection.beginTransaction();
      
      // For each product, insert or update in our database
      let successCount = 0;
      let errorCount = 0;
      
      for (const product of products) {
        try {
          // Check if product exists
          const [existingProducts] = await connection.query<ResultSetHeader>(
            'SELECT id FROM products WHERE id = ?',
            [product.id]
          );
          
          if ((existingProducts as any).length > 0) {
            // Update existing product
            await connection.query(
              `UPDATE products SET 
                title = ?, 
                price = ?, 
                description = ?, 
                category = ?, 
                image = ?, 
                rating_rate = ?, 
                rating_count = ?
              WHERE id = ?`,
              [
                product.title,
                product.price,
                product.description,
                product.category,
                product.image,
                product.rating?.rate || 0,
                product.rating?.count || 0,
                product.id
              ]
            );
          } else {
            // Insert new product
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
          }
          
          successCount++;
        } catch (error) {
          console.error(`Error syncing product ${product.id}:`, error);
          errorCount++;
        }
      }
      
      // Commit the transaction
      await connection.commit();
      
      return NextResponse.json({ 
        success: true, 
        message: `Synced ${successCount} products successfully, ${errorCount} failed.`,
        totalProductsSynced: successCount,
        totalProductsFailed: errorCount
      });
    } catch (error) {
      // If any error occurs, rollback the transaction
      await connection.rollback();
      throw error;
    } finally {
      // Release the connection back to the pool
      connection.release();
    }
  } catch (error) {
    console.error('Error syncing products:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to sync products', error: (error as Error).message },
      { status: 500 }
    );
  }
} 