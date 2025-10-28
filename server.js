import express from 'express';
import cors from 'cors';
import pool from './db.js';
import productRoute from './routes/products.js';
import authRoute from './routes/auth.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'))

// import multer from 'multer';
// const upload = multer({ dest: 'uploads/' });

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads');
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${Date.now()}.${file.originalname}`);
//   },
// });
// const upload = multer({ storage: storage });

// app.post('/addimage', upload.single('file'), function (req, res, next) {
//   res.json(req.file);
// });
 
app.get('/', (req, res) => {
  res.send("Hello from karamo's backend again");
});

app.use('/products', productRoute);
app.use('/auth', authRoute);

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
