"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  fetchBrands,
  fetchSeries,
  fetchModels,
  fetchProducts,
  fetchProductVariants,
} from "@/lib/api";
import type { Brand, Series, Model, Product, ProductVariant } from "@/types";
import Hero from "@/components/Hero";
import BrandShelf from "@/components/BrandShelf";
import SeriesCarousel from "@/components/SeriesCarousel";
import BrandShelves from "./BrandShelves";


export default function LandingPage({brands, series, models, products, variants} : {
    brands: Brand[],
    series: Series[],
    models: Model[],
    products: Product[],
    variants: ProductVariant[]
}) {



  const seriesByBrandId = useMemo(() => {
    const map = new Map<string, Series[]>();
    for (const s of series) {
      const arr = map.get(s.brandId) || [];
      arr.push(s);
      map.set(s.brandId, arr);
    }
    return map;
  }, [series]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_20%_10%,rgba(99,102,241,0.15),transparent_35%),radial-gradient(circle_at_80%_0,rgba(236,72,153,0.12),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(56,189,248,0.12),transparent_30%)]">
      {/* HERO */}
      <Hero
        brands={brands}
        series={series}
        models={models}
        products={products}
        variants={variants}
      />

      <SeriesCarousel items={series.slice(0, 16)} />

      {/* BRAND SHELVES */}
      <BrandShelves
        brands={brands}
        variants={variants}
        products={products}
        models={models}
        series={series}
      />
    </div>
  );
}

