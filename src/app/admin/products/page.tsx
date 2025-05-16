// src/app/admin/products/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Edit, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Select } from '@/components/ui/select';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';

// TODO: Replace local product state with actual data fetching and mutations (e.g., Firestore)

// Define Product type based on your DB fields
interface Product {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  stock: number;
  category_id?: number | null;
  created_at?: string | Date | null;
}

const AdminProductsPage = () => {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]); // Start with empty array
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [addForm, setAddForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category_id: ''
  });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const handleAddFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setAddForm({ ...addForm, [e.target.name]: e.target.value });
  };

  const handleAddFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError(null);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: addForm.name,
          description: addForm.description,
          price: Number(addForm.price),
          stock: Number(addForm.stock),
          category_id: addForm.category_id ? Number(addForm.category_id) : null
        })
      });
      if (!res.ok) throw new Error('Failed to add product');
      const newProduct = await res.json();
      setProducts((prev) => [newProduct, ...prev]);
      setAddForm({ name: '', description: '', price: '', stock: '', category_id: '' });
      setShowAddDialog(false);
      toast({ title: 'Product Added', description: `Product "${newProduct.name}" added.` });
    } catch (error: any) {
      setAddError(error.message || 'Failed to add product');
    } finally {
      setAddLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/login');
    }
  }, [user, isAdmin, loading, router]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]); // Ensure products is always an array
      }
    };
    fetchProducts();
  }, []);

  const handleAddProduct = async () => {
    router.push('/admin/products/new');
  };

  const handleEditProduct = async (productId: number) => {
    router.push(`/admin/products/edit/${productId}`);
  };

  const handleDeleteProduct = async (productId: number) => {
    try {
      const res = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete product');
      setProducts((prevProducts) => prevProducts.filter((p) => p.id !== productId));
      toast({ title: 'Product Deleted', description: `Product with ID: ${productId} removed.` });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({ title: 'Error', description: 'Failed to delete product.' });
    }
  };

  if (loading || !isAdmin) {
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-10rem)] items-center justify-center">
        <p className="text-muted-foreground">Loading or checking authorization...</p>
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <Card className="border border-border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">Manage Products</CardTitle>
            <CardDescription>Add, edit, or remove store products.</CardDescription>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Product
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>Fill in the details to add a new product to your store.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddFormSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block mb-1 font-medium">Name</label>
                  <input
                    name="name"
                    value={addForm.name}
                    onChange={handleAddFormChange}
                    placeholder="Product Name"
                    className="input input-bordered w-full text-foreground bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Description</label>
                  <textarea
                    name="description"
                    value={addForm.description}
                    onChange={handleAddFormChange}
                    placeholder="Description"
                    className="input input-bordered w-full text-foreground bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block mb-1 font-medium">Price</label>
                    <input
                      name="price"
                      value={addForm.price}
                      onChange={handleAddFormChange}
                      placeholder="Price"
                      type="number"
                      min="0"
                      step="0.01"
                      className="input input-bordered w-full text-foreground bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block mb-1 font-medium">Stock</label>
                    <input
                      name="stock"
                      value={addForm.stock}
                      onChange={handleAddFormChange}
                      placeholder="Stock"
                      type="number"
                      min="0"
                      className="input input-bordered w-full text-foreground bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-1 font-medium">Category ID</label>
                  <input
                    name="category_id"
                    value={addForm.category_id}
                    onChange={handleAddFormChange}
                    placeholder="Category ID"
                    type="number"
                    min="1"
                    className="input input-bordered w-full text-foreground bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700"
                  />
                </div>
                {addError && <span className="text-destructive text-xs">{addError}</span>}
                <DialogFooter>
                  <Button type="submit" disabled={addLoading} className="bg-primary text-white">
                    {addLoading ? 'Adding...' : 'Add Product'}
                  </Button>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                  </DialogClose>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {Array.isArray(products) && products.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden sm:table-cell">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="hidden sm:table-cell">
                      {/* No image_url in schema, use placeholder */}
                      <img
                        src={'https://picsum.photos/64/64?random=' + product.id}
                        alt={product.name}
                        className="h-16 w-16 object-cover rounded-md"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>${Number(product.price).toFixed(2)}</TableCell>
                    <TableCell className="hidden md:table-cell max-w-xs truncate">
                       {product.description}
                    </TableCell>
                    <TableCell className="text-right">
                       <Button variant="ghost" size="icon" className="mr-2" onClick={() => handleEditProduct(product.id)}>
                         <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit {product.name}</span>
                       </Button>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete {product.name}</span>
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the product "{product.name}".
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteProduct(product.id)} className="bg-destructive hover:bg-destructive/90">
                                    Delete
                                </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No products found. Add your first product!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProductsPage;
