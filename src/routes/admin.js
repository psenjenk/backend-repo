import express from 'express';
import { authenticate, isAdmin } from '../middleware/auth.js';
import { approveDeposit } from '../controllers/transactionController.js';
import User from '../models/user.js';
import Transaction from '../models/transaction.js';

const router = express.Router();

// Apply authentication and admin middleware to all routes
router.use(authenticate);
router.use(isAdmin);

/**
 * @swagger
 * /api/admin/approve-deposit:
 *   post:
 *     summary: Approve agent deposit
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - agent_id
 *               - amount
 *               - method
 *             properties:
 *               agent_id:
 *                 type: integer
 *                 example: 1
 *               amount:
 *                 type: number
 *                 minimum: 0
 *                 example: 1000.00
 *               method:
 *                 type: string
 *                 enum: [cash, bank_transfer]
 *                 example: "bank_transfer"
 *     responses:
 *       200:
 *         description: Deposit approved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 deposit:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     agent_id:
 *                       type: integer
 *                     amount:
 *                       type: number
 *                     method:
 *                       type: string
 *                     verified:
 *                       type: boolean
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.post('/approve-deposit', approveDeposit);

/**
 * @swagger
 * /api/admin/pending-transactions:
 *   get:
 *     summary: Get all pending transactions
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending transactions
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
 *         description: Admin access required
 */
router.get('/pending-transactions', async (req, res) => {
  try {
    const transactions = await Transaction.getPendingTransactions();
    res.json(transactions);
  } catch (error) {
    console.error('Pending transactions error:', error);
    res.status(500).json({ error: 'Failed to fetch pending transactions' });
  }
});

/**
 * @swagger
 * /api/admin/users/{userId}/kyc:
 *   patch:
 *     summary: Update user KYC status
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, approved, rejected]
 *                 example: "approved"
 *     responses:
 *       200:
 *         description: KYC status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 kyc_status:
 *                   type: string
 *       400:
 *         description: Invalid KYC status
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: User not found
 */
router.patch('/users/:userId/kyc', async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid KYC status' });
    }

    const updatedStatus = await User.updateKycStatus(userId, status);
    res.json({ kyc_status: updatedStatus });
  } catch (error) {
    console.error('KYC status update error:', error);
    res.status(500).json({ error: 'Failed to update KYC status' });
  }
});

export default router;