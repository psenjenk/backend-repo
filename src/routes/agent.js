import express from 'express';
import { authenticate, isAgent } from '../middleware/auth.js';
import { transferFunds, getTransactionHistory } from '../controllers/transactionController.js';
import User from '../models/user.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);
router.use(isAgent);

/**
 * @swagger
 * /api/agent/transfer:
 *   post:
 *     summary: Transfer funds to another user
 *     tags: [Agent]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recipient_phone
 *               - amount
 *             properties:
 *               recipient_phone:
 *                 type: string
 *                 format: phone
 *                 example: "+1234567890"
 *               amount:
 *                 type: number
 *                 minimum: 0
 *                 example: 100.00
 *     responses:
 *       200:
 *         description: Transfer successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 transaction_id:
 *                   type: string
 *                 new_balance:
 *                   type: number
 *       400:
 *         description: Invalid amount or insufficient funds
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Agent access required
 *       404:
 *         description: Recipient not found
 */
router.post('/transfer', transferFunds);

/**
 * @swagger
 * /api/agent/transactions:
 *   get:
 *     summary: Get transaction history
 *     tags: [Agent]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   type:
 *                     type: string
 *                   amount:
 *                     type: number
 *                   status:
 *                     type: string
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                   sender_phone:
 *                     type: string
 *                   receiver_phone:
 *                     type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Agent access required
 */
router.get('/transactions', getTransactionHistory);

/**
 * @swagger
 * /api/agent/balance:
 *   get:
 *     summary: Get current balance
 *     tags: [Agent]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current balance
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 balance:
 *                   type: number
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Agent access required
 */
router.get('/balance', async (req, res) => {
  try {
    const balance = await User.getBalance(req.user.id);
    res.json({ balance });
  } catch (error) {
    console.error('Balance check error:', error);
    res.status(500).json({ error: 'Failed to fetch balance' });
  }
});

export default router;