import pool from '../config/database.js';
import generateUniqueSlug from '../utils/generateSlug.js';
import cloudinary from '../utils/cloudinary.js';
import streamifier from 'streamifier';

const getProducts = async (req, res) => {
  try {
    const { categories, q } = req.query;
    let result;

    if (q) {
      result = await pool.query(`SELECT * FROM products WHERE slug ILIKE $1`, [
        `%${q}%`,
      ]);
    } else if (categories) {
      result = await pool.query(
        `SELECT * FROM products WHERE categories = $1`,
        [categories]
      );
    } else {
      result = await pool.query(`SELECT * FROM products`);
    }
    return res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid product Id' });
    }

    const result = await pool.query(`SELECT * FROM products WHERE id = $1`, [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: err.message });
  }
};

const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await pool.query(`SELECT * FROM products WHERE slug = $1`, [
      slug,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};


const addProduct = async (req, res) => {
  try {
    const { name, price, categories, description, instock } = req.body;

    let image_url = null;
    if (req.file) {
      // Upload to Cloudinary using stream
      const result = await new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
          { folder: 'products' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

      image_url = result.secure_url;
    }

    if (!name) {
      return res.status(400).json({ message: 'product name is required' });
    }

    const slug = await generateUniqueSlug(name);

    const priceValue = Number(price);
    if (isNaN(priceValue)) {
      return res.status(400).json({ message: 'price most be a number' });
    }

    const defaultDescription =
      description?.trim() ||
      "We'll be adding a description for this product shortly. You can chat with us if you have any questions about this product.";

    console.log('REQ Body', req.body);
    console.log('REQ File', req.file);

    const newProduct = await pool.query(
      `INSERT INTO products (name, slug, image_url, price, categories, description, instock)
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        name,
        slug,
        image_url,
        priceValue,
        categories || 'general',
        defaultDescription,
        instock ?? true,
      ]
    );
    res.status(201).json({ message: 'New product added!' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const { name, price, categories, description, instock } = req.body;

    // Check if product exist
    const productCheck = await pool.query(
      `SELECT * FROM products WHERE id = $1`,
      [id]
    );
    if (productCheck.rows.length === 0) {
      return res.status(404).json({ message: 'product not found' });
    }

    let image_url = productCheck.rows[0].image_url;
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'products' },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
      image_url = result.secure_url;
    }

    let slug = productCheck.rows[0].slug;
    if (name && name !== productCheck.rows[0].name) {
      slug = await generateUniqueSlug(name);
    }

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
        name ?? productCheck.rows[0].name,
        slug,
        price ?? productCheck.rows[0].price,
        image_url,
        description ?? productCheck.rows[0].description,
        categories ?? productCheck.rows[0].categories,
        instock ?? productCheck.rows[0].instock,
        id,
      ]
    );

    res.json({
      message: 'Product updated!',
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }
    const result = await pool.query(
      `DELETE FROM products WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'product not found' });
    }

    res.json({
      message: 'Product deleted!',
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
};

export {
  getProductById,
  getProducts,
  getProductBySlug,
  addProduct,
  updateProduct,
  deleteProduct,
};
