'use client'
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'


export default function RowCarousel({ children }: { children: React.ReactNode }) {
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

