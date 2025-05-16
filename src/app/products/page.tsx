'use client'; // Required for useState and useMemo

import React, { useState, useMemo, useEffect } from 'react';
import ProductList from '@/components/ProductList';
import { SearchBar } from '@/components/SearchBar';
import { useSearchParams } from 'next/navigation';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category?: string;
}

const ProductsPage = () => {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);

  // Get category from URL query
  const categoryParam = searchParams ? searchParams.get('category') : null;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
        throw new Error('Invalid response format');
      }
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = products;
    if (categoryParam) {
      filtered = filtered.filter(product =>
        product.category?.toLowerCase() === categoryParam.toLowerCase()
      );
    }
    if (!searchQuery) {
      return filtered;
    }
    return filtered.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, products, categoryParam]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="container mx-auto p-4 md:px-6 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-foreground">Our Products</h1>

      {/* Search Bar */}
      <section className="mb-8 max-w-xl mx-auto">
        <SearchBar onSearch={handleSearch} />
      </section>

      {/* Product Listing Section */}
      <section>
        {filteredProducts.length > 0 ? (
          <ProductList products={filteredProducts} />
        ) : (
          <p className="text-center text-muted-foreground mt-12">
            No products found matching your search "{searchQuery}".
          </p>
        )}
      </section>
    </div>
  );
};

export default ProductsPage;
