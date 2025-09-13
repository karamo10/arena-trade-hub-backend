import express from 'express';
import { authenticateToken, authorizeAdmin } from '../middleware/auth.js';
import pool from '../db.js';

const router = express.Router();

// Getting all products (public)
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM products ORDER BY id DESC'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ err: 'Failed to fetch products' });
  }
});

// Create product
router.post('/', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const {
      name,
      slug,
      image_url,
      price,
      categories = 'general',
      description,
      instock = true,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO products (name, slug, image_url, price, categories, description, instock)
            VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name, slug, image_url, price, categories, description, instock]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: err.message });
  }
});

// Update product
router.patch('/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, image_url, price, categories, description, instock } = req.body;

  try {
    const result = await pool.query(
      `UPDATE products 
             SET name = COALESCE($1, name),
                 image_url = COALESCE($2, image_url),
                 price = COALESCE($3, price),
                 categories = COALESCE($4, categories),
                 description = COALESCE($5, description),
                 instock = COALESCE($6, instock) WHERE id = $7 RETURNING *`,
      [name, image_url, price, categories, description, instock, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ err: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: 'Failed to update product' });
  }
});

// Delete product
router.delete('/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE * FROM products WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ err: 'Product not found' });
    }

    res.json({
      message: 'Product deleted successfully',
      product: result.rows[0],
    });
  } catch (err) {
    console.error(err),
      res.status(500).json({ err: 'Failed to delete product' });
  }
});

export default router;
