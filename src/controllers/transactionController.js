import User from '../models/user.js';
import Transaction from '../models/transaction.js';

export const transferFunds = async (req, res) => {
  const client = await db.getClient();
  try {
    await client.query('BEGIN');
    const { recipient_phone, amount } = req.body;
    const senderId = req.user.id;

    // Validate amount
    if (amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Check sender balance
    const senderBalance = await User.getBalance(senderId);
    if (senderBalance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Find recipient
    const recipient = await User.findByPhone(recipient_phone);
    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    // Create transaction
    const transaction = await Transaction.create({
      type: 'transfer',
      sender_id: senderId,
      receiver_id: recipient.id,
      amount,
      status: 'pending'
    });

    // Update balances
    await User.updateBalance(senderId, -amount);
    await User.updateBalance(recipient.id, amount);

    // Update transaction status
    await Transaction.updateStatus(transaction.id, 'completed');

    await client.query('COMMIT');

    res.json({
      success: true,
      transaction_id: transaction.id,
      new_balance: await User.getBalance(senderId)
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Transfer error:', error);
    res.status(500).json({ error: 'Transfer failed' });
  } finally {
    client.release();
  }
};

export const approveDeposit = async (req, res) => {
  const client = await db.getClient();
  try {
    await client.query('BEGIN');
    const { agent_id, amount, method } = req.body;

    // Validate amount
    if (amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Create deposit record
    const deposit = await Transaction.create({
      type: 'deposit',
      sender_id: agent_id,
      receiver_id: agent_id,
      amount,
      status: 'completed',
      metadata: { method }
    });

    // Update agent balance
    await User.updateBalance(agent_id, amount);

    await client.query('COMMIT');

    res.json({
      success: true,
      deposit: {
        id: deposit.id,
        agent_id,
        amount,
        method,
        verified: true
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Deposit approval error:', error);
    res.status(500).json({ error: 'Deposit approval failed' });
  } finally {
    client.release();
  }
};

export const getTransactionHistory = async (req, res) => {
  try {
    const transactions = await Transaction.getTransactionHistory(req.user.id);
    res.json(transactions);
  } catch (error) {
    console.error('Transaction history error:', error);
    res.status(500).json({ error: 'Failed to fetch transaction history' });
  }
}; 