import React from 'react';

/**
 * A full-screen, animated loading component for the Mobilinix website.
 * This component displays a brand name and a spinning indicator while content is being fetched.
 * It's designed to be used in Next.js's `loading.jsx` file to show a fallback UI.
 */
const Loading = () => {
  return (
    // Main container for the full-screen loading overlay.
    // It uses a dark background and centers its content both vertically and horizontally.
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white">
      {/* Title/logo with bold font and a vibrant color. */}
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-4 text-emerald-400">
        Mobilinix
      </h1>

      {/* Loading message. */}
      <p className="text-xl md:text-2xl text-gray-300 mb-8">
        Crafting your perfect case...
      </p>

      {/* The animated spinning loader. */}
      {/* It's a rounded square with a transparent top border to create the spinning effect. */}
      <div className="w-16 h-16 md:w-20 md:h-20 border-4 border-emerald-400 border-b-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default Loading;
