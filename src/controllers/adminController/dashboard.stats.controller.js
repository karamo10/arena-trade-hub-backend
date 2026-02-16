import pool from '../../config/database.js';

const getAdminDashboardStats = async (req, res) => {
  try {
    const totalUsers = await pool.query(
      'SELECT COUNT(*) AS total_users FROM users',
    );
    const totalAdmins = await pool.query(
      "SELECT COUNT(*) AS total_admins FROM users WHERE role = 'admin'",
    );

    const totalProducts = await pool.query(
      'SELECT COUNT(*) AS total_products FROM products',
    );

    res.json({
      data: {
        totalUsers: Number(totalUsers.rows[0].total_users),
        totalAdmins: Number(totalAdmins.rows[0].total_admins),
        totalProducts: Number(totalProducts.rows[0].total_products),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export default getAdminDashboardStats;