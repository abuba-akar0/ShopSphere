import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '@/lib/db'; // Use the correct export from db.ts
import type { ResultSetHeader } from 'mysql2';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      console.log('Fetching all products from the database');
      const [products] = await query(`
        SELECT p.id, p.name, p.description, p.price, p.stock, c.name AS category
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
      `);
      console.log('Query results:', products);
      console.log('Fetched products:', products);
      res.status(200).json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
    return;
  }

  if (req.method === 'POST') {
    try {
      const { name, description, price, stock, category_id } = req.body;
      if (!name || price == null || stock == null) {
        return res.status(400).json({ error: 'Name, price, and stock are required.' });
      }
      // Use 'any' to avoid type errors for insert result
      const [result]: any = await query(
        'INSERT INTO products (name, description, price, stock, category_id) VALUES (?, ?, ?, ?, ?)',
        [name, description, price, stock, category_id]
      );
      const insertedId = result.insertId;
      const [rows] = await query('SELECT * FROM products WHERE id = ?', [insertedId]);
      res.status(201).json(rows[0]);
    } catch (error) {
      console.error('Error adding product:', error);
      res.status(500).json({ error: 'Failed to add product' });
    }
    return;
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}