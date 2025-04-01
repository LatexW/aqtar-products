'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProductForm from '@/components/ProductForm';
import { Product } from '@/types';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    async function fetchProduct() {
      if (!id) {
        setError('Product ID is missing');
        setLoading(false);
        return;
      }
      
      try {
        // Use server API endpoint
        const response = await fetch(`/api/products/${id}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch product with ID ${id}`);
        }
        
        const data = await response.json();
        // console.log('Product data received:', data.product);
        // console.log('Price type:', typeof data.product.price, 'Value:', data.product.price);
        setProduct(data.product);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  async function handleSubmit(productData: Omit<Product, 'id'>) {
    if (!id) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // Use server API endpoint for updating
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update product with ID ${id}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to update product');
      }
      
      router.push(`/product/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product');
      console.error('Error updating product:', err);
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      {product && (
        <ProductForm 
          initialData={product}
          onSubmit={handleSubmit}
          buttonText={isSubmitting ? "Updating..." : "Update Product"}
          buttonColor="green"
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
} 