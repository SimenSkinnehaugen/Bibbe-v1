const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const TripletexService = require('../services/tripletex');

module.exports = (pool, authenticate) => {
  const router = express.Router();

  router.post('/register', async (req, res) => {
    try {
      const { email, password, companyName } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
      }
      const hashed = await bcrypt.hash(password, 10);
      const result = await pool.query(
        'INSERT INTO users (email, password_hash, company_name) VALUES ($1, $2, $3) RETURNING id, email, company_name',
        [email, hashed, companyName]
      );
      const token = jwt.sign({ userId: result.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      res.json({ token, user: result.rows[0] });
    } catch (err) {
      if (err.code === '23505') {
        return res.status(400).json({ error: 'Email already exists' });
      }
      res.status(500).json({ error: 'Registration failed' });
    }
  });

  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      const user = result.rows[0];
      if (!user || !await bcrypt.compare(password, user.password_hash)) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      res.json({ token, user: { id: user.id, email: user.email, company_name: user.company_name } });
    } catch (err) {
      res.status(500).json({ error: 'Login failed' });
    }
  });

  router.post('/tripletex/setup', authenticate, async (req, res) => {
    try {
      const { sessionToken } = req.body;
      const tripletex = new TripletexService(sessionToken);
      await tripletex.getAccounts();
      await pool.query('UPDATE users SET tripletex_token = $1 WHERE id = $2', [sessionToken, req.user.userId]);
      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ error: 'Invalid Tripletex token' });
    }
  });

  return router;
};
