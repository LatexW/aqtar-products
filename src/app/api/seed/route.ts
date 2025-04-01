import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts } from '@/services/productService';
import mysql from 'mysql2/promise';

// Create a connection specifically for this API route
const createDbConnection = async () => {
  const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'aqtar_products_db',
    waitForConnections: true
  };
  
  return await mysql.createConnection(dbConfig);
};

// This API route can be called during build time or manually to seed the database
export async function GET(request: NextRequest) {
  let connection;
  
  try {
    // Check if force parameter is set
    const force = request.nextUrl.searchParams.get('force') === 'true';
    
    // Create a new connection
    connection = await createDbConnection();
    
    // Check if we have products in the database
    const [countResult] = await connection.query(
      'SELECT COUNT(*) as count FROM products'
    );
    
    const count = (countResult as any)[0].count;
    
    // If we already have products and force is not set, no need to seed
    if (count > 0 && !force) {
      return NextResponse.json({ 
        success: true, 
        message: `Database already contains ${count} products. No seeding needed.`,
        count
      });
    }
    
    // If force is set, truncate the products table
    if (force && count > 0) {
      await connection.query('TRUNCATE TABLE products');
    }
    
    // If no products or force=true, fetch from API and seed the database
    const products = await getAllProducts();
    let successCount = 0;
    
    // Begin transaction
    await connection.beginTransaction();
    
    try {
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
      
      // Commit transaction if everything is successful
      await connection.commit();
      
      return NextResponse.json({ 
        success: true, 
        message: `Seeded database with ${successCount} products.`,
        count: successCount,
        reseeded: force
      });
    } catch (error) {
      // Rollback transaction if there was an error
      await connection.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to seed database', error: (error as Error).message },
      { status: 500 }
    );
  } finally {
    // Close the connection
    if (connection) {
      await connection.end();
    }
  }
} 