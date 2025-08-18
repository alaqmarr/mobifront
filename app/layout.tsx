// src/app/layout.tsx

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar'; // Import the new Navbar
import { fetchBrands, fetchSeries } from '@/lib/api'; // Import your API functions

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Product Display',
  description: 'Modern product catalog with brands, series, and models',
};

// Make the layout an async function to fetch data
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch data on the server
  const brands = await fetchBrands().catch(() => []);
  const series = await fetchSeries().catch(() => []);

  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        {/* Use the new Navbar and pass the fetched data as props */}
        <Navbar brands={brands} series={series} />
        <main>
          {children}
        </main>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}