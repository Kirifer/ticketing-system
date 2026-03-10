import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import pool from '../configs/db.js'
import verifyAdmin from '../middleware/auth.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and Password are required" });
  }

  try {
    const result = await pool.query(
    'SELECT * FROM "Admin" WHERE username = $1;',
    [username]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid Username or Password" });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Username or Password" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', 
      maxAge: 60 * 60 * 1000
    });

    res.status(200).json({ message: "Login successful" });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
  });
  res.status(200).json({ message: 'Logged out successfully' });
});

router.get('/check-auth', verifyAdmin, (req, res) => {
  res.status(200).json({authenticated: true, admin: req.admin});
});

export default router;