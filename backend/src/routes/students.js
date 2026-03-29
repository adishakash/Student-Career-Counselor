'use strict';
const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { validate, schemas } = require('../middleware/validate');
const { registerLimiter } = require('../middleware/rateLimiter');
const { normalizeEmail } = require('../utils/helpers');
const { AppError } = require('../middleware/errorHandler');
const LLMFactory = require('../services/llm/LLMFactory');

/**
 * POST /api/students/register
 * Register a student and create an assessment record.
 * Returns: { studentId, assessmentId, planType }
 */
router.post(
  '/register',
  registerLimiter,
  validate(schemas.registerSchema),
  async (req, res, next) => {
    try {
      const { name, email, age, standard, phone, planType, language = 'en' } = req.body;
      const normalizedEmail = normalizeEmail(email);

      const result = await db.withTransaction(async (client) => {
        // Upsert student by email
        const studentResult = await client.query(
          `INSERT INTO students (name, email, age, standard, phone)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (email) DO UPDATE
             SET name = EXCLUDED.name,
                 age = EXCLUDED.age,
                 standard = EXCLUDED.standard,
                 phone = COALESCE(EXCLUDED.phone, students.phone),
                 updated_at = NOW()
           RETURNING id`,
          [name, normalizedEmail, age, standard, phone || null]
        );
        const studentId = studentResult.rows[0].id;

        // Create assessment
        const paymentStatus = planType === 'free' ? 'not_required' : 'pending';
        const assessmentStatus = planType === 'free' ? 'in_progress' : 'payment_pending';

        const assessmentResult = await client.query(
          `INSERT INTO assessments (student_id, plan_type, status, payment_status, language)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING id`,
          [studentId, planType, assessmentStatus, paymentStatus, language]
        );
        const assessmentId = assessmentResult.rows[0].id;

        return { studentId, assessmentId };
      });

      res.status(201).json({
        success: true,
        data: {
          studentId: result.studentId,
          assessmentId: result.assessmentId,
          planType,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /api/students/profile?email=xxx
 * Get basic student info by email (used internally).
 */
router.get('/profile', async (req, res, next) => {
  try {
    const email = normalizeEmail(req.query.email || '');
    if (!email) throw new AppError('Email is required', 400);

    const result = await db.query(
      `SELECT s.id, s.name, s.email, s.age, s.standard,
              a.id as assessment_id, a.plan_type, a.status, a.payment_status
       FROM students s
       LEFT JOIN assessments a ON a.student_id = s.id
       WHERE s.email = $1
       ORDER BY a.created_at DESC
       LIMIT 1`,
      [email]
    );

    if (result.rows.length === 0) {
      throw new AppError('No student found with this email', 404);
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
