import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { categories } from '@/lib/categories'; // Import categories
import { Button } from '@/components/ui/button';

const CategoriesPage = () => {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <h1 className="text-4xl font-bold text-center mb-12 text-foreground">Product Categories</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category) => (
          <Card key={category.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-border">
            <CardHeader className="p-6 bg-secondary">
                <div className="text-5xl mb-4 text-center">{category.icon}</div>
              <CardTitle className="text-2xl font-semibold text-center text-foreground">{category.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex-grow flex flex-col">
              <CardDescription className="text-muted-foreground text-center mb-6 flex-grow">
                {category.description}
              </CardDescription>
              <div className="mt-auto text-center">
                <Link href={`/products?category=${category.id}`} passHref>
                  <Button variant="outline" className="w-full sm:w-auto border-primary text-primary hover:bg-primary/10">
                    View {category.name}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <section className="mt-16 text-center bg-secondary p-8 rounded-lg border border-border">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Explore All Products</h2>
          <p className="text-muted-foreground mb-6">
            Can't decide? Browse our full collection of high-quality products.
          </p>
          <Link href="/products" passHref>
             <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Shop All Products
             </Button>
          </Link>
      </section>
    </div>
  );
};

export default CategoriesPage;
