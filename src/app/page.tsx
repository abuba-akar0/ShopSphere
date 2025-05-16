'use client'; // Required for useState

import ProductList from '@/components/ProductList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SearchBar } from '@/components/SearchBar';
import { Toaster } from '@/components/ui/toaster';
import React, { useState, useMemo, useEffect } from 'react';
import { categories } from '@/lib/categories'; // Import categories from the new file
import Link from 'next/link'; // Import Link
import type { Product } from '@/lib/types';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!searchQuery) {
      return products.slice(0, 4);
    }
    return products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (typeof product.description === 'string' && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery, products]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <>
      <div className="container mx-auto px-4 md:px-6 py-8">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="relative bg-secondary rounded-lg overflow-hidden shadow-lg">
            <img
              // Using a more relevant placeholder image
              src="https://picsum.photos/1200/400?random=hero"
              alt="Hero Banner - ShopSphere Promotion"
              className="w-full h-64 md:h-80 object-cover" // Removed opacity for clarity
            />
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/60 to-transparent p-6">
              <div className="text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                  Welcome to ShopSphere
                </h2>
                <p className="text-lg text-gray-100 mb-6 drop-shadow-md max-w-xl mx-auto">
                  Discover amazing products, unbeatable deals, and seamless shopping.
                </p>
                <Link href="/products" passHref>
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-base font-semibold rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                    Shop Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Search Bar */}
        <section className="mb-12 max-w-2xl mx-auto">
           <SearchBar onSearch={handleSearch} />
        </section>


        {/* Featured Categories */}
        <section className="mb-16">
          <h3 className="text-3xl font-semibold mb-8 text-center text-foreground">Featured Categories</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {categories.slice(0, 6).map(category => ( // Display first 6 categories
              <Link key={category.id} href={`/products?category=${category.id}`} passHref>
                 <div className="bg-card p-6 rounded-lg shadow-md border border-border text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col items-center aspect-square justify-center">
                    <span className="text-5xl mb-3 inline-block">{category.icon}</span>
                    <h4 className="text-lg font-medium text-foreground">{category.name}</h4>
                    {/* Optional: Add description back if needed
                     <p className="text-muted-foreground text-sm mt-1">{category.description}</p>
                    */}
                 </div>
              </Link>
            ))}
          </div>
           <div className="text-center mt-8">
              <Link href="/categories" passHref>
                <Button variant="outline">View All Categories</Button>
              </Link>
            </div>
        </section>


        {/* Product Listing Section */}
         <section className="mb-16">
          <h3 className="text-3xl font-semibold mb-8 text-foreground">
            {searchQuery ? 'Search Results' : 'Featured Products'}
          </h3>
          {filteredProducts.length > 0 ? (
             <ProductList products={filteredProducts} />
           ) : (
            <p className="text-center text-muted-foreground col-span-full py-12">
                {searchQuery ? `No products found matching "${searchQuery}".` : 'Loading featured products...'}
             </p>
           )}
           {!searchQuery && products.length > 4 && ( // Show "View All" only if not searching and more products exist
             <div className="text-center mt-8">
               <Link href="/products" passHref>
                 <Button variant="secondary">View All Products</Button>
               </Link>
             </div>
           )}
        </section>


        {/* Email Signup Form */}
        <section className="bg-gradient-to-r from-primary/80 to-primary py-12 px-6 rounded-lg shadow-lg border border-border/10 text-center">
          <h3 className="text-2xl font-semibold mb-4 text-primary-foreground">Stay Updated!</h3>
          <p className="text-primary-foreground/90 mb-6 max-w-lg mx-auto">
            Subscribe to our newsletter for exclusive deals, new arrivals, and updates delivered straight to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email address"
              className="flex-grow p-3 border-white/50 bg-white/20 text-white placeholder-white/70 focus:ring-white focus:border-white rounded-md focus:bg-white/30"
              aria-label="Email for newsletter"
              required
            />
            <Button type="submit" className="rounded-md bg-background text-primary hover:bg-background/90 shadow-md px-6 py-3 shrink-0">
               Subscribe
             </Button>
          </form>
        </section>

      </div>
      <Toaster />
    </>
  );
}
