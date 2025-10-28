import express from 'express';
import { authenticateToken, authorizeAdmin } from '../middleware/auth.js';
import pool from '../db.js';
import upload from '../config/mutler.js';
import slugify from 'slugify';

const router = express.Router();

// Getting all products (public)
router.get('/', async (req, res) => {
  try {
    const { categories } = req.query;
    let result;

    if (categories) {
      result = await pool.query(
        `SELECT * FROM products WHERE categories = $1`,
        [categories]
      );
    } else {
      result = await pool.query(`SELECT * FROM products`);
    }
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }

});

// Get products by categories
// router.get('/:categories', async (req, res) => {
//   try {
//     const { categories } = req.params;

//     const result = await pool.query(
//       'SELECT * FROM products WHERE categories = $1 ORDER BY id DESC',
//       [categories]
//     );
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });


// get productBySlug
router.get('/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    const result = await pool.query(`SELECT * FROM products WHERE slug = $1`, [
      slug,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Add product
router.post(
  '/',
  authenticateToken,
  authorizeAdmin,
  upload.single('image'),
  async (req, res) => {
    try {
      const { name, price, categories, description, instock } = req.body;

      if (!req.file) {
        return res.status(400).json({ err: 'image file is required' });
      }
      const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
      const slug = slugify(String(name), { lower: true, strict: true });

      const priceValue = Number(price);
      if (isNaN(priceValue)) {
        return res.status(400).json({ err: 'price most be a number' });
      }

      const finalDescription =
        description && description.trim() !== ''
          ? description
          : "We'll be adding a description for this product shortly. You can chat with us if you have any questions about this product.";

      console.log('REQ Body', req.body);
      console.log('REQ File', req.file);

      const newProduct = await pool.query(
        `INSERT INTO products (name, slug, image_url, price, categories, description, instock)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [
          name,
          slug,
          imageUrl,
          priceValue,
          categories || 'general',
          finalDescription,
          instock ?? true,
        ]
      );
      res.status(201).json(newProduct.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ err: err.message });
    }
  }
);

// Update product
router.patch(
  '/:id',
  authenticateToken,
  authorizeAdmin,
  upload.single('image'),
  async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ err: 'invalid product ID' });
    }

    const { name, price, categories, description, instock } = req.body;

    try {
      // Check if product exist
      const productCheck = await pool.query(
        `SELECT * FROM products WHERE id = $1`,
        [id]
      );
      if (productCheck.rows.length === 0) {
        return res.status(404).json({ error: 'product not found' });
      }

      // build image URL (keep old one if not uploaded)
      const imageUrl = req.file
        ? `http://localhost:5000/uploads/${req.file.filename}`
        : productCheck.rows[0].image_url;

      // / keep old slug or generate new one if name changes
      const slug =
        name && name.trim() !== ''
          ? slugify(String(name), { lower: true, strict: true })
          : productCheck.rows[0].slug;

      // handle price
      const priceValue =
        price && !isNaN(Number(price))
          ? Number(price)
          : productCheck.rows[0].price;

      //  handle description default
      const finalDescription =
        description && description.trim() !== ''
          ? description
          : productCheck.rows[0].description ||
            "We'll be adding a description for this product shortly. You can chat with us if you have any questions about this product.";

      console.log('REQ Body', req.body);
      console.log('REQ File', req.file);

      const updatedProduct = await pool.query(
        `UPDATE products
      SET name = $1,
      slug = $2,
      price = $3,
      image_url = $4,
      description = $5,
      categories = $6,
      instock = $7
      WHERE id = $8
      RETURNING *`,
        [
          name || productCheck.rows[0].name,
          slug,
          priceValue,
          imageUrl,
          finalDescription,
          categories || productCheck.rows[0].categories,
          instock,
          id,
        ]
      );

      res.json({
        product: updatedProduct.rows[0],
        message: 'product updated successfully',
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ err: 'Failed to update product' });
    }
  }
);

// Delete product
router.delete('/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ err: 'invalid product ID' });
  }

  try {
    const result = await pool.query(
      `DELETE FROM products WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ err: 'Product not found' });
    }

    res.json({
      product: result.rows[0],
      message: 'Product deleted successfully',
    });
  } catch (err) {
    console.error(err),
      res.status(500).json({ err: 'Failed to delete product' });
  }
});

export default router;
