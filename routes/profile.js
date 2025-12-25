import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import pool from '../db.js';

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      'SELECT id, name, email, role, address, whatsapp_number FROM users WHERE id=$1',
      [userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

router.patch('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { address, whatsapp_number
 } = req.body;

    const result = await pool.query(
      `UPDATE users
       SET address=$1, city=$2
       WHERE id=$3
       RETURNING id, name, email, role, address, whatsapp_number
`,
      [address || null, whatsapp_number || null, userId]
    );
    res.json({ message: 'Profile updated', user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

export default router;