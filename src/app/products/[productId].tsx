import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { categories } from '@/lib/categories';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category?: string;
}

const ProductDetailPage = () => {
  const params = useParams();
  const productId = params?.productId as string | undefined;
  const [product, setProduct] = useState<Product | null>(null);
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
      } catch (err) {
        setError('Error fetching product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return <div className="container mx-auto p-8 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-8 text-center text-destructive">{error}</div>;
  }

  if (!product) {
    return <div className="container mx-auto p-8 text-center text-muted-foreground">Product not found</div>;
  }

  // Find the category name from the category id (if present)
  const categoryName = product.category
    ? categories.find(cat => cat.id === product.category)?.name || 'Uncategorized'
    : 'Uncategorized';

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="bg-card rounded-lg shadow-lg overflow-hidden border border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-4 md:p-0">
            <img
              src={product.imageUrl || 'https://picsum.photos/600/600?random=' + product.id}
              alt={product.name}
              className="rounded-lg shadow-md w-full h-auto object-cover md:rounded-none md:rounded-l-lg"
            />
          </div>
          <div className="p-6 md:p-8 flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">{product.name}</h1>
            <p className="text-muted-foreground mb-2 text-base">Category: {categoryName}</p>
            <p className="text-muted-foreground mb-6 text-base">{product.description}</p>
            <p className="text-3xl font-semibold text-primary mb-8">
              ${product.price.toFixed(2)}
            </p>
            <Button size="lg" className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
               <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
