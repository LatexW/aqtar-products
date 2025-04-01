'use client';

import { Product } from '@/types';
import { useState, FormEvent, useRef, ChangeEvent } from 'react';
import Image from 'next/image';

// Array of predefined categories
const PRODUCT_CATEGORIES = [
  'electronics',
  'jewelery',
  'men\'s clothing',
  'women\'s clothing'
];

interface ProductFormProps {
  initialData?: Partial<Product>;
  onSubmit: (product: Omit<Product, 'id'>) => Promise<void>;
  buttonText: string;
  buttonColor?: 'blue' | 'green' | 'red';
  isSubmitting?: boolean;
}

export default function ProductForm({
  initialData = {},
  onSubmit,
  buttonText,
  buttonColor = 'blue',
  isSubmitting: externalSubmitting
}: ProductFormProps) {
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    title: initialData.title || '',
    price: typeof initialData.price === 'number' 
      ? initialData.price 
      : typeof initialData.price === 'string' 
        ? parseFloat(initialData.price) || 0 
        : 0,
    description: initialData.description || '',
    category: initialData.category || PRODUCT_CATEGORIES[0],
    image: initialData.image || '',
  });
  const [internalSubmitting, setInternalSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [imageInputMethod, setImageInputMethod] = useState<'url' | 'upload'>(initialData.image ? 'url' : 'upload');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Preview for the current image (either URL or uploaded)
  const imagePreview = uploadedImage || formData.image;
  
  // Use external submitting state if provided, otherwise use internal state
  const isSubmitting = externalSubmitting !== undefined ? externalSubmitting : internalSubmitting;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleImageMethodChange = (method: 'url' | 'upload') => {
    setImageInputMethod(method);
    // Clear the errors when switching methods
    setUploadError('');
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file (JPEG, PNG, etc.)');
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size should be less than 5MB');
      return;
    }

    // Handle the file upload
    setIsUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload image');
      }

      // Update the form data with the new image URL and set preview
      setFormData(prev => ({
        ...prev,
        image: data.url,
      }));
      setUploadedImage(data.url);
    } catch (err) {
      console.error('Error uploading file:', err);
      setUploadError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Only set internal submitting if external submitting is not provided
    if (externalSubmitting === undefined) {
      setInternalSubmitting(true);
    }
    
    setError('');

    // Check if an image is provided
    if (!formData.image) {
      setError('Please provide an image URL or upload an image');
      if (externalSubmitting === undefined) {
        setInternalSubmitting(false);
      }
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      
      // Only reset internal submitting if external submitting is not provided
      if (externalSubmitting === undefined) {
        setInternalSubmitting(false);
      }
    }
  };

  const buttonStyles = {
    blue: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    green: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
    red: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6 bg-card-bg rounded-lg shadow border border-border">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-text-primary mb-1">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          value={formData.title}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
        />
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium text-text-primary mb-1">
          Price
        </label>
        <input
          type="number"
          step="0.01"
          id="price"
          name="price"
          required
          min="0"
          value={formData.price}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-text-primary mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-text-primary mb-1">
          Category
        </label>
        <div className="relative">
          <select
            id="category"
            name="category"
            required
            value={formData.category}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 pr-10 focus:outline-none focus:ring-blue-500 focus:border-blue-500 appearance-none text-gray-900 bg-white"
          >
            {PRODUCT_CATEGORIES.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 mt-1">
            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Product Image
        </label>
        
        {/* Toggle between URL and Upload */}
        <div className="flex space-x-4 mb-4">
          <button 
            type="button"
            onClick={() => handleImageMethodChange('url')}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              imageInputMethod === 'url' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Provide URL
          </button>
          <button 
            type="button"
            onClick={() => handleImageMethodChange('upload')}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              imageInputMethod === 'upload' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Upload Image
          </button>
        </div>
        
        {/* URL Input */}
        {imageInputMethod === 'url' && (
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-text-primary mb-1">
              Image URL
            </label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
            />
          </div>
        )}
        
        {/* File Upload */}
        {imageInputMethod === 'upload' && (
          <div>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={triggerFileInput}
              disabled={isUploading}
              className="w-full border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center hover:border-blue-500 transition-colors bg-white"
            >
              {isUploading ? (
                <div className="flex items-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-gray-900">Uploading...</span>
                </div>
              ) : (
                <>
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  <span className="mt-2 text-sm text-gray-900 font-medium">
                    {uploadedImage ? 'Change image' : 'Click to upload an image'}
                  </span>
                  <span className="mt-1 text-xs text-gray-500">
                    PNG, JPG, GIF up to 5MB
                  </span>
                </>
              )}
            </button>
            {uploadError && (
              <div className="mt-2 text-sm text-red-600">
                {uploadError}
              </div>
            )}
          </div>
        )}
        
        {/* Image Preview */}
        {imagePreview && (
          <div className="mt-4">
            <p className="text-sm font-medium text-text-primary mb-2">Preview:</p>
            <div className="relative h-40 w-full bg-white border border-gray-200 rounded-md overflow-hidden">
              <Image 
                src={imagePreview} 
                alt="Product preview" 
                fill
                className="object-contain p-2"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || isUploading}
          className={`${buttonStyles[buttonColor]} text-white py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 font-medium`}
        >
          {isSubmitting ? 'Processing...' : buttonText}
        </button>
      </div>
    </form>
  );
} 