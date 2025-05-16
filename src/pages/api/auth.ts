import { NextApiRequest, NextApiResponse } from 'next';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (!JWT_SECRET) {
      console.error('JWT_SECRET is not defined in the environment variables');
      return res.status(500).json({ error: 'Server misconfiguration: JWT_SECRET is missing.' });
    }
    if (req.method === 'POST') {
      const { email, password, name, phone, address, action } = req.body;

      if (!email || !password || !action) {
        return res.status(400).json({ error: 'Email, password, and action are required' });
      }

      if (action === 'login') {
        console.log('Login request received for email:', email);
        let result;
        try {
          // Fix: Use RowDataPacket[][] for mysql2 query result, and destructure properly
          const [rows] = await query('SELECT email, password FROM users WHERE email = ?', [email]);
          result = rows;
        } catch (dbError) {
          console.error('Database error during login:', dbError);
          return res.status(500).json({ error: 'Database error during login' });
        }
        console.log('Database query result:', result);
        if (!Array.isArray(result) || result.length === 0 || !result[0] || !result[0].password) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }
        const isPasswordValid = await bcryptjs.compare(password, result[0].password);
        if (!isPasswordValid) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({ email, token });
      }

      if (action === 'register') {
        if (!email || !password || !name || !phone || !address) {
          return res.status(400).json({ error: 'All fields are required' });
        }
        const hashedPassword = await bcryptjs.hash(password, 10);
        // Use is_admin instead of isAdmin
        const queryText = `INSERT INTO users (email, password, name, phone, address, is_admin, created_at) VALUES (?, ?, ?, ?, ?, 0, NOW())`;
        try {
          await query(queryText, [email, hashedPassword, name, phone, address]);
        } catch (error) {
          console.error('Error registering user:', error);
          return res.status(500).json({ error: 'Internal server error' });
        }
        const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });
        return res.status(201).json({ email, token });
      }
      return res.status(400).json({ error: 'Invalid action' });
    } else {
      res.setHeader('Allow', ['POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error in auth API:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}