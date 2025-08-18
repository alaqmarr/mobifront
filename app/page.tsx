'use client';

import { useState, useEffect } from 'react';
import { searchProducts } from '@/lib/api';
import { Brand, Series, Model, Product, ProductVariant } from '@/types';
import SearchBar from '@/components/SearchBar';
import BrandCard from '@/components/BrandCard';
import SeriesCard from '@/components/SeriesCard';
import ProductCard from '@/components/ProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import toast from 'react-hot-toast';

interface SearchResults {
  brands: Brand[];
  series: Series[];
  models: Model[];
  products: Product[];
  variants: ProductVariant[];
}

export default function HomePage() {
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults(null);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const results = await searchProducts(query);
      setSearchResults(results);
      setHasSearched(true);
      
      const totalResults = results.brands.length + results.series.length + 
                          results.models.length + results.products.length + 
                          results.variants.length;
      
      toast.success(`Found ${totalResults} results`);
    } catch (err) {
      setError('Failed to search products');
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Product Catalog
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Search through our comprehensive product database
          </p>
          <SearchBar onSearch={handleSearch} />
        </div>

        {loading && <LoadingSpinner />}

        {error && (
          <ErrorMessage
            message={error}
            onRetry={() => handleSearch('')}
          />
        )}

        {!loading && !error && !hasSearched && (
          <div className="text-center text-gray-500 mt-12">
            <p>Enter a search term to find brands, series, models, and products</p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <a href="/brands" className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold mb-2">Browse Brands</h3>
                <p className="text-gray-600">Explore all available brands</p>
              </a>
              <a href="/series" className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold mb-2">Browse Series</h3>
                <p className="text-gray-600">View product series</p>
              </a>
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-2">Search Products</h3>
                <p className="text-gray-600">Find specific products and variants</p>
              </div>
            </div>
          </div>
        )}

        {searchResults && !loading && (
          <div className="space-y-8">
            {searchResults.brands.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Brands</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {searchResults.brands.map((brand, index) => (
                    <BrandCard key={brand.id} brand={brand} index={index} />
                  ))}
                </div>
              </section>
            )}

            {searchResults.series.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Series</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {searchResults.series.map((series, index) => (
                    <SeriesCard key={series.id} series={series} index={index} />
                  ))}
                </div>
              </section>
            )}

            {searchResults.variants.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Products</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {searchResults.variants.map((variant, index) => (
                    <ProductCard key={variant.id} variant={variant} index={index} />
                  ))}
                </div>
              </section>
            )}

            {Object.values(searchResults).every(arr => arr.length === 0) && (
              <div className="text-center text-gray-500 mt-12">
                <p>No results found. Try a different search term.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}