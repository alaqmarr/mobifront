'use client';

import { ProductVariant } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

interface ProductCardProps {
  variant: ProductVariant;
  index: number;
}

export default function ProductCard({ variant, index }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link href={`/products/${variant.product?.id || variant.productId}`}>
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            {variant.image && (
              <div className="w-full h-48 bg-gray-100 rounded-md mb-4 overflow-hidden">
                <img
                  src={variant.image}
                  alt={variant.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">{variant.name}</h3>
              <p className="text-2xl font-bold text-blue-600">
                {formatPrice(variant.price)}
              </p>
              <div className="flex justify-between items-center">
                <Badge variant={variant.stock > 0 ? 'default' : 'secondary'}>
                  {variant.stock > 0 ? `In Stock (${variant.stock})` : 'Out of Stock'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}