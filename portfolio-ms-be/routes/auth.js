import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

const router = express.Router();

// --- SIGNUP ---
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Hash the password (Security Best Practice)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 2. Insert user
    const newUser = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
      [email, hashedPassword]
    );

    res.status(201).json({ message: "User created!", user: newUser.rows[0] });

  } catch (err) {
    // 3. Handle Duplicate User Error (Postgres Error Code 23505)
    if (err.code === '23505') {
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    res.status(500).json({ error: 'Server error during signup' });
  }
});

// --- LOGIN ---
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find user
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid Credentials' });
    }

    // 2. Verify Password
    const isMatch = await bcrypt.compare(password, user.rows[0].password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid Credentials' });
    }

    // 3. Generate JWT (Scalability: Stateless Auth)
    const token = jwt.sign(
      { userId: user.rows[0].id }, 
      process.env.JWT_SECRET || 'fallback_secret', 
      { expiresIn: '1h' }
    );

    res.json({ token, user: { id: user.rows[0].id, email: user.rows[0].email } });

  } catch (err) {
    res.status(500).json({ error: 'Server error during login' });
  }
});

export default router;
