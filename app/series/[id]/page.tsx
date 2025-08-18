'use client';

import { useState, useEffect } from 'react';
import { fetchSingleSeries, fetchModelsBySeries } from '@/lib/api';
import { Series, Model } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface Props {
  params: { id: string };
}

export default function SeriesDetailPage({ params }: Props) {
  const [series, setSeries] = useState<Series | null>(null);
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSeriesData();
  }, [params.id]);

  const loadSeriesData = async () => {
    try {
      const [seriesData, modelsData] = await Promise.all([
        fetchSingleSeries(params.id),
        fetchModelsBySeries(params.id)
      ]);
      setSeries(seriesData);
      setModels(modelsData);
    } catch (err) {
      setError('Failed to load series details');
      toast.error('Failed to load series details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={loadSeriesData} />;
  if (!series) return <ErrorMessage message="Series not found" />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link 
            href="/series" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Series
          </Link>
          
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex flex-col md:flex-row items-start gap-8">
              {series.image && (
                <div className="w-full md:w-64 h-64 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={series.image}
                    alt={series.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{series.name}</h1>
                <div className="text-gray-600 space-y-2">
                  <p><strong>Series ID:</strong> {series.id}</p>
                  <p><strong>Brand:</strong> {series.brand?.name || 'Unknown'}</p>
                  <p><strong>Created:</strong> {new Date(series.createdAt).toLocaleDateString()}</p>
                  <p><strong>Models Count:</strong> {models.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Models in {series.name} ({models.length})
          </h2>
          
          {models.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <p>No models found for this series.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {models.map((model, index) => (
                <motion.div
                  key={model.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/models/${model.id}`}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        {model.image && (
                          <div className="w-full h-48 bg-gray-100 rounded-md mb-4 overflow-hidden">
                            <img
                              src={model.image}
                              alt={model.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <h3 className="text-lg font-semibold text-gray-900">{model.name}</h3>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
