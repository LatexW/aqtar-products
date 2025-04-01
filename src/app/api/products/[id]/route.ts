import { NextRequest, NextResponse } from 'next/server';
import { 
  getProductById as getApiProduct,
  updateProduct as updateApiProduct,
  deleteProduct as deleteApiProduct
} from '@/services/productService';
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

// Database functions
async function getProductByIdFromDB(id: string) {
  let connection;
  
  try {
    connection = await createDbConnection();
    
    const [rows] = await connection.query(
      `SELECT 
        id, title, price, description, category, image, 
        rating_rate as ratingRate, rating_count as ratingCount 
      FROM products 
      WHERE id = ?`,
      [id]
    );
    
    if ((rows as any[]).length === 0) {
      return null;
    }
    
    const row = (rows as any[])[0];
    return {
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
    };
  } catch (error) {
    console.error(`Error fetching product with ID ${id} from database:`, error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function updateProductInDB(id: string, product: any) {
  let connection;
  
  try {
    connection = await createDbConnection();
    
    // First check if the product exists
    const [existingRows] = await connection.query(
      'SELECT id FROM products WHERE id = ?',
      [id]
    );
    
    if ((existingRows as any[]).length === 0) {
      return null;
    }
    
    // Build the SET part of the query dynamically based on provided fields
    const updates: string[] = [];
    const values: any[] = [];
    
    if (product.title !== undefined) {
      updates.push('title = ?');
      values.push(product.title);
    }
    
    if (product.price !== undefined) {
      updates.push('price = ?');
      values.push(product.price);
    }
    
    if (product.description !== undefined) {
      updates.push('description = ?');
      values.push(product.description);
    }
    
    if (product.category !== undefined) {
      updates.push('category = ?');
      values.push(product.category);
    }
    
    if (product.image !== undefined) {
      updates.push('image = ?');
      values.push(product.image);
    }
    
    if (product.rating?.rate !== undefined) {
      updates.push('rating_rate = ?');
      values.push(product.rating.rate);
    }
    
    if (product.rating?.count !== undefined) {
      updates.push('rating_count = ?');
      values.push(product.rating.count);
    }
    
    // Add the ID to the values array for the WHERE clause
    values.push(id);
    
    // Execute the update query
    await connection.query(
      `UPDATE products SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    
    // Get the updated product
    return await getProductByIdFromDB(id);
  } catch (error) {
    console.error(`Error updating product with ID ${id} in database:`, error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function deleteProductFromDB(id: string) {
  let connection;
  
  try {
    connection = await createDbConnection();
    
    const [result] = await connection.query(
      'DELETE FROM products WHERE id = ?',
      [id]
    );
    
    return (result as any).affectedRows > 0;
  } catch (error) {
    console.error(`Error deleting product with ID ${id} from database:`, error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// GET endpoint to fetch a single product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Try to get product from database first
    try {
      const dbProduct = await getProductByIdFromDB(id);
      
      // If found in database, return it
      if (dbProduct) {
        return NextResponse.json({ 
          product: dbProduct,
          source: 'database'
        });
      }
    } catch (dbError) {
      console.error(`Database error when fetching product ${id}:`, dbError);
      // Continue to API fallback if database fails
    }
    
    // If not in database or database failed, fallback to API
    const apiProduct = await getApiProduct(id);
    
    return NextResponse.json({
      product: apiProduct,
      source: 'api'
    });
  } catch (error) {
    console.error(`Error fetching product:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT endpoint to update a product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const productData = await request.json();
    
    // Try to update in database first
    try {
      const dbProduct = await updateProductInDB(id, productData);
      
      // If updated in database successfully, return it
      if (dbProduct) {
        // Also try to update in API (but don't block on failure)
        try {
          await updateApiProduct(id, productData);
        } catch (apiError) {
          console.error(`Error syncing update to API for product ${id}:`, apiError);
          // Continue even if API update fails
        }
        
        return NextResponse.json({ 
          product: dbProduct,
          success: true,
          source: 'database'
        });
      }
    } catch (dbError) {
      console.error(`Database error when updating product ${id}:`, dbError);
      // Continue to API fallback if database fails
    }
    
    // If database update failed, fallback to API
    const apiProduct = await updateApiProduct(id, productData);
    
    return NextResponse.json({
      product: apiProduct,
      success: true,
      source: 'api'
    });
  } catch (error) {
    console.error(`Error updating product:`, error);
    return NextResponse.json(
      { error: 'Failed to update product', success: false },
      { status: 500 }
    );
  }
}

// DELETE endpoint to delete a product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Try to delete from database first
    try {
      const success = await deleteProductFromDB(id);
      
      // If deleted from database successfully
      if (success) {
        // Also try to delete from API (but don't block on failure)
        try {
          await deleteApiProduct(id);
        } catch (apiError) {
          console.error(`Error syncing deletion to API for product ${id}:`, apiError);
          // Continue even if API delete fails
        }
        
        return NextResponse.json({ 
          id,
          success: true,
          source: 'database'
        });
      }
    } catch (dbError) {
      console.error(`Database error when deleting product ${id}:`, dbError);
      // Continue to API fallback if database fails
    }
    
    // If database delete failed, fallback to API
    await deleteApiProduct(id);
    
    return NextResponse.json({
      id,
      success: true,
      source: 'api'
    });
  } catch (error) {
    console.error(`Error deleting product:`, error);
    return NextResponse.json(
      { error: 'Failed to delete product', success: false },
      { status: 500 }
    );
  }
} 