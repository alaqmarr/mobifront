import Link from 'next/link';
import React from 'react'
export default function ResultPill<T extends { id: string; name?: string }>({
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

