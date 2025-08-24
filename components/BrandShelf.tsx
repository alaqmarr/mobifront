'use client'
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import RowCarousel from './RowCarousel';
import VariantCard from './VariantCard';
import { Brand, Product, ProductVariant } from '@/types';


export default function BrandShelf({
  brand,
  variants,
  productById,
}: {
  brand: Brand;
  variants: ProductVariant[];
  productById: Map<string, Product>;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white border border-gray-200 overflow-hidden grid place-items-center">
            {brand.image ? (
              <Image src={brand.image} alt={brand.name} width={40} height={40} className="object-contain" />
            ) : (
              <span className="text-sm text-gray-500">{brand.name[0]}</span>
            )}
          </div>
          <h3 className="text-xl font-bold text-gray-900">{brand.name}</h3>
        </div>
        <Link href={`/brands/${brand.id}`} className="text-sm text-gray-700 hover:text-gray-900 inline-flex items-center gap-1">
          View brand <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <RowCarousel>
        {variants.map((v) => (
          <VariantCard key={v.id} variant={v} product={productById.get(v.productId)} />
        ))}
      </RowCarousel>
    </div>
  );
}

