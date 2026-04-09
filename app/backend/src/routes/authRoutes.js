import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const router = express.Router();

// Static Admin Credentials for scaffolding (in production, verify against DB)
const ADMIN_USERNAME = process.env.ADMIN_USER || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASS || 'password123';

// ---- ADMIN LOGIN ----
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = jwt.sign(
      { username, role: 'admin' }, 
      process.env.JWT_SECRET || 'super_secret_for_dev_only_change_in_prod',
      { expiresIn: '12h' }
    );
    return res.status(200).json({ success: true, token });
  }
  
  res.status(401).json({ success: false, message: "Invalid credentials" });
});

// ---- CUSTOMER REGISTRATION ----
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, aadharVerified, aadharNumber, digilockerId } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, message: "Email already exists" });

    const newUser = new User({ 
      email, 
      password, 
      firstName, 
      lastName,
      aadharVerified: aadharVerified || false,
      aadharNumber,
      digilockerId
    });
    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, role: 'customer' },
      process.env.JWT_SECRET || 'super_secret_for_dev_only_change_in_prod',
      { expiresIn: '7d' }
    );

    res.status(201).json({ success: true, token, user: { firstName: newUser.firstName, email: newUser.email }});
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error during registration." });
  }
});

// ---- CUSTOMER LOGIN ----
router.post('/customer-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: "Invalid email or password" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid email or password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'super_secret_for_dev_only_change_in_prod',
      { expiresIn: '7d' }
    );

    res.status(200).json({ success: true, token, user: { firstName: user.firstName, email: user.email }});
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error during login." });
  }
});

export default router;
