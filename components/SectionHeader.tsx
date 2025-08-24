import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

export default function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
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

