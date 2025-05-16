import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const [rows] = await query('SELECT `key`, `value` FROM settings');
      const settings = Object.fromEntries(rows.map((row: any) => [row.key, row.value]));
      res.status(200).json(settings);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch settings' });
    }
    return;
  }
  if (req.method === 'PUT') {
    try {
      const updates = req.body; // { key1: value1, key2: value2, ... }
      for (const key in updates) {
        await query('REPLACE INTO settings (`key`, `value`) VALUES (?, ?)', [key, updates[key]]);
      }
      res.status(200).json({ message: 'Settings updated' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update settings' });
    }
    return;
  }
  res.setHeader('Allow', ['GET', 'PUT']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
