'use client'; // Required for context and state hooks

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { query } from '@/lib/db';

// Define the structure of a cart item
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

// Define the shape of the CartContext
interface CartContextType {
  cart: CartItem[];
  addToCart: (product: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

// Create the CartContext
const CartContext = createContext<CartContextType | undefined>(undefined);

// Define the props for the CartProvider
interface CartProviderProps {
  children: ReactNode;
}

// Create the CartProvider component
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch('/api/cart');
        if (!res.ok) throw new Error('Failed to fetch cart');
        const data = await res.json();
        setCart(data);
      } catch (err) {
        console.error('Error fetching cart:', err);
      }
    };
    fetchCart();
  }, []);

  const addToCart = (product: CartItem) => {
    console.log('Add to cart is disabled temporarily.');
  };

  const removeFromCart = (productId: string) => {
    console.log('Remove from cart is disabled temporarily.');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    console.log('Update quantity is disabled temporarily.');
  };

  const clearCart = () => {
    console.log('Clear cart is disabled temporarily.');
  };

  const getCartTotal = (): number => {
    return 0; // Return 0 as cart total temporarily
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the CartContext
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export type { CartItem };
