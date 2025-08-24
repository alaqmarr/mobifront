import React from 'react'

export default function SkeletonRows() {
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
