'use client';

import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dataSource, setDataSource] = useState<'database' | 'api' | 'loading'>('loading');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [resetMessage, setResetMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);

  const fetchProducts = async () => {
    try {
      // Use our server API endpoint instead of direct database access
      const response = await fetch('/api/products', {
        // Add cache: 'no-store' to prevent caching
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      setProducts(data.products);
      setFilteredProducts(data.products);
      setDataSource(data.source);
      setError('');
      
      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(data.products.map((product: Product) => product.category))
      ).sort() as string[];
      
      setCategories(uniqueCategories);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  
  // Filter products when category changes
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter(product => product.category === selectedCategory)
      );
    }
  }, [selectedCategory, products]);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      setResetMessage('');
      
      // First call the seed API with force=true to reset the database
      const seedResponse = await fetch('/api/seed?force=true', {
        cache: 'no-store'
      });
      
      if (!seedResponse.ok) {
        throw new Error('Failed to reset database');
      }
      
      const seedData = await seedResponse.json();
      
      // Set a temporary success message
      if (seedData.success) {
        setResetMessage(`Successfully reset data. Reseeded with ${seedData.count} products.`);
        
        // After a short delay, fetch the products again
        setTimeout(() => {
          fetchProducts();
          // Clear the message after products load
          setTimeout(() => setResetMessage(''), 3000);
        }, 500);
      } else {
        throw new Error(seedData.message || 'Failed to reset database');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset data');
      console.error('Error resetting data:', err);
      setIsRefreshing(false);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
          <p className="mt-4 text-text-secondary">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow">
        <div className="flex items-center">
          <svg className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>{error}</p>
        </div>
        <button 
          onClick={handleRefresh}
          className="mt-3 ml-9 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 fade-in">
      <div className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-4xl font-bold mb-2">AQTAR Premium Products</h1>
        <p className="text-indigo-100 max-w-3xl">
          Browse our exclusive collection of high-quality products. Filter by category to find exactly what you're looking for.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center">
          <div className="text-sm px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full flex items-center">
            <span className="w-2 h-2 rounded-full mr-2 bg-indigo-600"></span>
            Data source: {dataSource === 'database' ? 
              'MySQL Database' : 
              dataSource === 'api' ? 
              'External API' : 
              'Loading...'}
            
            <button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="ml-4 px-3 py-1 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors text-xs flex items-center shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isRefreshing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Refreshing...
                </>
              ) : (
                <>
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  Reset
                </>
              )}
            </button>
          </div>
        </div>
        
        <div className="relative w-full md:w-64">
          <label htmlFor="category-filter" className="block text-sm font-medium text-text-primary mb-1">
            Filter by Category
          </label>
          <div className="relative">
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="block w-full rounded-lg border border-border bg-white py-2 pl-3 pr-10 text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {resetMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg shadow flex items-center">
          <svg className="h-6 w-6 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          {resetMessage}
        </div>
      )}
      
      {filteredProducts.length === 0 ? (
        <div className="bg-card-bg rounded-xl p-12 text-center text-text-secondary border border-border shadow-sm">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="mt-4 text-lg">No products found in this category.</p>
          <p className="text-sm text-text-muted mt-2">Try selecting a different category or reset the data.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
