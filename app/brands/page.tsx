'use client';

import { useState, useEffect } from 'react';
import { fetchBrands } from '@/lib/api';
import { Brand } from '@/types';
import BrandCard from '@/components/BrandCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import SearchBar from '@/components/SearchBar';
import toast from 'react-hot-toast';

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      const data = await fetchBrands();
      setBrands(data);
      setFilteredBrands(data);
    } catch (err) {
      setError('Failed to load brands');
      toast.error('Failed to load brands');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredBrands(brands);
      return;
    }

    const filtered = brands.filter(brand =>
      brand.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredBrands(filtered);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={loadBrands} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">All Brands</h1>
            <p className="text-gray-600">Browse our collection of {brands.length} brands</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <SearchBar onSearch={handleSearch} placeholder="Search brands..." />
          </div>
        </div>

        {filteredBrands.length === 0 ? (
          <div className="text-center text-gray-500 mt-12">
            <p>No brands found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBrands.map((brand, index) => (
              <BrandCard key={brand.id} brand={brand} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
