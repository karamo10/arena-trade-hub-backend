import express from 'express';
import cors from 'cors';
// import routes
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import profileRouter from './routes/profile.routes.js';
import productRouter from './routes/product.routes.js';

const app = express(); // create and express app

app.use(cors());
app.use(express.json());

// routes declaration
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/profile', profileRouter);
app.use('/api/products', productRouter);
// example route for auth: http://localhost:400/api/auth/register

app.get('/', (req, res) => {
  res.send('Hello from arena-trade-hub backend!');
});

export default app;
