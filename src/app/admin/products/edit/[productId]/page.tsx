"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  stock: number;
  category_id?: number | null;
  created_at?: string | Date | null;
}

const EditProductPage = ({ params }: { params: Promise<{ productId: string }> }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category_id: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetching, setFetching] = useState(true);

  // Unwrap params using React.use()
  const { productId } = React.use(params);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${productId}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const product: Product = await res.json();
        setForm({
          name: product.name || "",
          description: product.description || "",
          price: product.price?.toString() || "",
          stock: product.stock?.toString() || "",
          category_id: product.category_id?.toString() || ""
        });
      } catch (err: any) {
        setError(err.message || "Failed to fetch product");
      } finally {
        setFetching(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: Number(form.price),
          stock: Number(form.stock),
          category_id: form.category_id ? Number(form.category_id) : null
        })
      });
      if (!res.ok) throw new Error("Failed to update product");
      toast({ title: "Product Updated", description: `Product "${form.name}" updated.` });
      router.push("/admin/products");
    } catch (err: any) {
      setError(err.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="container mx-auto px-4 md:px-6 py-12 text-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <Card className="max-w-lg mx-auto border border-border shadow-sm">
        <CardHeader>
          <CardTitle>Edit Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block mb-1 font-medium">Name</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="input input-bordered w-full text-foreground bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700" required />
            </div>
            <div>
              <label className="block mb-1 font-medium">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="input input-bordered w-full text-foreground bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700" />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block mb-1 font-medium">Price</label>
                <input name="price" value={form.price} onChange={handleChange} placeholder="Price" type="number" min="0" step="0.01" className="input input-bordered w-full text-foreground bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700" required />
              </div>
              <div className="flex-1">
                <label className="block mb-1 font-medium">Stock</label>
                <input name="stock" value={form.stock} onChange={handleChange} placeholder="Stock" type="number" min="0" className="input input-bordered w-full text-foreground bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700" required />
              </div>
            </div>
            <div>
              <label className="block mb-1 font-medium">Category ID</label>
              <input name="category_id" value={form.category_id} onChange={handleChange} placeholder="Category ID" type="number" min="1" className="input input-bordered w-full text-foreground bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700" />
            </div>
            {error && <span className="text-destructive text-xs">{error}</span>}
            <Button type="submit" disabled={loading} className="bg-primary text-white">
              {loading ? "Updating..." : "Update Product"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProductPage;
