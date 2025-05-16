import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { query } from '@/lib/db';

interface Order {
  id: string;
  customerName: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

const OrderConfirmationPage = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams?.get('orderId'); // Add null check for searchParams
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (orderId) {
        try {
          const results = await query('SELECT * FROM orders WHERE id = ?', [orderId]);
          setOrder((results as Order[])[0] || null);
        } catch (error) {
          console.error('Error fetching order:', error);
        }
      }
    };

    fetchOrder();
  }, [orderId]);

  if (!order) {
    return <p className="text-center text-muted-foreground">Loading order details...</p>;
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-foreground">Order Confirmation</h1>
      <div className="space-y-4">
        <p>Thank you for your order, {order.customerName}!</p>
        <p>Order ID: {order.id}</p>
        <p>Total Amount: ${order.totalAmount.toFixed(2)}</p>
        <p>Status: {order.status}</p>
        <p>Order Date: {new Date(order.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;