import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Product Display',
  description: 'Modern product catalog with brands, series, and models',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-8">
                <h1 className="text-xl font-bold text-gray-900">
                  <a href="/">Product Catalog</a>
                </h1>
                <div className="hidden md:flex space-x-6">
                  <a href="/brands" className="text-gray-600 hover:text-gray-900">
                    Brands
                  </a>
                  <a href="/series" className="text-gray-600 hover:text-gray-900">
                    Series
                  </a>
                </div>
              </div>
            </div>
          </div>
        </nav>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}