'use client';

import { useState, useEffect } from 'react';
import { fetchBrand, fetchSeriesByBrand } from '@/lib/api';
import { Brand, Series } from '@/types';
import SeriesCard from '@/components/SeriesCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface Props {
  params: { id: string };
}

export default function BrandDetailPage({ params }: Props) {
  const [brand, setBrand] = useState<Brand | null>(null);
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBrandData();
  }, [params.id]);

  const loadBrandData = async () => {
    try {
      const [brandData, seriesData] = await Promise.all([
        fetchBrand(params.id),
        fetchSeriesByBrand(params.id)
      ]);
      setBrand(brandData);
      setSeries(seriesData);
    } catch (err) {
      setError('Failed to load brand details');
      toast.error('Failed to load brand details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={loadBrandData} />;
  if (!brand) return <ErrorMessage message="Brand not found" />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link 
            href="/brands" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Brands
          </Link>
          
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex flex-col md:flex-row items-start gap-8">
              {brand.image && (
                <div className="w-full md:w-64 h-64 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={brand.image}
                    alt={brand.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{brand.name}</h1>
                <div className="text-gray-600 space-y-2">
                  <p><strong>Brand ID:</strong> {brand.id}</p>
                  <p><strong>Created:</strong> {new Date(brand.createdAt).toLocaleDateString()}</p>
                  <p><strong>Series Count:</strong> {series.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Series in {brand.name} ({series.length})
          </h2>
          
          {series.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <p>No series found for this brand.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {series.map((seriesItem, index) => (
                <SeriesCard key={seriesItem.id} series={seriesItem} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
