import { Product } from '@/types';
import * as apiService from './productService';
import * as dbService from './mysqlProductService';

// Get all products (preferring database, falling back to API)
export async function getAllProducts(): Promise<Product[]> {
  try {
    // First try to get products from the database
    const dbProducts = await dbService.getAllProductsFromDB();
    
    // If we have products in the database, return them
    if (dbProducts && dbProducts.length > 0) {
      return dbProducts;
    }
    
    // If database is empty, fall back to API and sync to DB
    const apiProducts = await apiService.getAllProducts();
    
    // Store the API products in the database for future use
    for (const product of apiProducts) {
      try {
        await dbService.createProductInDB({
          title: product.title,
          price: product.price,
          description: product.description,
          category: product.category,
          image: product.image,
          rating: product.rating
        });
      } catch (error) {
        console.error(`Failed to store product ${product.id} in database:`, error);
      }
    }
    
    return apiProducts;
  } catch (error) {
    console.error('Error in hybrid getAllProducts:', error);
    // If database fails, try API as fallback
    return apiService.getAllProducts();
  }
}

// Get a single product by ID (preferring database, falling back to API)
export async function getProductById(id: string): Promise<Product> {
  try {
    // First try to get product from the database
    const dbProduct = await dbService.getProductByIdFromDB(id);
    
    // If found in database, return it
    if (dbProduct) {
      return dbProduct;
    }
    
    // If not in database, fall back to API
    const apiProduct = await apiService.getProductById(id);
    
    // Store the API product in the database for future use
    try {
      await dbService.createProductInDB({
        title: apiProduct.title,
        price: apiProduct.price,
        description: apiProduct.description,
        category: apiProduct.category,
        image: apiProduct.image,
        rating: apiProduct.rating
      });
    } catch (error) {
      console.error(`Failed to store fetched product ${id} in database:`, error);
    }
    
    return apiProduct;
  } catch (error) {
    console.error(`Error in hybrid getProductById for ID ${id}:`, error);
    // If database fails, try API as fallback
    return apiService.getProductById(id);
  }
}

// Create a new product (in database and API)
export async function createProduct(product: Omit<Product, 'id'>): Promise<Product> {
  try {
    // First create in database
    const dbProduct = await dbService.createProductInDB(product);
    
    // Then create in API (for backup/synchronization)
    try {
      await apiService.createProduct(product);
    } catch (error) {
      console.error('Failed to create product in API:', error);
      // Continue even if API fails - we prioritize our database
    }
    
    return dbProduct;
  } catch (error) {
    console.error('Error in hybrid createProduct:', error);
    // If database fails, try API as fallback
    return apiService.createProduct(product);
  }
}

// Update an existing product (in database and API)
export async function updateProduct(id: string, product: Partial<Product>): Promise<Product> {
  try {
    // First update in database
    const dbProduct = await dbService.updateProductInDB(id, product);
    
    if (!dbProduct) {
      throw new Error(`Product with ID ${id} not found in database`);
    }
    
    // Then update in API (for backup/synchronization)
    try {
      await apiService.updateProduct(id, product);
    } catch (error) {
      console.error(`Failed to update product ${id} in API:`, error);
      // Continue even if API fails - we prioritize our database
    }
    
    return dbProduct;
  } catch (error) {
    console.error(`Error in hybrid updateProduct for ID ${id}:`, error);
    // If database fails, try API as fallback
    return apiService.updateProduct(id, product);
  }
}

// Delete a product (from database and API)
export async function deleteProduct(id: string): Promise<{ id: string }> {
  try {
    // First delete from database
    const success = await dbService.deleteProductFromDB(id);
    
    if (!success) {
      throw new Error(`Product with ID ${id} not found in database`);
    }
    
    // Then delete from API (for backup/synchronization)
    try {
      await apiService.deleteProduct(id);
    } catch (error) {
      console.error(`Failed to delete product ${id} from API:`, error);
      // Continue even if API fails - we prioritize our database
    }
    
    return { id };
  } catch (error) {
    console.error(`Error in hybrid deleteProduct for ID ${id}:`, error);
    // If database fails, try API as fallback
    return apiService.deleteProduct(id);
  }
} 