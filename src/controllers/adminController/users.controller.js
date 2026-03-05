import pool from '../../config/database.js';

const getUsers = async (req, res) => {
  try {
    const { q } = req.query;

    let users;

    if (q) {
      users = await pool.query(
        `SELECT * FROM users WHERE first_name ILIKE $1`,
        [`%${q}%`],
      );
    } else {
      users = await pool.query(`SELECT id, first_name, email, role FROM users`);
    }
    return res.json(users.rows);
   
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    // console.log(req.params.id);
    const { role } = req.body;

    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const allowedRoles = ['user', 'admin'];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    if (req.user.id === userId) {
      return res
        .status(403)
        .json({ message: 'Sorry you cannot change your own role' });
    }

    const result = await pool.query(
      `UPDATE users
           SET role = $1
           WHERE id = $2
           RETURNING id, name, email, role`,
      [role, userId],
    );

    res.json({
      message: `User role updated to ${role}`,
      user: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// count users
const totalUsers = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT COUNT(*) AS total_users FROM users',
    );

    const totalUser = result.rows[0].total_users;

    res.json({ totalUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ messge: err.message });
  }
};

export { getUsers, updateUser };
