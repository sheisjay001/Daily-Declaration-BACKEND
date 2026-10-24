import { Router } from 'express';
import pool from '../db/index.js';

const router = Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM categories ORDER BY name'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get single category by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM categories WHERE slug = $1',
      [slug]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

export default router;
