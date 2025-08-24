'use client'
import React, { useMemo, useState } from 'react'
import SectionHeader from './SectionHeader';
import SkeletonRows from './SkeletonRows';
import BrandShelf from './BrandShelf';
import { Brand, Model, Product, ProductVariant, Series } from '@/types';


const BrandShelves = ({ brands, products, models, series, variants }: { brands: Brand[], products: Product[], models: Model[], series: Series[], variants: ProductVariant[] }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Build quick lookup maps for joins
    const productById = useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);
    const seriesByBrandId = useMemo(() => {
        const map = new Map<string, Series[]>();
        for (const s of series) {
            const arr = map.get(s.brandId) || [];
            arr.push(s);
            map.set(s.brandId, arr);
        }
        setLoading(false);
        return map;
    }, [series]);
    const modelsBySeriesId = useMemo(() => {
        const map = new Map<string, Model[]>();
        for (const m of models) {
            const arr = map.get(m.seriesId) || [];
            arr.push(m);
            map.set(m.seriesId, arr);
        }
        return map;
    }, [models]);

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
    )
}

export default BrandShelves
