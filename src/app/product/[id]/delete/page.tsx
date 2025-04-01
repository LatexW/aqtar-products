'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { formatPrice } from '@/utils/formatters';

export default function DeleteProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
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

  async function handleDelete() {
    if (!id) return;
    
    setDeleting(true);
    try {
      // Use server API endpoint for deletion
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete product with ID ${id}`);
      }
      
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
      console.error('Error deleting product:', err);
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error || 'Product not found'}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-red-600 mb-6">Confirm Delete</h1>
      
      <div className="bg-red-50 border border-red-200 p-4 mb-6 rounded-md">
        <p className="text-red-800 font-medium">
          Are you sure you want to delete this product? This action cannot be undone.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="relative h-80 md:h-96 w-full">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div>
          <h2 className="text-xl font-bold mb-2">{product.title}</h2>
          <p className="text-gray-500 mb-4">{product.category}</p>
          <p className="text-2xl font-bold text-blue-600 mb-4">${formatPrice(product.price)}</p>
          <p className="text-gray-700 mb-4">{product.description}</p>
        </div>
      </div>
      
      <div className="flex space-x-4">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {deleting ? 'Deleting...' : 'Confirm Delete'}
        </button>
        <Link 
          href={`/product/${id}`} 
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors flex-1 text-center"
        >
          Cancel
        </Link>
      </div>
    </div>
  );
} 