'use client';

import { useState, useEffect } from 'react';
import { fetchBrand, fetchSeriesByBrand } from '@/lib/api';
import { Brand, Series } from '@/types';
import SeriesCard from '@/components/SeriesCard';
import ErrorMessage from '@/components/ErrorMessage';
import { ArrowLeft, Layers, Calendar, PackageX } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';

// --- Skeleton Components ---
const HeaderSkeleton = () => (
    <div className="flex flex-col md:flex-row items-start gap-8 animate-pulse">
        <div className="w-full md:w-64 h-64 bg-gray-200/80 rounded-2xl flex-shrink-0"></div>
        <div className="flex-1 mt-4 md:mt-0">
            <div className="h-12 bg-gray-200/80 rounded-lg w-3/4 mb-6"></div>
            <div className="flex flex-wrap gap-3">
                <div className="h-8 bg-gray-200/80 rounded-full w-36"></div>
                <div className="h-8 bg-gray-200/80 rounded-full w-44"></div>
            </div>
        </div>
    </div>
);

const SeriesGridSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-white/60 rounded-2xl p-4 animate-pulse">
                <div className="h-40 bg-gray-200/80 rounded-lg mb-4"></div>
                <div className="h-5 bg-gray-200/80 rounded w-5/6"></div>
            </div>
        ))}
    </div>
);

// --- Main Component ---
export default function BrandDetailPage() {
    const [brand, setBrand] = useState<Brand | null>(null);
    const [series, setSeries] = useState<Series[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const params = useParams();
    const brandId = params.id as string;

    useEffect(() => {
        if (brandId) {
            loadBrandData();
        }
    }, [brandId]);

    const loadBrandData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [brandData, seriesData] = await Promise.all([
                fetchBrand(brandId),
                fetchSeriesByBrand(brandId)
            ]);
            setBrand(brandData);
            setSeries(seriesData);
        } catch (err) {
            const msg = 'Failed to load brand details';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    if (error && !loading) return <ErrorMessage message={error} onRetry={loadBrandData} />;
    if (!brand && !loading) return <ErrorMessage message="Brand not found" />;

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
                        href="/brands"
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 bg-white/70 backdrop-blur border border-gray-200 rounded-full px-4 py-2 hover:bg-white hover:shadow-sm transition-all"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to All Brands
                    </Link>
                </div>

                {/* --- Animated Header --- */}
                <div className="mb-12 md:mb-16">
                    {loading ? <HeaderSkeleton /> : brand && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7 }}
                            className="flex flex-col md:flex-row items-start gap-8"
                        >
                            {brand.image && (
                                <div className="w-full md:w-64 h-64 bg-white/60 border border-gray-200 p-4 rounded-2xl flex-shrink-0">
                                    <Image
                                        src={brand.image}
                                        alt={brand.name}
                                        width={256}
                                        height={256}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            )}
                            <div className="flex-1">
                                <p className="text-indigo-600 font-semibold">Brand</p>
                                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 my-2">
                                    <span className="bg-gradient-to-r from-indigo-600 to-fuchsia-500 bg-clip-text text-transparent">{brand.name}</span>
                                </h1>
                                <div className="mt-4 flex flex-wrap gap-3 text-sm">
                                    <InfoPill icon={Layers} text={`${series.length} Series`} />
                                    <InfoPill icon={Calendar} text={`Established: ${new Date(brand.createdAt).toLocaleDateString()}`} />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* --- Series Grid --- */}
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                        Series by {brand?.name}
                    </h2>

                    {loading ? <SeriesGridSkeleton /> : series.length === 0 ? (
                        <div className="text-center text-gray-500 py-16 flex flex-col items-center">
                            <PackageX className="w-12 h-12 text-gray-400 mb-4" />
                            <p className="text-xl font-semibold text-gray-700">No Series Found</p>
                            <p>There are no product series listed for this brand yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {series.map((seriesItem, index) => (
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
            </motion.div>
        </div>
    );
}

// --- Helper Component ---
const InfoPill = ({ icon: Icon, text }: { icon: React.ElementType, text: string }) => (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/70 backdrop-blur text-gray-800 border border-gray-200 rounded-full">
        <Icon className="w-4 h-4 text-gray-500" />
        <span className="font-medium">{text}</span>
    </div>
);