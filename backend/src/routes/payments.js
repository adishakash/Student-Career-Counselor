'use strict';
const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { validate, schemas } = require('../middleware/validate');
const { paymentLimiter } = require('../middleware/rateLimiter');
const { AppError } = require('../middleware/errorHandler');
const RazorpayService = require('../services/payment/RazorpayService');
const TokenService = require('../services/token/TokenService');
const logger = require('../utils/logger');

/**
 * POST /api/payments/create-order
 * Create a Razorpay order for an assessment.
 */
router.post(
  '/create-order',
  paymentLimiter,
  validate(schemas.createOrderSchema),
  async (req, res, next) => {
    try {
      const { assessmentId, paymentType } = req.body;

      // Verify assessment exists and is awaiting payment
      const assessmentResult = await db.query(
        `SELECT a.id, a.student_id, a.payment_status, a.plan_type, s.email, s.name
         FROM assessments a
         JOIN students s ON s.id = a.student_id
         WHERE a.id = $1`,
        [assessmentId]
      );

      if (assessmentResult.rows.length === 0) {
        throw new AppError('Assessment not found', 404);
      }

      const assessment = assessmentResult.rows[0];

      if (assessment.payment_status === 'paid') {
        throw new AppError('Payment already completed for this assessment', 409);
      }

      const { order, payment } = await RazorpayService.createOrder({
        assessmentId,
        studentId: assessment.student_id,
        paymentType,
      });

      res.json({
        success: true,
        data: {
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          studentName: assessment.name,
          studentEmail: assessment.email,
          paymentId: payment.id,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /api/payments/verify
 * Verify Razorpay payment signature and update DB.
 */
router.post(
  '/verify',
  paymentLimiter,
  validate(schemas.verifyPaymentSchema),
  async (req, res, next) => {
    try {
      const { razorpayOrderId, razorpayPaymentId, razorpaySignature, assessmentId } = req.body;

      // Verify signature — MUST happen on backend
      const isValid = RazorpayService.verifySignature(
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature
      );

      if (!isValid) {
        logger.warn('Invalid Razorpay signature received', { razorpayOrderId, assessmentId });
        throw new AppError('Payment verification failed. Invalid signature.', 400);
      }

      // Update payment and assessment in a transaction
      await db.withTransaction(async (client) => {
        await client.query(
          `UPDATE payments
           SET razorpay_payment_id = $1,
               razorpay_signature = $2,
               status = 'paid',
               updated_at = NOW()
           WHERE razorpay_order_id = $3`,
          [razorpayPaymentId, razorpaySignature, razorpayOrderId]
        );

        await client.query(
          `UPDATE assessments
           SET payment_status = 'paid',
               status = 'in_progress',
               updated_at = NOW()
           WHERE id = $1`,
          [assessmentId]
        );
      });

      logger.info('Payment verified successfully', { razorpayOrderId, assessmentId });

      res.json({ success: true, message: 'Payment verified successfully', data: { assessmentId } });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /api/payments/failure
 * Record a failed/cancelled payment.
 */
router.post('/failure', paymentLimiter, async (req, res, next) => {
  try {
    const { razorpayOrderId, assessmentId, reason } = req.body;

    if (!assessmentId && !razorpayOrderId) {
      return res.status(400).json({ success: false, message: 'assessmentId or razorpayOrderId required' });
    }

    if (razorpayOrderId) {
      await db.query(
        `UPDATE payments SET status = 'failed', updated_at = NOW()
         WHERE razorpay_order_id = $1`,
        [razorpayOrderId]
      );
    }

    if (assessmentId) {
      await db.query(
        `UPDATE assessments SET payment_status = 'failed', updated_at = NOW()
         WHERE id = $1 AND payment_status = 'pending'`,
        [assessmentId]
      );
    }

    res.json({ success: true, message: 'Payment failure recorded' });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/payments/upgrade-info?token=xxx
 * Validate an upgrade token from the free PDF link.
 * Returns student info needed to populate the upgrade checkout.
 */
router.get('/upgrade-info', paymentLimiter, async (req, res, next) => {
  try {
    const { token } = req.query;
    if (!token) throw new AppError('Upgrade token is required', 400);

    const tokenData = await TokenService.validateUpgradeToken(token);

    res.json({
      success: true,
      data: {
        studentId: tokenData.studentId,
        assessmentId: tokenData.assessmentId,
        studentName: tokenData.studentName,
        studentEmail: tokenData.studentEmail,
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
