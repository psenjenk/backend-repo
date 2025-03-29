import db from '../config/db.js';

class Transaction {
  static async create({ type, sender_id, receiver_id, amount, status = 'pending', reference = null, metadata = {} }) {
    const query = `
      INSERT INTO ledger (type, sender_id, receiver_id, amount, status, reference, metadata)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const result = await db.query(query, [
      type,
      sender_id,
      receiver_id,
      amount,
      status,
      reference,
      metadata
    ]);
    return result.rows[0];
  }

  static async updateStatus(transactionId, status) {
    const query = `
      UPDATE ledger 
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `;
    const result = await db.query(query, [status, transactionId]);
    return result.rows[0];
  }

  static async getTransactionHistory(userId) {
    const query = `
      SELECT l.*, 
             u1.phone_number as sender_phone,
             u2.phone_number as receiver_phone
      FROM ledger l
      LEFT JOIN users u1 ON l.sender_id = u1.id
      LEFT JOIN users u2 ON l.receiver_id = u2.id
      WHERE l.sender_id = $1 OR l.receiver_id = $1
      ORDER BY l.created_at DESC
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
  }

  static async getPendingTransactions() {
    const query = `
      SELECT l.*, 
             u1.phone_number as sender_phone,
             u2.phone_number as receiver_phone
      FROM ledger l
      LEFT JOIN users u1 ON l.sender_id = u1.id
      LEFT JOIN users u2 ON l.receiver_id = u2.id
      WHERE l.status = 'pending'
      ORDER BY l.created_at DESC
    `;
    const result = await db.query(query);
    return result.rows;
  }
}

export default Transaction; 