import { Router } from 'express';
import pool from '../db/index.js';

const router = Router();

// Get all authors
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM authors ORDER BY name'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch authors' });
  }
});

// Get single author by id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM authors WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Author not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch author' });
  }
});

export default router;
