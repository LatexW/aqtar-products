import { NextResponse } from 'next/server';
import { getAllProducts as getApiProducts } from '@/services/productService';
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

// Get products from database
async function getAllProductsFromDB() {
  let connection;
  
  try {
    connection = await createDbConnection();
    
    const [rows] = await connection.query(`
      SELECT 
        id, title, price, description, category, image, 
        rating_rate as ratingRate, rating_count as ratingCount 
      FROM products
    `);
    
    return (rows as any[]).map(row => ({
      id: row.id,
      title: row.title,
      price: row.price,
      description: row.description,
      category: row.category,
      image: row.image,
      rating: {
        rate: row.ratingRate,
        count: row.ratingCount
      }
    }));
  } catch (error) {
    console.error('Error fetching products from database:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

export async function GET() {
  try {
    // Try to get products from database first
    try {
      const dbProducts = await getAllProductsFromDB();
      
      // If we have products in the database, return them
      if (dbProducts && dbProducts.length > 0) {
        return NextResponse.json({ 
          products: dbProducts,
          source: 'database'
        });
      }
    } catch (dbError) {
      console.error('Database error when fetching products:', dbError);
      // Continue to API fallback if database fails
    }
    
    // If database is empty or failed, fallback to API
    const apiProducts = await getApiProducts();
    
    return NextResponse.json({
      products: apiProducts,
      source: 'api'
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
} 