"use client";
import { useCart } from '@/context/CartContext';
import type { CartItem } from '@/context/CartContext'; // Import CartItem type
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { query } from '@/lib/db';
import { Button } from '@/components/ui/button';

const CheckoutPage = () => {
  const { clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch('/api/cart');
        if (!res.ok) throw new Error('Failed to fetch cart');
        const data = await res.json();
        setCartItems(data);
      } catch (err) {
        console.error('Error fetching cart:', err);
      }
    };
    fetchCart();
  }, []);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      // Simulate payment processing
      const paymentSuccess = true; // Replace with actual payment logic

      if (paymentSuccess) {
        // Save order to database
        const orderId = await query(
          'INSERT INTO orders (customerName, totalAmount, status, createdAt) VALUES (?, ?, ?, ?)',
          ['John Doe', cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0), 'Pending', new Date().toISOString()]
        );

        // Clear the cart
        clearCart();

        // Redirect to order confirmation page
        router.push(`/cart/confirmation?orderId=${orderId}`);
      } else {
        alert('Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('An error occurred during checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-foreground">Checkout</h1>
      <div className="space-y-4">
        {cartItems.map((item) => (
          <div key={item.id} className="flex justify-between items-center border-b pb-4">
            <span>{item.name}</span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>${cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</span>
        </div>
        <Button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {loading ? 'Processing...' : 'Place Order'}
        </Button>
      </div>
    </div>
  );
};

export default CheckoutPage;