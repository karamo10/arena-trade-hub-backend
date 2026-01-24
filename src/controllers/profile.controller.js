import pool from '../config/database.js';
import cloudinary from '../utils/cloudinary.js';

// enpoint to get all the user data
const getFullProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      'SELECT id, first_name, last_name, email,  address, whatsapp_number, image FROM users WHERE id = $1',
      [userId],
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
};

// enpoint to get only user first_name, image, email
const getBasicProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT first_name, image, email FROM users WHERE id = $1`,
      [userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'user not found',
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
};

// enpoint to get only user first_name, last_name, email
const getReadOnlyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT id, first_name, last_name, email FROM users WHERE id = $1`,
      [userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const { address, whatsapp_number } = req.body;

    let image = null;
    if (req.file) {
      const result = await Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
          {
            folder: 'arena_users_profile',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
      image = result.secure_url;
    }

    const result = await pool.query(
      `UPDATE users
            SET address = $1, whatsapp_number = $2, image = $3
            WHERE id = $4
            RETURNING id, name, email, role, address, whatsapp_number, image`,
      [address || null, whatsapp_number || null, image || null, userId],
    );

    res.json({ message: 'Profile updated!' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export { getFullProfile, getBasicProfile, getReadOnlyProfile, updateProfile };

// 4 functions:
// getProfile: Get full profile info for authenticated user
// getBasicProfile: Get basic profile info for any user by ID
// getReadOnlyProfile: Get limited profile info for authenticated user (Form)
// updateProfile: Update profile info and image for authenticated user
