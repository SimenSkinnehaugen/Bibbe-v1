const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Register new user
router.post('/register', async (req, res) => {
  const { email, password, company_name } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (email, password, company_name) VALUES ($1, $2, $3)',
      [email, hashedPassword, company_name]
    );
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

module.exports = router;
