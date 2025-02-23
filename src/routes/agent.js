import express from 'express';
import db from '../config/db.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Transfer funds from agent to client
router.post('/transfer', authenticate, async (req, res) => {
  const { recipient_phone, amount } = req.body;
  const senderId = req.user.id;

  if (req.user.role !== 'agent') {
    return res.status(403).json({ error: "Agents only" });
  }

  try {
    await db.query('BEGIN');

    // 1. Check sender balance
    const sender = await db.query(
      'SELECT balance FROM users WHERE id = $1 FOR UPDATE',
      [senderId]
    );
    if (sender.rows[0].balance < amount) {
      await db.query('ROLLBACK');
      return res.status(400).json({ error: "Insufficient balance" });
    }

    // 2. Find recipient by phone
    const recipient = await db.query(
      'SELECT id FROM users WHERE phone_number = $1',
      [recipient_phone]
    );
    if (!recipient.rows[0]) {
      await db.query('ROLLBACK');
      return res.status(404).json({ error: "Recipient not found" });
    }

    // 3. Update balances
    await db.query(
      'UPDATE users SET balance = balance - $1 WHERE id = $2',
      [amount, senderId]
    );
    await db.query(
      'UPDATE users SET balance = balance + $1 WHERE id = $2',
      [amount, recipient.rows[0].id]
    );

    // 4. Log transaction
    await db.query(
      `INSERT INTO ledger (type, sender_id, receiver_id, amount, status)
       VALUES ('transfer', $1, $2, $3, 'completed')`,
      [senderId, recipient.rows[0].id, amount]
    );

    await db.query('COMMIT');
    res.json({ success: true });
  } catch (error) {
    await db.query('ROLLBACK');
    res.status(500).json({ error: "Transfer failed" });
  }
});

export default router;