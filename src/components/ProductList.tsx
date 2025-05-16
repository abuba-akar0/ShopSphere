'use client'; // Needed for onClick event handlers and useContext

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Product } from '@/lib/types'; // Use type import
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext'; // Import useCart hook
import { useToast } from '@/hooks/use-toast'; // Import useToast hook

interface ProductListProps {
  products: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (product: Product) => {
    addToCart({ ...product, id: String(product.id), quantity: 1 });
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <div key={product.id || index} className="bg-card rounded-lg shadow-md overflow-hidden border border-border transition-shadow duration-200 hover:shadow-lg flex flex-col">
          <Link href={`/products/${product.id}`} className="block group">
            <img
              src={'https://picsum.photos/400/300?random=' + product.id}
              alt={product.name}
              className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity duration-200"
            />
            <div className="p-4 flex-grow">
              <h3 className="text-lg font-semibold mb-1 text-foreground group-hover:text-primary transition-colors duration-200">
                {product.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
              <p className="text-lg font-bold text-primary">
                ${Number(product.price).toFixed(2)}
              </p>
            </div>
          </Link>
           <div className="p-4 pt-0 mt-auto"> {/* Ensure button is at the bottom */}
            <Button
              variant="outline"
              className="w-full border-primary text-primary hover:bg-primary/10"
              onClick={() => handleAddToCart(product)} // Add onClick handler
              aria-label={`Add ${product.name} to cart`}
            >
               <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
            </Button>
           </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
