import express from "express";
import pool from "../config/db.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// GET: Get user watchlist (returns array of IDs like ['bitcoin', 'ethereum'])
router.get("/", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT coin_id FROM watchlist WHERE user_id = $1",
      [req.user.userId]
    );
    const ids = result.rows.map((row) => row.coin_id);
    res.json(ids);
  } catch (err) {
    res.status(500).json({ error: "Error fetching watchlist" });
  }
});

// POST: Toggle watchlist item
router.post("/toggle", authenticateToken, async (req, res) => {
  const { coin_id } = req.body;
  try {
    const check = await pool.query(
      "SELECT * FROM watchlist WHERE user_id = $1 AND coin_id = $2",
      [req.user.userId, coin_id]
    );

    if (check.rows.length > 0) {
      await pool.query(
        "DELETE FROM watchlist WHERE user_id = $1 AND coin_id = $2",
        [req.user.userId, coin_id]
      );
      res.json({ action: "removed", coin_id });
    } else {
      await pool.query(
        "INSERT INTO watchlist (user_id, coin_id) VALUES ($1, $2)",
        [req.user.userId, coin_id]
      );
      res.json({ action: "added", coin_id });
    }
  } catch (err) {
    res.status(500).json({ error: "Error toggling watchlist" });
  }
});

export default router;
