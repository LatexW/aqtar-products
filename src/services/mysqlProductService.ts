import { Product } from '@/types';
import pool from './dbConfig';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { ensureServer } from '@/utils/server-only';

// Ensure this code only runs on the server
ensureServer();

// Get all products from the database
export async function getAllProductsFromDB(): Promise<Product[]> {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT 
        id, title, price, description, category, image, 
        rating_rate as ratingRate, rating_count as ratingCount 
      FROM products
    `);
    
    return rows.map(row => ({
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
    throw new Error('Failed to fetch products from database');
  }
}

// Get a single product by ID from the database
export async function getProductByIdFromDB(id: string): Promise<Product | null> {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT 
        id, title, price, description, category, image, 
        rating_rate as ratingRate, rating_count as ratingCount 
      FROM products 
      WHERE id = ?`,
      [id]
    );
    
    if (rows.length === 0) {
      return null;
    }
    
    const row = rows[0];
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
    throw new Error(`Failed to fetch product with ID ${id} from database`);
  }
}

// Create a new product in the database
export async function createProductInDB(product: Omit<Product, 'id'>): Promise<Product> {
  try {
    const { title, price, description, category, image, rating } = product;
    
    const [result] = await pool.query<ResultSetHeader>(
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
      id: result.insertId,
      ...product
    };
  } catch (error) {
    console.error('Error creating product in database:', error);
    throw new Error('Failed to create product in database');
  }
}

// Update an existing product in the database
export async function updateProductInDB(id: string, product: Partial<Product>): Promise<Product | null> {
  try {
    // First check if the product exists
    const existingProduct = await getProductByIdFromDB(id);
    if (!existingProduct) {
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
    await pool.query(
      `UPDATE products SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    
    // Get the updated product
    const updatedProduct = await getProductByIdFromDB(id);
    return updatedProduct;
  } catch (error) {
    console.error(`Error updating product with ID ${id} in database:`, error);
    throw new Error(`Failed to update product with ID ${id} in database`);
  }
}

// Delete a product from the database
export async function deleteProductFromDB(id: string): Promise<boolean> {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM products WHERE id = ?',
      [id]
    );
    
    return result.affectedRows > 0;
  } catch (error) {
    console.error(`Error deleting product with ID ${id} from database:`, error);
    throw new Error(`Failed to delete product with ID ${id} from database`);
  }
} 