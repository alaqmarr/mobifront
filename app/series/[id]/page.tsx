'use client';

import { useState, useEffect } from 'react';
import { fetchSingleSeries, fetchModelsBySeries } from '@/lib/api';
import { Series, Model } from '@/types';
import ErrorMessage from '@/components/ErrorMessage';
import { ArrowLeft, PackageX, Hash, Calendar, Layers, Search } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useParams } from 'next/navigation';

// --- Skeleton Components for a better UX ---
const HeaderSkeleton = () => (
    <div className="flex flex-col md:flex-row items-start gap-8 animate-pulse">
        <div className="w-full md:w-64 h-64 bg-gray-200/80 rounded-2xl flex-shrink-0"></div>
        <div className="flex-1 mt-4 md:mt-0">
            <div className="h-12 bg-gray-200/80 rounded-lg w-3/4 mb-6"></div>
            <div className="flex flex-wrap gap-3">
                <div className="h-8 bg-gray-200/80 rounded-full w-28"></div>
                <div className="h-8 bg-gray-200/80 rounded-full w-36"></div>
                <div className="h-8 bg-gray-200/80 rounded-full w-40"></div>
            </div>
        </div>
    </div>
);

const ModelGridSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-white/60 rounded-2xl p-4 animate-pulse">
                <div className="h-40 bg-gray-200/80 rounded-lg mb-4"></div>
                <div className="h-5 bg-gray-200/80 rounded w-5/6"></div>
            </div>
        ))}
    </div>
);

export default function SeriesDetailPage() {
    const [series, setSeries] = useState<Series | null>(null);
    const [models, setModels] = useState<Model[]>([]);
    const [filteredModels, setFilteredModels] = useState<Model[]>([]); // --- NEW: State for filtered models
    const [searchQuery, setSearchQuery] = useState(''); // --- NEW: State for the search input
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const params = useParams();
    const seriesId = params.id as string;

    useEffect(() => {
        if (seriesId) {
            loadSeriesData();
        }
    }, [seriesId]);

    // --- NEW: useEffect to trigger search when searchQuery changes ---
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredModels(models);
            return;
        }
        const filtered = models.filter(model =>
            model.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredModels(filtered);
    }, [searchQuery, models]);

    const loadSeriesData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [seriesData, modelsData] = await Promise.all([
                fetchSingleSeries(seriesId),
                fetchModelsBySeries(seriesId)
            ]);
            setSeries(seriesData);
            setModels(modelsData);
            setFilteredModels(modelsData); // --- MODIFIED: Initialize filtered list
        } catch (err) {
            const msg = 'Failed to load series details';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    if (error && !loading) return <ErrorMessage message={error} onRetry={loadSeriesData} />;
    if (!series && !loading) return <ErrorMessage message="Series not found" />;

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
                        href="/series"
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 bg-white/70 backdrop-blur border border-gray-200 rounded-full px-4 py-2 hover:bg-white hover:shadow-sm transition-all"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to All Series
                    </Link>
                </div>

                {/* --- Animated Header --- */}
                <div className="mb-12 md:mb-16">
                    {loading ? <HeaderSkeleton /> : series && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7 }}
                            className="flex flex-col md:flex-row items-start gap-8"
                        >
                            {series.image && (
                                <div className="w-full md:w-64 h-64 bg-white/60 border border-gray-200 p-4 rounded-2xl flex-shrink-0">
                                    <Image
                                        src={series.image}
                                        alt={series.name}
                                        width={256}
                                        height={256}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            )}
                            <div className="flex-1">
                                <p className="text-indigo-600 font-semibold">Series</p>
                                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 my-2">
                                    <span className="bg-gradient-to-r from-indigo-600 to-fuchsia-500 bg-clip-text text-transparent">{series.name}</span>
                                </h1>
                                <div className="mt-4 flex flex-wrap gap-3 text-sm">
                                    <InfoPill icon={Layers} text={`${models.length} Models`} />
                                    <InfoPill icon={Hash} text={series.brand?.name || 'Unknown Brand'} />
                                    <InfoPill icon={Calendar} text={`Created: ${new Date(series.createdAt).toLocaleDateString()}`} />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* --- Models Grid --- */}
                <div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <h2 className="text-3xl font-bold text-gray-900">
                            Models in this Series
                        </h2>
                        {/* --- NEW: Search Input --- */}
                        <div className="relative w-full sm:w-64">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </div>
                            <input
                                type="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-full rounded-full border-0 bg-white/70 py-2.5 pl-10 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                                placeholder="Search models..."
                            />
                        </div>
                    </div>

                    {loading ? <ModelGridSkeleton /> : filteredModels.length === 0 ? (
                        <div className="text-center text-gray-500 py-16 flex flex-col items-center">
                            <PackageX className="w-12 h-12 text-gray-400 mb-4" />
                            <p className="text-xl font-semibold text-gray-700">No Models Found</p>
                            {searchQuery ? (
                                <p>Your search for "{searchQuery}" did not match any models.</p>
                            ) : (
                                <p>There are no models listed for this series yet.</p>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredModels.map((model, index) => (
                                <motion.div
                                    key={model.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.05 }}
                                >
                                    <Link href={`/models/${model.id}`} className="block">
                                        <ModelCard model={model} />
                                    </Link>
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

const ModelCard = ({ model }: { model: Model }) => (
    <motion.div
        whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)" }}
        className="bg-white/70 backdrop-blur rounded-2xl border border-gray-200 overflow-hidden h-full transition-shadow"
    >
        <div className="h-48 bg-gray-50 p-4">
            {model.image ? (
                <Image
                    src={model.image}
                    alt={model.name}
                    width={200}
                    height={200}
                    className="w-full h-full object-contain"
                />
            ) : (
                <div className="w-full h-full grid place-content-center text-gray-400">No Image</div>
            )}
        </div>
        <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{model.name}</h3>
        </div>
    </motion.div>
);