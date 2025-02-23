import express from 'express';
import db from '../config/db.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Approve a deposit (admins only)
router.post('/approve-deposit', authenticate, isAdmin, async (req, res) => {
  const { agent_id, amount, method } = req.body;

  try {
    await db.query('BEGIN');

    // 1. Record the deposit
    const deposit = await db.query(
      `INSERT INTO agent_deposits (agent_id, amount, method, verified)
       VALUES ($1, $2, $3, TRUE)
       RETURNING *`,
      [agent_id, amount, method]
    );

    // 2. Update agent's balance
    await db.query(
      'UPDATE users SET balance = balance + $1 WHERE id = $2',
      [amount, agent_id]
    );

    // 3. Log in ledger
    await db.query(
      `INSERT INTO ledger (type, sender_id, receiver_id, amount, status)
       VALUES ('deposit', $1, $1, $2, 'completed')`,
      [agent_id, amount]
    );

    await db.query('COMMIT');
    res.json({ success: true, deposit: deposit.rows[0] });
  } catch (error) {
    await db.query('ROLLBACK');
    res.status(500).json({ error: "Deposit approval failed" });
  }
});

export default router;