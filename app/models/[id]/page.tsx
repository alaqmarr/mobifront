'use client';

import { useState, useEffect } from 'react';
import { fetchSingleModel, fetchProductVariantsByModel } from '@/lib/api';
import { Model, ProductVariant } from '@/types';
import ProductCard from '@/components/ProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useParams } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ModelDetailPage({ params }: Props) {
  const [model, setModel] = useState<Model | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
    const parameter = useParams();
    const rawModelId = parameter.id;
    const modelId = Array.isArray(rawModelId) ? rawModelId[0] : rawModelId;

  useEffect(() => {
    loadModelData();
  }, [modelId]);

  const loadModelData = async () => {
    try {
      const [modelData, variantsData] = await Promise.all([
        fetchSingleModel(modelId as string),
        fetchProductVariantsByModel(modelId as string)
      ]);
      setModel(modelData);
      setVariants(variantsData);
    } catch (err) {
      setError('Failed to load model details');
      toast.error('Failed to load model details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={loadModelData} />;
  if (!model) return <ErrorMessage message="Model not found" />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link 
            href={`/series/${model.seriesId}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Series
          </Link>
          
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex flex-col md:flex-row items-start gap-8">
              {model.image && (
                <div className="w-full md:w-64 h-64 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={model.image}
                    alt={model.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{model.name}</h1>
                <div className="text-gray-600 space-y-2">
                  <p><strong>Model ID:</strong> {model.id}</p>
                  <p><strong>Series:</strong> {model.series?.name || 'Unknown'}</p>
                  <p><strong>Brand:</strong> {model.series?.brand?.name || 'Unknown'}</p>
                  <p><strong>Created:</strong> {new Date(model.createdAt).toLocaleDateString()}</p>
                  <p><strong>Product Variants:</strong> {variants.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Product Variants for {model.name} ({variants.length})
          </h2>
          
          {variants.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <p>No product variants found for this model.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {variants.map((variant, index) => (
                <ProductCard key={variant.id} variant={variant} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
