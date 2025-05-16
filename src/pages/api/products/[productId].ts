import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { productId } = req.query;

  if (req.method === 'GET') {
    try {
      if (!productId || Array.isArray(productId)) {
        return res.status(400).json({ error: 'Invalid product ID' });
      }

      console.log('Fetching product with ID:', productId);

      const [results] = await query('SELECT * FROM products WHERE id = ?', [productId]);
      console.log('Query results:', results);
      const product = results[0] || null;

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.status(200).json(product);
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'DELETE') {
    try {
      if (!productId) {
        return res.status(400).json({ error: 'Product ID is required' });
      }
      await query('DELETE FROM products WHERE id = ?', [productId]);
      return res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Error deleting product:', error);
      return res.status(500).json({ error: 'Failed to delete product' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}