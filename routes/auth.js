import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const userExists = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hashing Pass before entering it to the db
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Inserting the user
    const newUser = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, hashPassword, role || 'user']
    );
    res.status(201).json({ user: newUser.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);
    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
      
      // Check password
      const validPassword = await bcrypt.compare(password, user.rows[0].password)
      if (!validPassword) {
          return res.status(400).json({ err: "Invalid credentials" });
      }

      const token = jwt.sign(
          { id: user.rows[0].id, role: user.rows[0].role },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
      );

      res.json({token})
      

  } catch (err) {
      console.error(err)
      res.status(500).send("Server error");
  }
});

export default router;