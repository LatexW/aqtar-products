'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <h1 className="text-4xl font-bold text-accent mb-4">Something went wrong!</h1>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        {error.message || 'An unexpected error occurred'}
      </p>
      <div className="flex space-x-4">
        <button
          onClick={reset}
          className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          Try again
        </button>
        <Link 
          href="/"
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
} 