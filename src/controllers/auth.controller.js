import pool from '../config/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const registerUser = async (req, res) => {
  try {
    // frontend send a POST req {"username": "Doe", "email": "doe@gmail.com", "password": "doe123"}
    // to the this API /api/users/register
    // req.body contains the register data from the frontend
    const { username, email, password } = req.body;
    // and extracts username, email and password

    console.log('Request body:', req.body);

    // basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required!' });
    }

    // check if user exists already
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists!' });
    }

    // hashed password before saving to db
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // register user
    const user = await pool.query(
      `INSERT INTO  users (name, email, password, role) 
       VALUES( $1, $2, $3, 'user' ) RETURNING *`, // setting role to user by default
      [username, email, hashedPassword]
    );

    res.status(201).json({
      message: 'User registered!',
      users: {
        id: user.rows[0].id,
        name: user.rows[0].name,
        email: user.rows[0].email,
        password: user.rows[0].password,
        role: user.rows[0].role,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Internal server error!' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Request body:', req.body);

    // check if user alredy exists
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);
    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials!' });
    }

    // compare password
    const comparePassword = await bcrypt.compare(
      password,
      user.rows[0].password
    );
    // bcrypt compare the plain text password from the User to user.rows[0].password from db
    if (!comparePassword) {
      return res.status(400).json({ message: 'Invalid credential!' });
    }
    // if Not Match, login fails and return 400 message invalid credentials
    // if Match proceed...

    // if user exists and verify by the server, then it creates a token
    const token = jwt.sign(
      { id: user.rows[0].id, role: user.rows[0].role }, // payload the data inside the Token(id, and user.role['user' || 'admin'])
      process.env.JWT_SECRET, // geting the jwt secret key from .env file, and use to sign the token
      { expiresIn: '1hr' } // token valid for one 1h, after that user must log in again
    );
    // the user with id Y and role Z is authenticated to have access to this particular route or perform this task!

    // server sends (token + user info without password) to client
    res.status(200).json({
      token,
      user: {
        id: user.rows[0].id,
        name: user.rows[0].name,
        email: user.rows[0].email,
        role: user.rows[0].role,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Internal server error!' });
  }
};

export { registerUser, loginUser };
