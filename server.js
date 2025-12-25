import express from 'express';
import cors from 'cors';
import pool from './db.js';
import productRoute from './routes/products.js';
import authRoute from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import usersRoutes from './routes/users.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.send("Hello from karamo's backend again");
});

app.use('/auth', authRoute);
app.use('/profile', profileRoutes); // profile GET & PATCH
app.use('/users', usersRoutes); // users GET & PATCH (admin only)
app.use('/products', productRoute);

app.get('/products', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM products ORDER BY id DESC'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on port http://localhost:${PORT}`);
});
