"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link"; // --- NEW: Import Link for navigation
import { motion } from "framer-motion";
import {
  fetchBrands,
  fetchSeries,
  fetchModels,
  fetchProducts,
  fetchProductVariants,
} from "@/lib/api";
import type { Brand, Series, Model, Product, ProductVariant } from "@/types";
import { ChevronLeft, ChevronRight, Sparkles, Search, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";


export default function LandingPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);

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
    const load = async () => {
      try {
        const [b, s, m, p, v] = await Promise.all([
          fetchBrands(),
          fetchSeries(),
          fetchModels(),
          fetchProducts(),
          fetchProductVariants(),
        ]);
        setBrands(b);
        setSeries(s);
        setModels(m);
        setProducts(p);
        setVariants(v);
      } catch (e: any) {
        console.error(e);
        setError("Failed to load content");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

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


  // Build quick lookup maps for joins
  const productById = useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);
  const modelsBySeriesId = useMemo(() => {
    const map = new Map<string, Model[]>();
    for (const m of models) {
      const arr = map.get(m.seriesId) || [];
      arr.push(m);
      map.set(m.seriesId, arr);
    }
    return map;
  }, [models]);
  const seriesByBrandId = useMemo(() => {
    const map = new Map<string, Series[]>();
    for (const s of series) {
      const arr = map.get(s.brandId) || [];
      arr.push(s);
      map.set(s.brandId, arr);
    }
    return map;
  }, [series]);

  // For each brand, gather a handful of variants via its models → variants
  const variantsByBrand = useMemo(() => {
    const modelIdsByBrand = new Map<string, Set<string>>();

    for (const b of brands) {
      const sList = seriesByBrandId.get(b.id) || [];
      const modelIds = new Set<string>();
      for (const s of sList) {
        const ms = modelsBySeriesId.get(s.id) || [];
        ms.forEach((m) => modelIds.add(m.id));
      }
      modelIdsByBrand.set(b.id, modelIds);
    }

    const grouped = new Map<string, ProductVariant[]>();
    for (const v of variants) {
      for (const [brandId, modelIds] of modelIdsByBrand.entries()) {
        if (modelIds.has(v.modelId)) {
          const arr = grouped.get(brandId) || [];
          arr.push(v);
          grouped.set(brandId, arr);
        }
      }
    }
    return grouped;
  }, [brands, variants, seriesByBrandId, modelsBySeriesId]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_20%_10%,rgba(99,102,241,0.15),transparent_35%),radial-gradient(circle_at_80%_0,rgba(236,72,153,0.12),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(56,189,248,0.12),transparent_30%)]">
      {/* HERO */}
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

      {/* SERIES CAROUSEL */}
      <section className="max-w-7xl mx-auto px-6 mt-8 md:mt-12">
        <SectionHeader title="Shop by Series" subtitle="Popular lineups across brands" />
        <SeriesCarousel items={series.slice(0, 16)} />
      </section>

      {/* BRAND SHELVES */}
      <section className="max-w-7xl mx-auto px-6 mt-10 md:mt-16 pb-16">
        <SectionHeader title="Trending by Brand" subtitle="Handpicked variants from each brand" />

        {loading && <SkeletonRows />}
        {error && (
          <div className="mt-6 text-center text-red-600">{error}</div>
        )}

        {!loading && !error && brands.length === 0 && (
          <div className="mt-6 text-center text-gray-600">No brands found.</div>
        )}

        <div className="space-y-12">
          {brands.map((b) => {
            const list = (variantsByBrand.get(b.id) || [])
              .slice(0, 8);

            if (list.length === 0) return null;

            return (
              <BrandShelf
                key={b.id}
                brand={b}
                variants={list}
                productById={productById}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}


/* ----------------------------- UI Components ---------------------------- */

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-5 md:mb-6 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h2>
        {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
      </div>
      <Link href="#" className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900">
        View all
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

// --- MODIFIED: This component now renders clickable links ---
function ResultPill<T extends { id: string; name?: string }>({
  label,
  items,
  basePath, // New prop for the link URL
  nameKey = "name",
}: {
  label: string;
  items: T[];
  basePath: string; // New prop type
  nameKey?: keyof T | "name";
}) {
  if (!items?.length) return (
    <div className="bg-white/60 rounded-xl border border-gray-200 p-3">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="text-sm text-gray-400">No results</div>
    </div>
  );
  return (
    <div className="bg-white/60 rounded-xl border border-gray-200 p-3">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="flex flex-wrap gap-2">
        {items.slice(0, 6).map((it) => (
          // Replaced <span> with <Link>
          <Link
            key={it.id}
            href={`${basePath}/${it.id}`}
            className="px-2.5 py-1 rounded-lg bg-gray-900/5 text-gray-800 border border-gray-200 hover:bg-gray-900/10 transition-colors"
          >
            {(it as any)[nameKey] || (it as any).title || "Item"}
          </Link>
        ))}
      </div>
    </div>
  );
}


function SeriesCarousel({ items }: { items: Series[] }) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [isScrollable, setIsScrollable] = useState(false);

  const scrollBy = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.min(480, el.clientWidth * 0.8) * dir;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };
  
  useEffect(() => {
    const checkScrollable = () => {
      const el = scrollerRef.current;
      if (el) {
        setIsScrollable(el.scrollWidth > el.clientWidth);
      }
    };
    checkScrollable();
    window.addEventListener('resize', checkScrollable);
    
    return () => {
      window.removeEventListener('resize', checkScrollable);
    };
  }, [items]);

  if (!items?.length) {
    return <div className="text-sm text-gray-500">No series to show.</div>;
  }

  return (
    <div className="relative group">
      {isScrollable && (
        <button
          onClick={() => scrollBy(-1)}
          className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 rounded-full p-2 bg-white/80 shadow hover:bg-white hidden md:flex"
          aria-label="Previous"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}
      <div
        ref={scrollerRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pr-2"
      >
        {items.map((s, i) => (
          <motion.a
            href={`/series/${s.id}`}
            key={s.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.04 }}
            className="snap-start shrink-0 w-56 rounded-2xl border border-gray-200 bg-white overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative h-32 bg-gray-50">
              {s.image ? (
                <Image src={s.image} alt={s.name} fill className="object-contain p-4" />
              ) : (
                <div className="h-full w-full grid place-items-center text-gray-400">No image</div>
              )}
            </div>
            <div className="p-4">
              <div className="text-sm text-gray-500">Series</div>
              <div className="font-semibold text-gray-900 line-clamp-1">{s.name}</div>
            </div>
          </motion.a>
        ))}
      </div>
      {isScrollable && (
        <button
          onClick={() => scrollBy(1)}
          className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 rounded-full p-2 bg-white/80 shadow hover:bg-white hidden md:flex"
          aria-label="Next"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

function BrandShelf({
  brand,
  variants,
  productById,
}: {
  brand: Brand;
  variants: ProductVariant[];
  productById: Map<string, Product>;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white border border-gray-200 overflow-hidden grid place-items-center">
            {brand.image ? (
              <Image src={brand.image} alt={brand.name} width={40} height={40} className="object-contain" />
            ) : (
              <span className="text-sm text-gray-500">{brand.name[0]}</span>
            )}
          </div>
          <h3 className="text-xl font-bold text-gray-900">{brand.name}</h3>
        </div>
        <Link href={`/brands/${brand.id}`} className="text-sm text-gray-700 hover:text-gray-900 inline-flex items-center gap-1">
          View brand <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <RowCarousel>
        {variants.map((v) => (
          <VariantCard key={v.id} variant={v} product={productById.get(v.productId)} />
        ))}
      </RowCarousel>
    </div>
  );
}

function RowCarousel({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isScrollable, setIsScrollable] = useState(false);
  
  const scroll = (dir: -1 | 1) => {
    const el = ref.current;
    if (!el) return;
    const amount = Math.min(600, el.clientWidth * 0.9) * dir;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  useEffect(() => {
    const checkScrollable = () => {
      const el = ref.current;
      if (el) {
        setIsScrollable(el.scrollWidth > el.clientWidth);
      }
    };
    checkScrollable();
    window.addEventListener('resize', checkScrollable);
    return () => {
      window.removeEventListener('resize', checkScrollable);
    };
  }, [children]);


  return (
    <div className="relative">
      {isScrollable && (
        <button
          onClick={() => scroll(-1)}
          className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 rounded-full p-2 bg-white/90 border border-gray-200 shadow hover:bg-white hidden md:flex"
          aria-label="Previous"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}
      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
      >
        {children}
      </div>
      {isScrollable && (
        <button
          onClick={() => scroll(1)}
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 rounded-full p-2 bg-white/90 border border-gray-200 shadow hover:bg-white hidden md:flex"
          aria-label="Next"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

function VariantCard({ variant, product }: { variant: ProductVariant; product?: Product }) {
  const img = variant.image || product?.image || "";
  const price = (variant as any).price ?? product?.price ?? 0;
  return (
    <motion.a
      href={`/products/${product?.id ?? variant.productId}`}
      whileHover={{ y: -4 }}
      className="snap-start shrink-0 w-64 rounded-2xl border border-gray-200 bg-white overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="relative h-36 bg-gray-50">
        {img ? (
          <Image src={img} alt={product?.name || variant.name} fill className="object-contain p-4" />
        ) : (
          <div className="h-full w-full grid place-items-center text-gray-400">No image</div>
        )}
      </div>
      <div className="p-4">
        <div className="text-xs text-gray-500 line-clamp-1">{product?.name}</div>
        <div className="font-semibold text-gray-900 line-clamp-1">{variant.model.name}</div>
        <div className="mt-2 font-bold text-indigo-600">{formatPrice(price)}</div>
      </div>
    </motion.a>
  );
}

function SkeletonRows() {
  return (
    <div className="space-y-10 animate-pulse">
      {[...Array(2)].map((_, i) => (
        <div key={i}>
          <div className="h-6 w-52 bg-gray-200 rounded mb-4" />
          <div className="flex gap-4 overflow-hidden">
            {[...Array(4)].map((__, j) => (
              <div key={j} className="w-64 h-52 bg-gray-100 rounded-2xl border border-gray-200" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
