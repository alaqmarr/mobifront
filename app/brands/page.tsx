'use client';

import { useState, useEffect } from 'react';
import { fetchBrands } from '@/lib/api';
import { Brand } from '@/types';
import BrandCard from '@/components/BrandCard';
import ErrorMessage from '@/components/ErrorMessage';
// import SearchBar from '@/components/SearchBar'; // No longer needed
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { SearchX, Search } from 'lucide-react'; // Added Search icon

// --- Skeleton Component for a better loading experience ---
const SkeletonGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white/60 p-4 rounded-2xl animate-pulse">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                    <div className="flex-1">
                        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    </div>
                </div>
            </div>
        ))}
    </div>
);


export default function BrandsPage() {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState(''); // --- NEW: State for the search input

    useEffect(() => {
        loadBrands();
    }, []);

    // --- NEW: useEffect to trigger search when searchQuery changes ---
    useEffect(() => {
        const handleSearch = () => {
            if (!searchQuery.trim()) {
                setFilteredBrands(brands);
                return;
            }
            const filtered = brands.filter(brand =>
                brand.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredBrands(filtered);
        };

        handleSearch();
    }, [searchQuery, brands]); // Rerun when query or the original brands list changes


    const loadBrands = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchBrands();
            setBrands(data);
            setFilteredBrands(data);
        } catch (err) {
            const msg = 'Failed to load brands';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    // The handleSearch function is now inside the useEffect hook.

    if (error && !loading) return <ErrorMessage message={error} onRetry={loadBrands} />;

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_20%_10%,rgba(99,102,241,0.1),transparent_35%),radial-gradient(circle_at_80%_90%,rgba(236,72,153,0.08),transparent_40%)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* --- HERO SECTION --- */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-10"
                >
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
                        Explore Our <span className="bg-gradient-to-r from-indigo-600 to-fuchsia-500 bg-clip-text text-transparent">Trusted Brands</span>
                    </h1>
                    <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
                        Discover all the top-tier brands we partner with.
                    </p>
                    {/* --- MODIFIED: Replaced SearchBar with a working input --- */}
                    <div className="mt-8 max-w-lg mx-auto">
                         <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                               <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </div>
                            <input
                                type="search"
                                name="search"
                                id="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-full rounded-full border-0 bg-white/70 py-3 pl-12 pr-5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 backdrop-blur"
                                placeholder="Search by brand name..."
                            />
                        </div>
                    </div>
                </motion.div>

                {/* --- CONDITIONAL CONTENT GRID --- */}
                {loading ? (
                    <SkeletonGrid />
                ) : filteredBrands.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center text-gray-500 mt-16 flex flex-col items-center"
                    >
                        <SearchX className="w-12 h-12 text-gray-400 mb-4" />
                        <p className="text-xl font-semibold text-gray-700">No Brands Found</p>
                        <p>Your search for "{searchQuery}" did not match any of our brands.</p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredBrands.map((brand, index) => (
                            <motion.div
                                key={brand.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                            >
                                <BrandCard index={index} brand={brand} />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}