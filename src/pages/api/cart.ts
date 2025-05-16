import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const results = await query('SELECT * FROM cart');

      // Validate cart items before sending response
      const validCartItems = results.filter(item =>
        item && item.id && item.name && item.price !== undefined && item.quantity !== undefined
      );

      if (validCartItems.length !== results.length) {
        console.error('Invalid cart items detected in database:', results.filter(item => !validCartItems.includes(item)));
      }

      res.status(200).json(validCartItems);
    } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}