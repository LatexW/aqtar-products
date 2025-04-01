import { Product } from '@/types';

const API_URL = 'https://fakestoreapi.com/products';

// Get all products
export async function getAllProducts(): Promise<Product[]> {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
}

// Get a single product by ID
export async function getProductById(id: string): Promise<Product> {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch product with ID ${id}`);
  }
  return response.json();
}

// Create a new product
export async function createProduct(product: Omit<Product, 'id'>): Promise<Product> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  });
  if (!response.ok) {
    throw new Error('Failed to create product');
  }
  return response.json();
}

// Update an existing product
export async function updateProduct(id: string, product: Partial<Product>): Promise<Product> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  });
  if (!response.ok) {
    throw new Error(`Failed to update product with ID ${id}`);
  }
  return response.json();
}

// Delete a product
export async function deleteProduct(id: string): Promise<{ id: string }> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`Failed to delete product with ID ${id}`);
  }
  return { id };
} 