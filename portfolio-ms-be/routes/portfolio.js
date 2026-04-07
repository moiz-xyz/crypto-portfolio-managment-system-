import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// 1. READ: Get all assets in the portfolio
// 🧠 System Design: We fetch raw quantities; UI will calculate live value
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM user_assets ORDER BY updated_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error while fetching portfolio' });
  }
});

// 2. CREATE: Add a new asset
router.post('/', async (req, res) => {
  const { asset_symbol, quantity, avg_buy_price } = req.body;
  
  // Validation (Backend Engineering Best Practice)
  if (!asset_symbol || !quantity || !avg_buy_price) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const query = `
      INSERT INTO user_assets (asset_symbol, quantity, avg_buy_price) 
      VALUES ($1, $2, $3) RETURNING *`;
    const values = [asset_symbol.toUpperCase(), quantity, avg_buy_price];
    
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. DELETE: Remove an asset from portfolio
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM user_assets WHERE id = $1', [id]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    
    res.json({ message: 'Asset removed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
