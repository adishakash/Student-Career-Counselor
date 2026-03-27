'use strict';
const Razorpay = require('razorpay');
const crypto = require('crypto');
const config = require('../../config/config');
const db = require('../../config/database');
const { AppError } = require('../../middleware/errorHandler');
const logger = require('../../utils/logger');

// Lazily initialized — avoids a constructor throw at module-load time
// when credentials are not yet present (e.g. during platform health checks).
let _razorpay = null;
function getRazorpay() {
  if (!_razorpay) {
    if (!config.razorpay.keyId || !config.razorpay.keySecret) {
      throw new AppError('Payment gateway is not configured. Please contact support.', 503);
    }
    _razorpay = new Razorpay({
      key_id: config.razorpay.keyId,
      key_secret: config.razorpay.keySecret,
    });
  }
  return _razorpay;
}

const RazorpayService = {
  /**
   * Create a Razorpay order and record it in DB.
   * @returns {{ order, payment }}
   */
  async createOrder({ assessmentId, studentId, paymentType = 'new' }) {
    const razorpay = getRazorpay(); // throws AppError 503 if credentials are missing
    const amount = config.razorpay.paidReportAmount;

    // Check for existing pending order (idempotency)
    const existingPayment = await db.query(
      `SELECT id, razorpay_order_id FROM payments
       WHERE assessment_id = $1 AND status = 'created'
       LIMIT 1`,
      [assessmentId]
    );

    if (existingPayment.rows.length > 0) {
      // Return existing order to prevent duplicate orders
      const existingOrderId = existingPayment.rows[0].razorpay_order_id;
      try {
        const existingOrder = await razorpay.orders.fetch(existingOrderId);
        if (existingOrder.status === 'created') {
          return { order: existingOrder, payment: existingPayment.rows[0] };
        }
      } catch (e) {
        // Order may have expired; fall through to create new one
      }
    }

    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: `assess_${assessmentId.slice(0, 20)}`,
      notes: { assessmentId, studentId, paymentType },
    });

    const paymentResult = await db.query(
      `INSERT INTO payments (assessment_id, student_id, razorpay_order_id, amount, currency, status, payment_type)
       VALUES ($1, $2, $3, $4, $5, 'created', $6)
       RETURNING id`,
      [assessmentId, studentId, order.id, amount, 'INR', paymentType]
    );

    logger.info('Razorpay order created', { orderId: order.id, assessmentId });

    return { order, payment: paymentResult.rows[0] };
  },

  /**
   * Verify Razorpay payment signature.
   * This MUST run on the backend — never trust frontend verification.
   */
  verifySignature(orderId, paymentId, signature) {
    const body = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', config.razorpay.keySecret)
      .update(body)
      .digest('hex');
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'hex'),
      Buffer.from(signature, 'hex')
    );
  },
};

module.exports = RazorpayService;
