import express from 'express';
import cors from 'cors';
// import routes
import authRouter from './routes/authRoutes/auth.routes.js';
import userRouter from './routes/adminRoutes/users.routes.js';
import profileRouter from './routes/userRoutes/user.profile.routes.js';
import productRouter from './routes/publicRoutes/product.routes.js';
import dashboardStatsRouter from './routes/adminRoutes/dashboard.stats.routes.js';

const app = express(); // create and express app

app.use(cors());
app.use(express.json());

// routes declaration
app.use('/api/auth', authRouter);
app.use('/api/admin/users', userRouter);
app.use('/api/admin/dashboard/stats', dashboardStatsRouter);
app.use('/api/user/profile', profileRouter);
app.use('/api/products', productRouter);

// app.get('/', (req, res) => {
//   res.send('Hello from arena-trade-hub backend!');
// });

export default app;
