'use client';

import { useState, useEffect } from 'react';
import { fetchProduct, fetchProductVariants } from '@/lib/api';
import { Product, ProductVariant } from '@/types';
import ErrorMessage from '@/components/ErrorMessage';
import { ArrowLeft, ShoppingCart, PackageX, Calendar, Layers, Tag, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';
import { useParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';

// --- Skeleton Components ---
const ProductHeaderSkeleton = () => (
    <div className="flex flex-col lg:flex-row gap-8 animate-pulse">
        <div className="w-full lg:w-96 h-96 bg-gray-200/80 rounded-2xl flex-shrink-0"></div>
        <div className="flex-1">
            <div className="h-12 bg-gray-200/80 rounded-lg w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-200/80 rounded-lg w-1/4 mb-6"></div>
            <div className="h-10 bg-gray-200/80 rounded-lg w-1/2 mb-6"></div>
            <div className="flex flex-wrap gap-3">
                <div className="h-8 bg-gray-200/80 rounded-full w-28"></div>
                <div className="h-8 bg-gray-200/80 rounded-full w-36"></div>
                <div className="h-8 bg-gray-200/80 rounded-full w-40"></div>
            </div>
        </div>
    </div>
);

const VariantGridSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-white/60 rounded-2xl p-4 animate-pulse">
                <div className="h-40 bg-gray-200/80 rounded-lg mb-4"></div>
                <div className="h-5 bg-gray-200/80 rounded w-5/6 mb-3"></div>
                <div className="h-4 bg-gray-200/80 rounded w-1/2 mb-4"></div>
                <div className="flex justify-between items-center">
                    <div className="h-8 bg-gray-200/80 rounded w-1/3"></div>
                    <div className="h-10 bg-gray-200/80 rounded-lg w-1/3"></div>
                </div>
            </div>
        ))}
    </div>
);


export default function ProductDetailPage() {
    const [product, setProduct] = useState<Product | null>(null);
    const [variants, setVariants] = useState<ProductVariant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const params = useParams();
    const productId = params.id as string;

    useEffect(() => {
        if (productId) {
            loadProductData();
        }
    }, [productId]);

    const loadProductData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [productData, allVariants] = await Promise.all([
                fetchProduct(productId),
                fetchProductVariants()
            ]);
            const productVariants = allVariants.filter((v: any) => v.productId === productId);
            setProduct(productData);
            setVariants(productVariants);
        } catch (err) {
            setError('Failed to load product details');
            toast.error('Failed to load product details');
        } finally {
            setLoading(false);
        }
    };

    if (error && !loading) return <ErrorMessage message={error} onRetry={loadProductData} />;
    if (!product && !loading) return <ErrorMessage message="Product not found" />;

    const totalStock = variants.reduce((sum, variant) => sum + variant.stock, 0);
    const minPrice = Math.min(...variants.map(v => v.price).filter(p => p > 0));
    const maxPrice = Math.max(...variants.map(v => v.price));

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_20%_10%,rgba(99,102,241,0.1),transparent_35%),radial-gradient(circle_at_80%_90%,rgba(236,72,153,0.08),transparent_40%)]">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
            >
                <div className="mb-8">
                    <Link
                        href={`/`}
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 bg-white/70 backdrop-blur border border-gray-200 rounded-full px-4 py-2 hover:bg-white hover:shadow-sm transition-all"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to home
                    </Link>
                </div>

                <div className="mb-12 md:mb-16">
                    {loading ? <ProductHeaderSkeleton /> : product && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7 }}
                            className="flex flex-col lg:flex-row gap-8"
                        >
                            {product.image && (
                                <div className="w-full lg:w-96 h-96 bg-white/60 border border-gray-200 p-4 rounded-2xl flex-shrink-0">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        width={384}
                                        height={384}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            )}
                            <div className="flex-1">
                                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
                                    <span className="bg-gradient-to-r from-indigo-600 to-fuchsia-500 bg-clip-text text-transparent">{product.name}</span>
                                </h1>
                                <p className="text-gray-500 mt-2">SKU: {product.sku}</p>
                                
                                <div className="my-6">
                                    <p className="text-sm text-gray-600">Price Range</p>
                                    <p className="text-4xl font-bold text-indigo-600">
                                       {variants.length > 1 && minPrice !== maxPrice 
                                         ? `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`
                                         : formatPrice(variants[0]?.price ?? product.price)}
                                    </p>
                                </div>
                                
                                <div className="flex flex-wrap gap-3 text-sm">
                                    <InfoPill icon={totalStock > 0 ? CheckCircle : XCircle} text={`${totalStock} Total in stock`} status={totalStock > 0 ? 'success' : 'danger'} />
                                    <InfoPill icon={Layers} text={`${variants.length} Variants`} />
                                    <InfoPill icon={Calendar} text={`Created: ${new Date(product.createdAt).toLocaleDateString()}`} />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                        Available Variants
                    </h2>
                    {loading ? <VariantGridSkeleton /> : variants.length === 0 ? (
                        <div className="text-center text-gray-500 py-16 flex flex-col items-center">
                            <PackageX className="w-12 h-12 text-gray-400 mb-4" />
                            <p className="text-xl font-semibold text-gray-700">No Variants Available</p>
                            <p>There are no specific variants listed for this product.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {variants.map((variant, index) => (
                                <motion.div
                                    key={variant.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.05 }}
                                >
                                    <VariantCard variant={variant} />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

// --- Helper Components ---
const InfoPill = ({ icon: Icon, text, status }: { icon: React.ElementType, text: string, status?: 'success' | 'danger' }) => {
    const statusClass = status === 'success' ? 'text-green-700' : status === 'danger' ? 'text-red-700' : 'text-gray-800';
    return (
        <div className={`flex items-center gap-2 px-3 py-1.5 bg-white/70 backdrop-blur border border-gray-200 rounded-full ${statusClass}`}>
            <Icon className="w-4 h-4" />
            <span className="font-medium">{text}</span>
        </div>
    );
}

const VariantCard = ({ variant }: { variant: ProductVariant }) => (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)" }}
      className="bg-white/70 backdrop-blur rounded-2xl border border-gray-200 overflow-hidden h-full flex flex-col"
    >
      <div className="h-48 bg-gray-50 p-4 flex-shrink-0">
        {variant.image ? (
          <Image
            src={variant.image}
            alt={variant.name}
            width={200}
            height={200}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full grid place-content-center text-gray-400">No Image</div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{variant.name}</h3>
        <p className="text-sm text-gray-500 mt-1">SKU: {variant.id}</p>
        
        <div className="flex-grow"></div>
        
        <div className="mt-4 flex justify-between items-center">
          <p className="text-2xl font-bold text-indigo-600">{formatPrice(variant.price)}</p>
          <Badge variant={variant.stock > 0 ? 'default' : 'secondary'}>
            {variant.stock > 0 ? `${variant.stock} in stock` : 'Out of stock'}
          </Badge>
        </div>
        
        <button
          disabled={variant.stock === 0}
          className="mt-4 w-full bg-gray-900 hover:bg-black disabled:bg-gray-400 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 font-semibold transition-colors"
          onClick={() => toast.success(`Added ${variant.name} to cart! (Demo)`)}
        >
          <ShoppingCart className="h-5 w-5" />
          Add to Cart
        </button>
      </div>
    </motion.div>
  );