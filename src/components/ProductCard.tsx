import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { formatPrice } from '@/utils/formatters';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-card-bg rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-border card-hover">
      <Link href={`/product/${product.id}`} className="block h-full">
        <div className="relative h-52 w-full bg-white border-b border-border">
          <div className="absolute top-3 right-3 z-10">
            <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-700 font-medium capitalize">
              {product.category}
            </span>
          </div>
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain p-6"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-5">
          <h2 className="text-lg font-semibold line-clamp-1 mb-2 text-text-primary">{product.title}</h2>
          <p className="text-text-secondary text-sm line-clamp-2 h-10 mb-4">
            {product.description}
          </p>
          <div className="flex justify-between items-center">
            <p className="text-xl font-bold text-indigo-600">${formatPrice(product.price)}</p>
            <div className="flex items-center">
              {product.rating && (
                <div className="flex items-center text-yellow-500">
                  <span className="mr-1">★</span>
                  <span className="text-sm text-text-secondary">{product.rating.rate}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
} 