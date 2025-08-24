'use client'
import { Product, ProductVariant } from '@/types';
import Image from 'next/image';
import React from 'react'
import { motion } from 'framer-motion';
import { formatPrice } from '@/lib/utils';


export default function VariantCard({ variant, product }: { variant: ProductVariant; product?: Product }) {
  const img = variant.image || product?.image || "";
  const price = (variant as any).price ?? product?.price ?? 0;
  return (
    <motion.a
      href={`/products/${product?.id ?? variant.productId}`}
      whileHover={{ y: -4 }}
      className="snap-start shrink-0 w-64 rounded-2xl border border-gray-200 bg-white overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="relative h-36 bg-gray-50">
        {img ? (
          <Image src={img} alt={product?.name || variant.name} fill className="object-contain p-4" />
        ) : (
          <div className="h-full w-full grid place-items-center text-gray-400">No image</div>
        )}
      </div>
      <div className="p-4">
        <div className="text-xs text-gray-500 line-clamp-1">{product?.name}</div>
        <div className="font-semibold text-gray-900 line-clamp-1">{variant.name}</div>
        <div className="mt-2 font-bold text-indigo-600">{formatPrice(price)}</div>
      </div>
    </motion.a>
  );
}


