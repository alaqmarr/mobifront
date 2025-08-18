'use client';

import { useState, useEffect } from 'react';
import { fetchSeries } from '@/lib/api';
import { Series } from '@/types';
import SeriesCard from '@/components/SeriesCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import SearchBar from '@/components/SearchBar';
import toast from 'react-hot-toast';

export default function SeriesPage() {
  const [series, setSeries] = useState<Series[]>([]);
  const [filteredSeries, setFilteredSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSeries();
  }, []);

  const loadSeries = async () => {
    try {
      const data = await fetchSeries();
      setSeries(data);
      setFilteredSeries(data);
    } catch (err) {
      setError('Failed to load series');
      toast.error('Failed to load series');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredSeries(series);
      return;
    }

    const filtered = series.filter(seriesItem =>
      seriesItem.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredSeries(filtered);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={loadSeries} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">All Series</h1>
            <p className="text-gray-600">Browse our collection of {series.length} series</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <SearchBar onSearch={handleSearch} placeholder="Search series..." />
          </div>
        </div>

        {filteredSeries.length === 0 ? (
          <div className="text-center text-gray-500 mt-12">
            <p>No series found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSeries.map((seriesItem, index) => (
              <SeriesCard key={seriesItem.id} series={seriesItem} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}