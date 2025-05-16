import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      const { cart } = req.body;
      console.log('Request body:', req.body);
      if (!Array.isArray(cart)) {
        console.error('Invalid cart data:', cart);
        return res.status(400).json({ error: 'Invalid cart data' });
      }

      // Clear the existing cart in the database
      await query('DELETE FROM cart');

      // Filter out invalid cart items
      const validCart = cart.filter(item => item && item.id && item.name && item.price !== undefined && item.quantity !== undefined);

      if (validCart.length !== cart.length) {
        console.error('Invalid cart items found:', cart.filter(item => !validCart.includes(item)));
      }

      // Insert the valid cart items into the database
      for (const item of validCart) {
        await query('INSERT INTO cart (id, name, price, quantity) VALUES (?, ?, ?, ?)', [
          item.id,
          item.name,
          item.price,
          item.quantity,
        ]);
      }

      res.status(200).json({ message: 'Cart synced successfully' });
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error syncing cart:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}