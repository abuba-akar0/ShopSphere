'use client'; // Make this a Client Component

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import type { Product } from '@/lib/types';
import { categories } from '@/lib/categories';

const ProductDetailPage = () => {
  const params = useParams();
  const productId = params?.productId as string | undefined;
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [product, setProduct] = useState<(Product & { category?: string }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError('Invalid Product ID');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        const data = await response.json();
        setProduct(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const categoryIdMap: Record<number, string> = {
    1: 't-shirts',
    2: 'hoodies',
    3: 'caps',
    4: 'accessories',
    5: 'footwear',
    6: 'outerwear',
  };

  const categoryName = React.useMemo(() => {
    if (!product?.category_id) return 'Uncategorized';
    let mappedId: string;
    if (typeof product.category_id === 'number') {
      mappedId = categoryIdMap[product.category_id] || '';
    } else {
      mappedId = String(product.category_id);
    }
    const found = categories.find(cat => cat.id === mappedId);
    return found ? found.name : 'Uncategorized';
  }, [product]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({ ...product, id: String(product.id), quantity: 1 });
      toast({
        title: 'Added to cart',
        description: `${product.name} has been added to your cart.`,
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <div className="bg-card rounded-lg shadow-lg overflow-hidden border border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-4 md:p-0">
              <Skeleton className="rounded-lg shadow-md w-full h-96 md:rounded-none md:rounded-l-lg" />
            </div>
            <div className="p-6 md:p-8 flex flex-col justify-center">
              <Skeleton className="h-10 w-3/4 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6 mb-6" />
              <Skeleton className="h-10 w-24 mb-8" />
              <Skeleton className="h-12 w-full md:w-48" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="container mx-auto p-8 text-center text-destructive">{error}</div>;
  }

  if (!product) {
    return <div className="container mx-auto p-8 text-center text-muted-foreground">Product not found</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="bg-card rounded-lg shadow-lg overflow-hidden border border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-4 md:p-0 flex items-center justify-center">
            <img
              src={`https://picsum.photos/600/600?random=${product.id}`}
              alt={product.name}
              className="rounded-lg shadow-md max-w-full max-h-[500px] h-auto object-contain md:rounded-none md:rounded-l-lg"
            />
          </div>
          <div className="p-6 md:p-8 flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">{product.name}</h1>
            <p className="text-muted-foreground mb-6 text-base">{product.description}</p>
            <p className="text-3xl font-semibold text-primary mb-8">
              ${product.price ? Number(product.price).toFixed(2) : '0.00'}
            </p>
            <p className="text-base text-muted-foreground mb-4">Stock: {product.stock}</p>
            <p className="text-base text-muted-foreground mb-4">Category: {categoryName}</p>
            <Button
              size="lg"
              className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={handleAddToCart}
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
