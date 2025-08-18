'use client';

import { useState, useEffect } from 'react';
import { fetchProduct, fetchProductVariants } from '@/lib/api';
import { Product, ProductVariant } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Props {
  params: { id: string };
}

export default function ProductDetailPage({ params }: Props) {
  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProductData();
  }, [params.id]);

  const loadProductData = async () => {
    try {
      const [productData, allVariants] = await Promise.all([
        fetchProduct(params.id),
        fetchProductVariants()
      ]);
      
      const productVariants = allVariants.filter((v:any) => v.productId === params.id);
      
      setProduct(productData);
      setVariants(productVariants);
    } catch (err) {
      setError('Failed to load product details');
      toast.error('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={loadProductData} />;
  if (!product) return <ErrorMessage message="Product not found" />;

  const totalStock = variants.reduce((sum, variant) => sum + variant.stock, 0);
  const minPrice = Math.min(...variants.map(v => v.price));
  const maxPrice = Math.max(...variants.map(v => v.price));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Search
          </Link>
          
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {product.image && (
                <div className="w-full lg:w-96 h-96 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="mb-6">
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
                  <p className="text-lg text-gray-600 mb-4">SKU: {product.sku}</p>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-3xl font-bold text-blue-600">
                      {variants.length === 1 ? formatPrice(variants[0].price) : 
                       `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`}
                    </div>
                    <Badge variant={totalStock > 0 ? 'default' : 'secondary'}>
                      {totalStock > 0 ? `${totalStock} in stock` : 'Out of stock'}
                    </Badge>
                  </div>

                  <div className="text-gray-600 space-y-2">
                    <p><strong>Product ID:</strong> {product.id}</p>
                    <p><strong>Available Variants:</strong> {variants.length}</p>
                    <p><strong>Created:</strong> {new Date(product.createdAt).toLocaleDateString()}</p>
                    <p><strong>Last Updated:</strong> {new Date(product.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    disabled={totalStock === 0}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-md flex items-center gap-2 transition-colors"
                    onClick={() => toast.success('Added to cart! (Demo)')}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Available Variants ({variants.length})
          </h2>
          
          {variants.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <p>No variants available for this product.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {variants.map((variant, index) => (
                <motion.div
                  key={variant.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full">
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
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-900">{variant.name}</h3>
                        <p className="text-2xl font-bold text-blue-600">
                          {formatPrice(variant.price)}
                        </p>
                        <div className="flex justify-between items-center">
                          <Badge variant={variant.stock > 0 ? 'default' : 'secondary'}>
                            {variant.stock > 0 ? `${variant.stock} in stock` : 'Out of stock'}
                          </Badge>
                          <button
                            disabled={variant.stock === 0}
                            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm transition-colors"
                            onClick={() => toast.success(`Added ${variant.name} to cart! (Demo)`)}
                          >
                            Add to Cart
                          </button>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>Model: {variant.model?.name || 'Unknown'}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}