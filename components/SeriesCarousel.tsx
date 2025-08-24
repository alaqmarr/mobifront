'use client'
import React, { useEffect, useRef, useState } from 'react'
import SectionHeader from './SectionHeader'
import { Series } from '@/types'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

const SeriesCarousel = ({ items } : { items: Series[] }) => {
  return (
    <section className="max-w-7xl mx-auto px-6 mt-8 md:mt-12">
        <SectionHeader title="Shop by Series" subtitle="Popular lineups across brands" />
        <Carousel items={items} />
      </section>
  )
}




export default SeriesCarousel
function Carousel({ items }: { items: Series[] }) {
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
