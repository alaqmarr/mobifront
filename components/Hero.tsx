import React, { useEffect, useState } from 'react'
import {motion} from 'framer-motion'
import { Search, Sparkles } from 'lucide-react'
import { Brand, Model, Product, ProductVariant, Series } from '@/types';
import ResultPill from './ui/ResultPill';

const Hero = ({brands, series, models, products, variants} : {
  brands: Brand[];
  series: Series[];
  models: Model[];
  products: Product[];
  variants: ProductVariant[];
}) => {
    
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState<string | null>(null);
    
      const [query, setQuery] = useState("");
      const [searchOpen, setSearchOpen] = useState(false);
      const [searching, setSearching] = useState(false);
      const [searchResults, setSearchResults] = useState<{
        brands: Brand[];
        series: Series[];
        models: Model[];
        products: Product[];
        variants: ProductVariant[];
      } | null>(null);

      useEffect(() => {
        const performLocalSearch = () => {
          if (!query.trim()) {
            setSearchOpen(false);
            setSearchResults(null);
            return;
          }
    
          setSearching(true);
    
          const lowerCaseQuery = query.trim().toLowerCase();
    
          const filteredBrands = brands.filter(b => b.name.toLowerCase().includes(lowerCaseQuery));
          const filteredSeries = series.filter(s => s.name.toLowerCase().includes(lowerCaseQuery));
          const filteredModels = models.filter(m => m.name.toLowerCase().includes(lowerCaseQuery));
          const filteredProducts = products.filter(p => p.name.toLowerCase().includes(lowerCaseQuery));
          const filteredVariants = variants.filter(v =>
            v.name.toLowerCase().includes(lowerCaseQuery) ||
            v.id.toLowerCase().includes(lowerCaseQuery)
          );
    
          setSearchResults({
            brands: filteredBrands,
            series: filteredSeries,
            models: filteredModels,
            products: filteredProducts,
            variants: filteredVariants,
          });
    
          setSearchOpen(true);
          setSearching(false);
        };
    
        performLocalSearch();
      }, [query, brands, series, models, products, variants]);
  return (
          <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 backdrop-blur text-gray-800 shadow-sm mb-4">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Discover phones, parts & more</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900">
              Find the <span className="bg-gradient-to-r from-indigo-600 to-fuchsia-500 bg-clip-text text-transparent">right model</span> fast
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Browse by series and explore popular variants from each brand.
            </p>

            <div className="mt-8 max-w-xl mx-auto">
              <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white/70 backdrop-blur p-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 transition-shadow">
                <Search className="w-5 h-5 text-gray-500 ml-2" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search brands, series, models, or SKUs..."
                  className="flex-1 bg-transparent outline-none py-2 text-gray-900"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Search results dropdown */}
        {searchOpen && (
          <div className="max-w-3xl mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur border border-gray-200 rounded-2xl p-4 shadow-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-gray-800">
                  {searching ? "Searching..." : "Quick results"}
                </h4>
                <button onClick={() => setSearchOpen(false)} className="text-sm text-gray-500 hover:text-gray-700">Close</button>
              </div>
              {searchResults && (
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {/* --- MODIFIED: Added basePath prop to make items clickable --- */}
                  <ResultPill label="Brands" items={searchResults.brands} basePath="/brands" />
                  <ResultPill label="Series" items={searchResults.series} basePath="/series" />
                  <ResultPill label="Models" items={searchResults.models} basePath="/models" />
                  <ResultPill label="Products" items={searchResults.products} nameKey="name" basePath="/products" />
                </div>
              )}
            </motion.div>
          </div>
        )}
      </section>
  )
}

export default Hero
