'use server';

import { createProduct, updateProduct, deleteProduct } from '@/services/productService';
import { Product } from '@/types';
import { redirect } from 'next/navigation';

export async function handleCreateProduct(productData: Omit<Product, 'id'>) {
  try {
    await createProduct(productData);
    redirect('/');
  } catch (error) {
    console.error('Failed to create product:', error);
    throw error;
  }
}

export async function handleUpdateProduct(id: string, productData: Omit<Product, 'id'>) {
  try {
    await updateProduct(id, productData);
    redirect(`/product/${id}`);
  } catch (error) {
    console.error('Failed to update product:', error);
    throw error;
  }
}

export async function handleDeleteProduct(id: string) {
  try {
    await deleteProduct(id);
    redirect('/');
  } catch (error) {
    console.error('Failed to delete product:', error);
    throw error;
  }
} 