import 'server-only';
import { getAllProductsFromDB } from '@/services/mysqlProductService';
import { getAllProducts as getApiProducts } from '@/services/productService';
import { ensureServer } from '@/utils/server-only';

// This ensures the file only runs on the server
ensureServer();

// Prefetch data server-side for the home page
export async function getHomePageData() {
  try {
    // Try to get products from database first
    try {
      const dbProducts = await getAllProductsFromDB();
      
      // If we have products in the database, return them
      if (dbProducts && dbProducts.length > 0) {
        return { 
          products: dbProducts,
          source: 'database'
        };
      }
    } catch (dbError) {
      console.error('Database error when fetching products:', dbError);
      // Continue to API fallback if database fails
    }
    
    // If database is empty or failed, fallback to API
    const apiProducts = await getApiProducts();
    
    return {
      products: apiProducts,
      source: 'api'
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }
} 