'use client';

import { Series } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface SeriesCardProps {
  series: Series;
  index: number;
}

export default function SeriesCard({ series, index }: SeriesCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link href={`/series/${series.id}`}>
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            {series.image && (
              <div className="w-full h-48 bg-gray-100 rounded-md mb-4 overflow-hidden">
                <img
                  src={series.image}
                  alt={series.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <h3 className="text-lg font-semibold text-gray-900">{series.name}</h3>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}