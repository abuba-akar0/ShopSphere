'use client'; // Needed for context and state management

import React from 'react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Minus, Plus, ShoppingCart } from 'lucide-react'; // Import icons
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    const quantity = Math.max(0, newQuantity); // Ensure quantity is not negative
    updateQuantity(productId, quantity);
  };

  const total = getCartTotal();

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-foreground text-center">Your Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center py-16">
           <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-xl text-muted-foreground mb-6">Your cart is currently empty.</p>
          <Link href="/products" passHref>
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Continue Shopping
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-6">
             {cart.map((item) => (
              <Card key={item.id} className="flex flex-col md:flex-row items-center p-4 gap-4 border border-border shadow-sm">
                <img
                  src={item.imageUrl || 'https://picsum.photos/100/100?random=' + item.id}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-md shrink-0"
                />
                <div className="flex-grow text-center md:text-left">
                  <Link href={`/products/${item.id}`} passHref>
                    <span className="font-semibold text-lg hover:text-primary transition-colors cursor-pointer">{item.name}</span>
                  </Link>
                  <p className="text-muted-foreground text-sm">{item.description.substring(0, 50)}...</p>
                  <p className="text-primary font-medium mt-1">${item.price.toFixed(2)}</p>
                </div>
                 <div className="flex items-center gap-2 mt-4 md:mt-0 shrink-0">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1} // Disable if quantity is 1
                        aria-label={`Decrease quantity of ${item.name}`}
                     >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      min="1" // Prevent direct input of 0 or less
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value, 10))}
                      className="h-8 w-14 text-center px-1" // Adjusted padding
                      aria-label={`Quantity of ${item.name}`}
                    />
                     <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        aria-label={`Increase quantity of ${item.name}`}
                     >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
                <div className="shrink-0 mt-4 md:mt-0 md:ml-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10 h-8 w-8"
                        onClick={() => removeFromCart(item.id)}
                        aria-label={`Remove ${item.name} from cart`}
                    >
                    <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
              </Card>
            ))}
             <div className="text-right mt-6">
                <Button variant="outline" onClick={clearCart} className="text-destructive border-destructive hover:bg-destructive/10">
                    <Trash2 className="mr-2 h-4 w-4" /> Clear Cart
                </Button>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1 sticky top-24"> {/* Make summary sticky */}
            <Card className="shadow-lg border border-border">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-center">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>Free</span> {/* Or calculate dynamically */}
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-xl text-foreground">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                 <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    Proceed to Checkout
                 </Button>
                 <Link href="/products" passHref className="w-full">
                     <Button variant="outline" className="w-full">
                        Continue Shopping
                     </Button>
                 </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
