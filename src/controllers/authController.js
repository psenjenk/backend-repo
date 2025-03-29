import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const register = async (req, res) => {
  try {
    const { phone_number, role, password } = req.body;

    // Validate role
    if (!['agent', 'client', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // Check if user already exists
    const existingUser = await User.findByPhone(phone_number);
    if (existingUser) {
      return res.status(409).json({ error: 'Phone number already registered' });
    }

    // Create new user
    const user = await User.create({ phone_number, role, password });

    res.status(201).json({
      id: user.id,
      phone_number: user.phone_number,
      role: user.role,
      kyc_status: user.kyc_status
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req, res) => {
  try {
    const { phone_number, password } = req.body;

    // Find user
    const user = await User.findByPhone(phone_number);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        role: user.role,
        phone_number: user.phone_number
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        phone_number: user.phone_number,
        role: user.role,
        balance: user.balance,
        kyc_status: user.kyc_status
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
}; 