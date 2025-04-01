'use client';

import ProductForm from '@/components/ProductForm';
import { Product } from '@/types';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateProductPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(productData: Omit<Product, 'id'>) {
    setIsSubmitting(true);
    setError('');
    
    try {
      // Use server API endpoint for product creation
      const response = await fetch('/api/products/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create product');
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to create product');
      }
      
      router.push('/');
    } catch (err) {
      console.error('Error creating product:', err);
      setError(err instanceof Error ? err.message : 'Failed to create product');
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <ProductForm 
        onSubmit={handleSubmit}
        buttonText={isSubmitting ? "Creating..." : "Create Product"}
        buttonColor="blue"
        isSubmitting={isSubmitting}
      />
    </div>
  );
} 