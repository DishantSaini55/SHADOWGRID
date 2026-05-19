import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const admin = await Admin.findOne({ username: username.trim() });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log(`Admin login: ${admin.username}`);

    return res.json({ token });
  } catch (error) {
    console.error('Auth login error:', error);
    return res.status(500).json({ error: 'Failed to authenticate' });
  }
});

router.post('/setup', async (req, res) => {
  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const adminCount = await Admin.countDocuments();
    if (adminCount > 0) {
      return res.status(403).json({ error: 'Admin setup is already complete' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const admin = await Admin.create({
      username: username.trim(),
      password: hashedPassword
    });

    return res.status(201).json({ success: true, adminId: admin._id });
  } catch (error) {
    console.error('Auth setup error:', error);
    return res.status(500).json({ error: 'Failed to create admin account' });
  }
});

export default router;

// Seed first admin account:
// POST /api/auth/setup with { "username": "admin", "password": "yourPassword" }
