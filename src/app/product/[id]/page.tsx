'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { formatPrice } from '@/utils/formatters';

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dataSource, setDataSource] = useState<'database' | 'api' | 'loading'>('loading');
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    async function fetchProduct() {
      if (!id) {
        setError('Product ID is missing');
        setLoading(false);
        return;
      }

      try {
        // Use server API endpoint instead of direct database access
        const response = await fetch(`/api/products/${id}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch product with ID ${id}`);
        }
        
        const data = await response.json();
        setProduct(data.product);
        setDataSource(data.source);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
        {error || 'Product not found'}
      </div>
    );
  }

  return (
    <div className="bg-card-bg rounded-xl shadow-lg p-6 max-w-5xl mx-auto border border-border">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative h-80 md:h-96 w-full bg-white rounded-lg overflow-hidden">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain p-4"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold mb-2 text-text-primary">{product.title}</h1>
          <p className="text-text-secondary mb-4 capitalize">{product.category}</p>
          <p className="text-3xl font-bold text-accent mb-6">${formatPrice(product.price)}</p>
          
          {product.rating && (
            <div className="mb-6">
              <div className="flex items-center mb-1">
                <span className="text-yellow-500 mr-1">★</span>
                <span className="text-text-primary">{product.rating.rate} / 5</span>
              </div>
              <p className="text-sm text-text-secondary">{product.rating.count} reviews</p>
            </div>
          )}
          
          <div className="mb-6">
            <div className="text-xs text-text-secondary inline-flex items-center">
              <span className="w-2 h-2 rounded-full mr-2 bg-accent"></span>
              Data source: {dataSource === 'database' ? 'MySQL Database' : 'External API'}
            </div>
          </div>
          
          <div className="mb-8 bg-opacity-5 bg-text-secondary p-4 rounded-lg">
            <h2 className="font-semibold mb-2 text-text-primary">Description:</h2>
            <p className="text-text-secondary">{product.description}</p>
          </div>
          
          <div className="mt-auto flex space-x-4">
            <Link 
              href={`/product/edit/${id}`} 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex-1 text-center shadow-md border border-blue-700 font-medium"
            >
              Edit Product
            </Link>
            <Link 
              href={`/product/${id}/delete`} 
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex-1 text-center shadow-md border border-red-700 font-medium"
            >
              Delete Product
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 