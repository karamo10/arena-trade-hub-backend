import app from './app.js'
// import express from 'express';
// import cors from 'cors';
// routes import
// import authRouter from './routes/auth.routes.js';
// import productRouter from './routes/product.routes.js';
// import userRouter from './routes/user.routes.js';
// import profileRouter from './routes/profile.routes.js';

// import productRoute from './routes/products.js';
// import profileRoutes from './routes/profile.js';
// import usersRoutes from './routes/users.js';

// const app = express();

// app.use(cors());
// app.use(express.json());
// app.use('/uploads', express.static('uploads'));

// app.get('/', (req, res) => {
//   res.send("Hello from karamo's backend again");
// });

// // routes declration
// app.use('/api/auth', authRouter);
// app.use('/api/users', userRouter);
// app.use('/api/profile', profileRouter);
// app.use('/api/products', productRouter);

// app.use('/profile', profileRoutes); // profile GET & PATCH
// app.use('/users', usersRoutes); // users GET & PATCH (admin only)
// // app.use('/products', productRoute);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Backend running on port http://localhost:${PORT}`);
});
