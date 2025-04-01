import { NextRequest, NextResponse } from 'next/server';
import { createProduct as createApiProduct } from '@/services/productService';
import mysql from 'mysql2/promise';

// Create a connection for this API route
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

// Database function to create a product
async function createProductInDB(product: any) {
  let connection;
  
  try {
    connection = await createDbConnection();
    
    const { title, price, description, category, image, rating } = product;
    
    const [result] = await connection.query(
      `INSERT INTO products (
        title, price, description, category, image, rating_rate, rating_count
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        title, 
        price, 
        description, 
        category, 
        image, 
        rating?.rate || 0, 
        rating?.count || 0
      ]
    );
    
    return {
      id: (result as any).insertId,
      ...product
    };
  } catch (error) {
    console.error('Error creating product in database:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const productData = await request.json();
    
    // Try to create in database first
    try {
      const dbProduct = await createProductInDB(productData);
      
      // Also try to create in API (but don't block on failure)
      try {
        await createApiProduct(productData);
      } catch (apiError) {
        console.error('Error syncing new product to API:', apiError);
        // Continue even if API creation fails
      }
      
      return NextResponse.json({ 
        product: dbProduct,
        success: true,
        source: 'database'
      });
    } catch (dbError) {
      console.error('Database error when creating product:', dbError);
      // Continue to API fallback if database fails
    }
    
    // If database creation failed, fallback to API
    const apiProduct = await createApiProduct(productData);
    
    return NextResponse.json({
      product: apiProduct,
      success: true,
      source: 'api'
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product', success: false },
      { status: 500 }
    );
  }
} 