import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      const dummyProducts = [
        { id: '1', name: 'Product 1', price: 10.99, description: 'Description for Product 1', stock: 100 },
        { id: '2', name: 'Product 2', price: 20.99, description: 'Description for Product 2', stock: 50 },
        { id: '3', name: 'Product 3', price: 15.49, description: 'Description for Product 3', stock: 75 },
        { id: '4', name: 'Product 4', price: 5.99, description: 'Description for Product 4', stock: 200 },
        { id: '5', name: 'Product 5', price: 12.99, description: 'Description for Product 5', stock: 120 },
      ];

      for (const product of dummyProducts) {
        await query(
          'INSERT INTO products (id, name, price, description, stock) VALUES (?, ?, ?, ?, ?)',
          [product.id, product.name, product.price, product.description, product.stock]
        );
      }

      res.status(200).json({ message: 'Dummy products inserted successfully' });
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error inserting dummy products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}