import { Router } from 'express';
import pool from '../db/index.js';

const router = Router();

// Subscribe to email list
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    const result = await pool.query(
      'INSERT INTO subscribers (email) VALUES ($1) RETURNING *',
      [email]
    );
    
    res.status(201).json({ message: 'Successfully subscribed', subscriber: result.rows[0] });
  } catch (error: any) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Email already subscribed' });
    }
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

export default router;
