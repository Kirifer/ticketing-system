import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../configs/db.js';
import verifyAdmin from '../middleware/auth.js';
import loginLimiter from '../middleware/loginLimiter.js';

const router = express.Router();

const LOCK_THRESHOLD = 5;
const LOCK_MINUTES = 5;
const OBSERVATION_MINUTES = 15;

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is required');
}

router.post('/login', loginLimiter, async (req, res) => {
  let { username, password } = req.body;

  if (typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ message: 'Username and Password are required' });
  }

  username = username.trim();
  password = password.trim();

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and Password are required' });
  }

  try {
    const result = await pool.query(
      `
      SELECT id, username, password, "failedAttempts", "firstFailedAt", "lockUntil"
      FROM "Admin"
      WHERE username = $1
      LIMIT 1
      `,
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid Credentials' });
    }

    const user = result.rows[0];

    // If account is still locked, stop here.
    if (user.lockUntil && new Date(user.lockUntil) > new Date()) {
      return res.status(403).json({
        message: 'Account is temporarily locked. Try again later.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      const updated = await pool.query(
        `
        UPDATE "Admin"
        SET
          "failedAttempts" = CASE
            WHEN "firstFailedAt" IS NULL
              OR "firstFailedAt" < CURRENT_TIMESTAMP - INTERVAL '${OBSERVATION_MINUTES} minutes'
              THEN 1
            ELSE COALESCE("failedAttempts", 0) + 1
          END,
          "firstFailedAt" = CASE
            WHEN "firstFailedAt" IS NULL
              OR "firstFailedAt" < CURRENT_TIMESTAMP - INTERVAL '${OBSERVATION_MINUTES} minutes'
              THEN CURRENT_TIMESTAMP
            ELSE "firstFailedAt"
          END,
          "lockUntil" = CASE
            WHEN (
              CASE
                WHEN "firstFailedAt" IS NULL
                  OR "firstFailedAt" < CURRENT_TIMESTAMP - INTERVAL '${OBSERVATION_MINUTES} minutes'
                  THEN 1
                ELSE COALESCE("failedAttempts", 0) + 1
              END
            ) >= ${LOCK_THRESHOLD}
              THEN CURRENT_TIMESTAMP + INTERVAL '${LOCK_MINUTES} minutes'
            ELSE NULL
          END
        WHERE id = $1
        RETURNING "failedAttempts", "lockUntil"
        `,
        [user.id]
      );

      const { lockUntil } = updated.rows[0];

      if (lockUntil && new Date(lockUntil) > new Date()) {
        return res.status(403).json({
          message: `Too many failed attempts. Account locked for ${LOCK_MINUTES} minutes.`,
        });
      }

      return res.status(401).json({ message: 'Invalid Credentials' });
    }

    // Success: clear counters
    await pool.query(
      `
      UPDATE "Admin"
      SET
        "failedAttempts" = 0,
        "firstFailedAt" = NULL,
        "lockUntil" = NULL
      WHERE id = $1
      `,
      [user.id]
    );

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: 'admin',
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
        issuer: 'your-app',
        audience: 'admin',
      }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.CROSS_SITE_COOKIE === 'true' ? 'none' : 'strict',
      maxAge: 60 * 60 * 1000,
      path: '/',
    });

    return res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    console.error('Admin login error:', err);
    return res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.CROSS_SITE_COOKIE === 'true' ? 'none' : 'strict',
    path: '/',
  });

  return res.status(200).json({ message: 'Logged out successfully' });
});

router.get('/check-auth', verifyAdmin, (req, res) => {
  return res.status(200).json({
    authenticated: true,
    admin: req.admin,
  });
});

export default router;