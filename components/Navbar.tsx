// src/components/Navbar.tsx

'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Brand, Series } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Menu, X, Building, Layers } from 'lucide-react';

interface NavbarProps {
  brands: Brand[];
  series: Series[];
}

export default function Navbar({ brands, series }: NavbarProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };
  
  const closeMenus = () => {
    setOpenDropdown(null);
    setIsMobileMenuOpen(false);
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" onClick={closeMenus} className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-fuchsia-500 bg-clip-text text-transparent">
              MOBILINX
            </Link>
          </div>

          {/* --- DESKTOP MENU --- */}
          {/* "hidden" makes it invisible on mobile. "md:flex" makes it visible as a flex container on medium screens and up. */}
          <div className="hidden md:flex items-center space-x-8" ref={dropdownRef}>
            {/* Brands Dropdown */}
            <div className="relative">
              <button onClick={() => toggleDropdown('brands')} className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors">
                Brands <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'brands' ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openDropdown === 'brands' && <DropdownMenu items={brands} type="brands" closeMenu={closeMenus} />}
              </AnimatePresence>
            </div>
            
            {/* Series Dropdown */}
            <div className="relative">
              <button onClick={() => toggleDropdown('series')} className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors">
                Series <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'series' ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openDropdown === 'series' && <DropdownMenu items={series} type="series" closeMenu={closeMenus} />}
              </AnimatePresence>
            </div>
          </div>
          
          {/* --- MOBILE MENU BUTTON (Hamburger) --- */}
          {/* "md:hidden" makes this button disappear on medium screens and up, showing only on mobile. */}
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle mobile menu">
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* --- MOBILE MENU PANEL --- */}
      {/* This entire section is hidden on desktop with "md:hidden" */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <MobileDropdown title="Brands" items={brands} type="brands" closeMenu={closeMenus} />
              <MobileDropdown title="Series" items={series} type="series" closeMenu={closeMenus} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// --- Helper Components for Dropdowns ---

const DropdownMenu = ({ items, type, closeMenu }: { items: (Brand[] | Series[]), type: string, closeMenu: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="absolute mt-2 w-56 rounded-xl shadow-lg bg-white/80 backdrop-blur-lg ring-1 ring-black ring-opacity-5"
  >
    <div className="py-1 max-h-80 overflow-y-auto">
      {items.slice(0, 7).map(item => (
        <Link key={item.id} href={`/${type}/${item.id}`} onClick={closeMenu} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
          {type === 'brands' ? <Building className="w-4 h-4 text-gray-400" /> : <Layers className="w-4 h-4 text-gray-400" />}
          {item.name}
        </Link>
      ))}
       <div className="border-t border-gray-200 mt-1 pt-1">
         <Link href={`/${type}`} onClick={closeMenu} className="block px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-gray-100">
           View All {type.charAt(0).toUpperCase() + type.slice(1)}
         </Link>
      </div>
    </div>
  </motion.div>
);

const MobileDropdown = ({ title, items, type, closeMenu }: { title: string, items: (Brand[] | Series[]), type: string, closeMenu: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
        {title}
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden ml-4"
          >
            {items.slice(0, 5).map(item => (
              <Link key={item.id} href={`/${type}/${item.id}`} onClick={closeMenu} className="block pl-4 pr-2 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-md">
                {item.name}
              </Link>
            ))}
             <Link href={`/${type}`} onClick={closeMenu} className="block pl-4 pr-2 py-2 text-sm font-semibold text-indigo-600 hover:bg-gray-100 rounded-md">
                View All...
              </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}