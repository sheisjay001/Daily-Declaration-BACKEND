import { Router } from 'express';
import pool from '../db/index.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Get all affirmations with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const { category, published, search, page = 1, limit = 10 } = req.query;
    
    let query = `
      SELECT a.*, c.name as category_name, c.slug as category_slug, 
             au.name as author_name, au.role as author_role
      FROM affirmations a
      LEFT JOIN categories c ON a.category_id = c.id
      LEFT JOIN authors au ON a.author_id = au.id
      WHERE 1=1
    `;
    
    const params: any[] = [];
    let paramIndex = 1;
    
    if (category) {
      query += ` AND c.slug = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }
    
    if (published === 'true') {
      query += ` AND a.is_published = true`;
    }
    
    if (search) {
      query += ` AND (a.title ILIKE $${paramIndex} OR a.excerpt ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }
    
    query += ` ORDER BY a.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, (Number(page) - 1) * Number(limit));
    
    const result = await pool.query(query, params);
    
    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM affirmations a LEFT JOIN categories c ON a.category_id = c.id WHERE 1=1';
    const countParams: any[] = [];
    let countIndex = 1;
    
    if (category) {
      countQuery += ` AND c.slug = $${countIndex}`;
      countParams.push(category);
      countIndex++;
    }
    
    if (published === 'true') {
      countQuery += ` AND a.is_published = true`;
    }
    
    if (search) {
      countQuery += ` AND (a.title ILIKE $${countIndex} OR a.excerpt ILIKE $${countIndex})`;
      countParams.push(`%${search}%`);
      countIndex++;
    }
    
    const countResult = await pool.query(countQuery, countParams);
    
    res.json({
      affirmations: result.rows,
      total: parseInt(countResult.rows[0].count),
      page: Number(page),
      limit: Number(limit),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch affirmations' });
  }
});

// Get single affirmation by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const result = await pool.query(
      `SELECT a.*, c.name as category_name, c.slug as category_slug,
              au.name as author_name, au.role as author_role
       FROM affirmations a
       LEFT JOIN categories c ON a.category_id = c.id
       LEFT JOIN authors au ON a.author_id = au.id
       WHERE a.slug = $1`,
      [slug]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Affirmation not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch affirmation' });
  }
});

// Create affirmation (CMS)
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { title, slug, excerpt, content, category_id, author_id, cover_image, is_published } = req.body;
    
    const result = await pool.query(
      `INSERT INTO affirmations (title, slug, excerpt, content, category_id, author_id, cover_image, is_published)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [title, slug, excerpt, content, category_id, author_id, cover_image, is_published]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Slug already exists' });
    }
    res.status(500).json({ error: 'Failed to create affirmation' });
  }
});

// Update affirmation (CMS)
router.put('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { title, slug, excerpt, content, category_id, author_id, cover_image, is_published } = req.body;
    
    const result = await pool.query(
      `UPDATE affirmations 
       SET title = $1, slug = $2, excerpt = $3, content = $4, 
           category_id = $5, author_id = $6, cover_image = $7, is_published = $8, updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
      [title, slug, excerpt, content, category_id, author_id, cover_image, is_published, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Affirmation not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error: any) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Slug already exists' });
    }
    res.status(500).json({ error: 'Failed to update affirmation' });
  }
});

// Delete affirmation (CMS)
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'DELETE FROM affirmations WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Affirmation not found' });
    }
    
    res.json({ message: 'Affirmation deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete affirmation' });
  }
});

export default router;
