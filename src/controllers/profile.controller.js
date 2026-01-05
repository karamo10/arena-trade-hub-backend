import pool from '../config/database.js';
import cloudinary from '../utils/cloudinary.js';

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      'SELECT id, name, email, address, whatsapp_number, image FROM users WHERE id=$1'
      ,
      [userId]
    );

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
          }
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
      [address || null, whatsapp_number || null, image || null, userId]
    );

    res.json({ message: 'Profile updated!' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export { getProfile, updateProfile };