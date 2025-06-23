const express = require('express');
const TripletexService = require('../services/tripletex');
const { FinancialAnalysisService, AIAnalysisService } = require('../services/analysis');

module.exports = (pool, authenticate) => {
  const router = express.Router();

  router.get('/liquidity', authenticate, async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT tripletex_token FROM users WHERE id = $1', [req.user.userId]);
      const sessionToken = rows[0]?.tripletex_token;
      if (!sessionToken) return res.status(400).json({ error: 'Tripletex not configured' });
      const tripletex = new TripletexService(sessionToken);
      const from = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const to = new Date().toISOString().split('T')[0];
      const transactions = await tripletex.getTransactions(from, to);
      const data = FinancialAnalysisService.calculateLiquidityBudget(transactions.values || []);
      const aiInsight = await AIAnalysisService.generateInsight('liquidity', data);
      await pool.query('INSERT INTO financial_data (user_id, data_type, data) VALUES ($1, $2, $3)', [req.user.userId, 'liquidity', JSON.stringify(data)]);
      res.json({ data, aiInsight });
    } catch (err) {
      res.status(500).json({ error: 'Analysis failed' });
    }
  });

  router.get('/cashflow', authenticate, async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT tripletex_token FROM users WHERE id = $1', [req.user.userId]);
      const sessionToken = rows[0]?.tripletex_token;
      if (!sessionToken) return res.status(400).json({ error: 'Tripletex not configured' });
      const tripletex = new TripletexService(sessionToken);
      const from = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const to = new Date().toISOString().split('T')[0];
      const transactions = await tripletex.getTransactions(from, to);
      const data = FinancialAnalysisService.calculateCashFlowForecast(transactions.values || []);
      const aiInsight = await AIAnalysisService.generateInsight('cashflow', data);
      await pool.query('INSERT INTO financial_data (user_id, data_type, data) VALUES ($1, $2, $3)', [req.user.userId, 'cashflow', JSON.stringify(data)]);
      res.json({ data, aiInsight });
    } catch (err) {
      res.status(500).json({ error: 'Analysis failed' });
    }
  });

  router.get('/profitability', authenticate, async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT tripletex_token FROM users WHERE id = $1', [req.user.userId]);
      const sessionToken = rows[0]?.tripletex_token;
      if (!sessionToken) return res.status(400).json({ error: 'Tripletex not configured' });
      const tripletex = new TripletexService(sessionToken);
      const from = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const to = new Date().toISOString().split('T')[0];
      const transactions = await tripletex.getTransactions(from, to);
      const data = FinancialAnalysisService.calculateProfitabilityAnalysis(transactions.values || []);
      const aiInsight = await AIAnalysisService.generateInsight('profitability', data);
      await pool.query('INSERT INTO financial_data (user_id, data_type, data) VALUES ($1, $2, $3)', [req.user.userId, 'profitability', JSON.stringify(data)]);
      res.json({ data, aiInsight });
    } catch (err) {
      res.status(500).json({ error: 'Analysis failed' });
    }
  });

  return router;
};
