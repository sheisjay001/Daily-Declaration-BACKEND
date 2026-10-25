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
    
    // Save to local database
    const result = await pool.query(
      'INSERT INTO subscribers (email) VALUES ($1) RETURNING *',
      [email]
    );
    
    // Forward to Serlo webhook (incoming webhook - we send data TO Serlo)
    const serloWebhookUrl = process.env.SERLO_WEBHOOK_URL;
    if (serloWebhookUrl) {
      try {
        await fetch(serloWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });
        console.log('Email forwarded to Serlo:', email);
      } catch (error) {
        console.error('Failed to forward to Serlo:', error);
        // Don't fail the request if Serlo forwarding fails
      }
    }
    
    res.status(201).json({ message: 'Successfully subscribed', subscriber: result.rows[0] });
  } catch (error: any) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Email already subscribed' });
    }
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

export default router;
