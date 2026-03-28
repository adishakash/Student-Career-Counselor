'use strict';
const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { validate, schemas } = require('../middleware/validate');
const { resendLimiter } = require('../middleware/rateLimiter');
const { AppError } = require('../middleware/errorHandler');
const LLMFactory = require('../services/llm/LLMFactory');
const PDFService = require('../services/pdf/PDFService');
const EmailService = require('../services/email/EmailService');
const TokenService = require('../services/token/TokenService');
const { normalizeEmail } = require('../utils/helpers');
const logger = require('../utils/logger');

/**
 * POST /api/reports/generate
 * Generate a PDF report and email it to the student.
 * Idempotent: if a report already exists for this assessment, resend it.
 * Body: { assessmentId }
 */
router.post('/generate', async (req, res, next) => {
  try {
    const { assessmentId } = req.body;
    if (!assessmentId) throw new AppError('assessmentId is required', 400);

    // Fetch assessment + student + answers
    const assessmentResult = await db.query(
      `SELECT a.id, a.plan_type, a.status, a.payment_status,
              s.id as student_id, s.name, s.email, s.age, s.standard
       FROM assessments a
       JOIN students s ON s.id = a.student_id
       WHERE a.id = $1`,
      [assessmentId]
    );

    if (assessmentResult.rows.length === 0) throw new AppError('Assessment not found', 404);
    const assessment = assessmentResult.rows[0];

    if (assessment.status !== 'completed') {
      throw new AppError('Assessment is not yet completed', 400);
    }

    if (assessment.plan_type === 'paid' && assessment.payment_status !== 'paid') {
      throw new AppError('Payment not verified for this assessment', 402);
    }

    // Idempotency: check if report already generated
    const existingReport = await db.query(
      'SELECT id, pdf_path, pdf_filename FROM reports WHERE assessment_id = $1',
      [assessmentId]
    );

    let reportId, pdfPath, pdfFilename;

    if (existingReport.rows.length > 0) {
      // Report already exists — resend email
      reportId = existingReport.rows[0].id;
      pdfPath = existingReport.rows[0].pdf_path;
      pdfFilename = existingReport.rows[0].pdf_filename;
      logger.info('Report already exists, resending email', { assessmentId });
    } else {
      // Fetch questions + answers
      const qnaResult = await db.query(
        `SELECT q.question_text, q.category, q.order_index,
                a.answer_text, a.answer_value
         FROM questions q
         LEFT JOIN answers a ON a.question_id = q.id AND a.assessment_id = $1
         WHERE q.assessment_id = $1
         ORDER BY q.order_index ASC`,
        [assessmentId]
      );

      const studentProfile = {
        name: assessment.name,
        age: assessment.age,
        standard: assessment.standard,
        planType: assessment.plan_type,
      };

      // Generate AI report content
      const llmService = LLMFactory.getProvider();
      const startTime = Date.now();
      const { reportContent, logData } = await llmService.generateReport(
        studentProfile,
        qnaResult.rows,
        assessmentId
      );
      const durationMs = Date.now() - startTime;

      // Log LLM usage
      await db.query(
        `INSERT INTO llm_logs (assessment_id, provider, prompt_type, prompt_tokens, completion_tokens, total_tokens, status, duration_ms)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          assessmentId,
          logData.provider,
          'generate_report',
          logData.promptTokens || null,
          logData.completionTokens || null,
          logData.totalTokens || null,
          logData.status,
          durationMs,
        ]
      );

      // Generate upgrade token if free report
      let upgradeToken = null;
      if (assessment.plan_type === 'free') {
        upgradeToken = await TokenService.createUpgradeToken(
          assessment.student_id,
          assessmentId
        );
      }

      // Generate PDF
      const pdfResult = await PDFService.generate({
        student: assessment,
        reportContent,
        reportType: assessment.plan_type,
        upgradeToken,
      });

      pdfPath = pdfResult.key;
      pdfFilename = pdfResult.filename;

      // Save report to DB
      const reportResult = await db.query(
        `INSERT INTO reports (assessment_id, student_id, report_type, content, pdf_path, pdf_filename)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id`,
        [
          assessmentId,
          assessment.student_id,
          assessment.plan_type,
          JSON.stringify(reportContent),
          pdfPath,
          pdfFilename,
        ]
      );
      reportId = reportResult.rows[0].id;
    }

    // Send email
    await EmailService.sendReport({
      to: assessment.email,
      studentName: assessment.name,
      reportType: assessment.plan_type,
      pdfPath,
      studentId: assessment.student_id,
      assessmentId,
    });

    res.json({
      success: true,
      message: 'Report generated and sent to your email',
      data: { reportId, assessmentId },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/reports/resend
 * Resend the latest report for a given email.
 */
router.post(
  '/resend',
  resendLimiter,
  validate(schemas.resendSchema),
  async (req, res, next) => {
    try {
      const { email } = req.body;
      const normalizedEmail = normalizeEmail(email);

      const result = await db.query(
        `SELECT r.id, r.pdf_path, r.report_type,
                s.name, s.email,
                r.student_id, a.id as assessment_id
         FROM reports r
         JOIN students s ON s.id = r.student_id
         JOIN assessments a ON a.id = r.assessment_id
         WHERE s.email = $1
         ORDER BY r.created_at DESC
         LIMIT 1`,
        [normalizedEmail]
      );

      if (result.rows.length === 0) {
        // Don't reveal whether email exists for privacy
        return res.json({
          success: true,
          message: 'If this email exists in our system, your report has been resent.',
        });
      }

      const report = result.rows[0];

      await EmailService.sendReport({
        to: report.email,
        studentName: report.name,
        reportType: report.report_type,
        pdfPath: report.pdf_path,
        studentId: report.student_id,
        assessmentId: report.assessment_id,
        isResend: true,
      });

      res.json({
        success: true,
        message: 'If this email exists in our system, your report has been resent.',
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
