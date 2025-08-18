'use client';

import { useState, useEffect } from 'react';
import { fetchSingleModel, fetchProductVariantsByModel } from '@/lib/api';
import { Model, ProductVariant } from '@/types';
import ErrorMessage from '@/components/ErrorMessage';
import { ArrowLeft, ShoppingBag, Layers, Hash, Calendar, Tag, Palette } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { formatPrice } from '@/lib/utils'; // Assuming you have a price formatter
import { useParams } from 'next/navigation';

// --- Skeleton Components for a Superior Loading Experience ---
const HeaderSkeleton = () => (
  <div className="flex flex-col md:flex-row items-start gap-8 animate-pulse">
    <div className="w-full md:w-64 h-64 bg-gray-200/80 rounded-2xl flex-shrink-0"></div>
    <div className="flex-1 mt-4 md:mt-0">
      <div className="h-12 bg-gray-200/80 rounded-lg w-3/4 mb-6"></div>
      <div className="flex flex-wrap gap-3">
        <div className="h-8 bg-gray-200/80 rounded-full w-40"></div>
        <div className="h-8 bg-gray-200/80 rounded-full w-36"></div>
        <div className="h-8 bg-gray-200/80 rounded-full w-28"></div>
        <div className="h-8 bg-gray-200/80 rounded-full w-44"></div>
      </div>
    </div>
  </div>
);

const VariantGridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: 4 }).map((_, index) => (
      <div key={index} className="bg-white/60 rounded-2xl p-4 animate-pulse">
        <div className="h-40 bg-gray-200/80 rounded-lg mb-4"></div>
        <div className="h-5 bg-gray-200/80 rounded w-5/6 mb-2"></div>
        <div className="h-4 bg-gray-200/80 rounded w-1/2"></div>
      </div>
    ))}
  </div>
);

export default function ModelDetailPage() {
  const [model, setModel] = useState<Model | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id: modelId } = useParams();

  useEffect(() => {
    if (modelId) {
      loadModelData();
    }
  }, [modelId]);

  const loadModelData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [modelData, variantsData] = await Promise.all([
        fetchSingleModel(modelId as string),
        fetchProductVariantsByModel(modelId as string)
      ]);
      setModel(modelData);
      setVariants(variantsData);
    } catch (err) {
      const msg = 'Failed to load model details';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (error && !loading) return <ErrorMessage message={error} onRetry={loadModelData} />;
  if (!model && !loading) return <ErrorMessage message="Model not found" />;

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
            href={`/series/${model?.seriesId ?? ''}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 bg-white/70 backdrop-blur border border-gray-200 rounded-full px-4 py-2 hover:bg-white hover:shadow-sm transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {model?.series?.name || 'Series'}
          </Link>
        </div>

        {/* --- Animated Header --- */}
        <div className="mb-12 md:mb-16">
          {loading ? <HeaderSkeleton /> : model && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="flex flex-col md:flex-row items-start gap-8"
            >
              {model.image && (
                <div className="w-full md:w-64 h-64 bg-white/60 border border-gray-200 p-4 rounded-2xl flex-shrink-0">
                  <Image
                    src={model.image}
                    alt={model.name}
                    width={256}
                    height={256}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <div className="flex-1">
                <p className="text-indigo-600 font-semibold">Model</p>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 my-2">
                  <span className="bg-gradient-to-r from-indigo-600 to-fuchsia-500 bg-clip-text text-transparent">{model.name}</span>
                </h1>
                <div className="mt-4 flex flex-wrap gap-3 text-sm">
                  <InfoPill icon={ShoppingBag} text={`${variants.length} Variants`} />
                  <InfoPill icon={Layers} text={model.series?.name || 'Unknown Series'} />
                  <InfoPill icon={Hash} text={model.series?.brand?.name || 'Unknown Brand'} />
                  <InfoPill icon={Calendar} text={`Created: ${new Date(model.createdAt).toLocaleDateString()}`} />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* --- Product Variants Grid --- */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Available Products
          </h2>
          {loading ? <VariantGridSkeleton /> : variants.length === 0 ? (
            <div className="text-center text-gray-500 py-16 flex flex-col items-center">
              <ShoppingBag className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-xl font-semibold text-gray-700">No Variants Available</p>
              <p>Check back later for products based on this model.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {variants.map((variant, index) => (
                <motion.div
                  key={variant.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  {/* Assuming ProductCard can be linked or is a link itself */}
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
const InfoPill = ({ icon: Icon, text }: { icon: React.ElementType, text: string }) => (
  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/70 backdrop-blur text-gray-800 border border-gray-200 rounded-full">
    <Icon className="w-4 h-4 text-gray-500" />
    <span className="font-medium">{text}</span>
  </div>
);

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
      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-grow">{variant.name}</h3>
      <div className="mt-2 text-sm text-gray-600 flex items-center gap-2">
        <Tag className="w-4 h-4 text-gray-500" />
        <span>SKU: {variant.id}</span>
      </div>
       <div className="mt-4">
        <p className="text-xl font-bold text-indigo-600">{formatPrice(variant.price)}</p>
      </div>
    </div>
  </motion.div>
);