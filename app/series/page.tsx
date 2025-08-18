'use client';

import { useState, useEffect } from 'react';
import { fetchSeries } from '@/lib/api';
import { Series } from '@/types';
import SeriesCard from '@/components/SeriesCard';
import ErrorMessage from '@/components/ErrorMessage';
// import SearchBar from '@/components/SearchBar'; // No longer needed
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { SearchX, Search } from 'lucide-react'; // Added Search icon

// A new Skeleton component for a better loading experience
const SkeletonGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white/60 p-4 rounded-2xl animate-pulse">
                <div className="h-40 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
            </div>
        ))}
    </div>
);

export default function SeriesPage() {
    const [series, setSeries] = useState<Series[]>([]);
    const [filteredSeries, setFilteredSeries] = useState<Series[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState(''); // --- NEW: State for the search input

    useEffect(() => {
        loadSeries();
    }, []);

    // --- NEW: useEffect to trigger search when searchQuery changes ---
    useEffect(() => {
        const handleSearch = () => {
            if (!searchQuery.trim()) {
                setFilteredSeries(series);
                return;
            }
            const filtered = series.filter(seriesItem =>
                seriesItem.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredSeries(filtered);
        };

        handleSearch();
    }, [searchQuery, series]); // Rerun when query or the original series list changes

    const loadSeries = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchSeries();
            setSeries(data);
            setFilteredSeries(data);
        } catch (err) {
            const errorMessage = 'Failed to load series';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (error && !loading) return <ErrorMessage message={error} onRetry={loadSeries} />;

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_20%_10%,rgba(99,102,241,0.1),transparent_35%),radial-gradient(circle_at_80%_90%,rgba(236,72,153,0.08),transparent_40%)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* HERO SECTION */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-10"
                >
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
                        Find Your <span className="bg-gradient-to-r from-indigo-600 to-fuchsia-500 bg-clip-text text-transparent">Favorite Series</span>
                    </h1>
                    <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
                        Browse our entire collection of product series from leading brands.
                    </p>
                    {/* --- MODIFIED: Replaced SearchBar with a working input --- */}
                    <div className="mt-8 max-w-lg mx-auto">
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </div>
                            <input
                                type="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-full rounded-full border-0 bg-white/70 py-3 pl-12 pr-5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 backdrop-blur"
                                placeholder="Search by series name..."
                            />
                        </div>
                    </div>
                </motion.div>

                {loading ? (
                    <SkeletonGrid />
                ) : filteredSeries.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center text-gray-500 mt-16 flex flex-col items-center"
                    >
                        <SearchX className="w-12 h-12 text-gray-400 mb-4" />
                        <p className="text-xl font-semibold text-gray-700">No Series Found</p>
                        {searchQuery && (
                           <p>Your search for "{searchQuery}" did not match any of our series.</p>
                        )}
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredSeries.map((seriesItem, index) => (
                            <motion.div
                                key={seriesItem.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                            >
                                <SeriesCard index={index} series={seriesItem} />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}