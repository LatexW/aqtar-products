'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative h-12 w-12 bg-white p-1 shadow-md transition-transform group-hover:scale-105 rounded-md">
                <Image 
                  src="/images/logo.png" 
                  alt="AQTAR Logo" 
                  width={120} 
                  height={120}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-tight text-white group-hover:text-white/90 transition-colors">
                  AQTAR
                </span>
                <span className="text-xs text-indigo-100 font-light tracking-wider">
                  PREMIUM PRODUCTS
                </span>
              </div>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className="font-medium text-white/80 hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/product/new" 
              className="px-4 py-2 rounded-lg bg-white text-indigo-700 hover:bg-indigo-50 shadow-lg transition-all hover:shadow-xl border border-indigo-100 font-medium flex items-center space-x-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              <span>Add Product</span>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <Link 
              href="/product/new" 
              className="inline-flex items-center justify-center p-2 rounded-md text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 