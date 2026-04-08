import express from "express";
import pool from "../config/db.js";
import { authenticateToken } from "../middleware/auth.js";
import { monitorEventLoopDelay } from "perf_hooks";

const router = express.Router();

// GET: Get all user assets
router.get("/", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM portfolio WHERE user_id = $1",
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch portfolio" });
  }
});

// POST: Add or Update an asset
router.post("/", authenticateToken, async (req, res) => {
  // Ensure we have numbers to work with
  const { coin_id, symbol, quantity = 0, avg_buy_price = 0 } = req.body;

  // Calculate investment safely
  const investment = parseFloat(quantity) * parseFloat(avg_buy_price);

  try {
    const query = `
            INSERT INTO portfolio (user_id, coin_id, symbol, quantity, total_investment)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (user_id, coin_id) 
            DO UPDATE SET 
                quantity = portfolio.quantity + EXCLUDED.quantity,
                total_investment = portfolio.total_investment + EXCLUDED.total_investment
            RETURNING *;
        `;
    const result = await pool.query(query, [
      req.user.userId,
      coin_id,
      symbol,
      quantity,
      investment,
    ]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("DB Error:", err.message); // Helpful for debugging in terminal
    res
      .status(500)
      .json({ error: "Failed to add asset", message: err.message });
  }
});

export default router;
