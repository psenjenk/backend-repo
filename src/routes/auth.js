import express from 'express';
import db from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

// User registration
router.post('/register', async (req, res) => {
  const { phone_number, role, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      'INSERT INTO users (phone_number, role, password_hash) VALUES ($1, $2, $3) RETURNING id, phone_number, role',
      [phone_number, role, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
});

// User login
router.post('/login', async (req, res) => {
  const { phone_number, password } = req.body;

  try {
    const user = await db.query('SELECT * FROM users WHERE phone_number = $1', [phone_number]);
    if (!user.rows[0]) return res.status(404).json({ error: "User not found" });

    const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
    if (!validPassword) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign(
      { id: user.rows[0].id, role: user.rows[0].role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;