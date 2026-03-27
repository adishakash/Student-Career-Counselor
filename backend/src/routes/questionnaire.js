'use strict';
const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { validate, schemas } = require('../middleware/validate');
const { AppError } = require('../middleware/errorHandler');
const LLMFactory = require('../services/llm/LLMFactory');
const logger = require('../utils/logger');

/**
 * GET /api/questionnaire/questions/:assessmentId
 * Get (or generate) the question set for an assessment.
 * Idempotent: if questions already exist, return them.
 */
router.get('/questions/:assessmentId', async (req, res, next) => {
  try {
    const { assessmentId } = req.params;

    // 1. Check assessment is valid and in the right state
    const assessmentResult = await db.query(
      `SELECT a.id, a.plan_type, a.status, a.payment_status,
              s.name, s.age, s.standard, s.email
       FROM assessments a
       JOIN students s ON s.id = a.student_id
       WHERE a.id = $1`,
      [assessmentId]
    );

    if (assessmentResult.rows.length === 0) {
      throw new AppError('Assessment not found', 404);
    }

    const assessment = assessmentResult.rows[0];

    // Paid plan: must be paid before questions are served
    if (assessment.plan_type === 'paid' && assessment.payment_status !== 'paid') {
      throw new AppError('Payment is required before starting the questionnaire', 402);
    }

    // 2. Return existing questions if already generated (idempotency)
    const existingQuestions = await db.query(
      `SELECT id, question_text, question_type, options, category, order_index
       FROM questions
       WHERE assessment_id = $1
       ORDER BY order_index ASC`,
      [assessmentId]
    );

    if (existingQuestions.rows.length > 0) {
      return res.json({ success: true, data: { questions: existingQuestions.rows } });
    }

    // 3. Generate questions via LLM (or static bank)
    const studentProfile = {
      name: assessment.name,
      age: assessment.age,
      standard: assessment.standard,
      planType: assessment.plan_type,
    };

    const llmService = LLMFactory.getProvider();
    const { questions, logData } = await llmService.generateQuestions(studentProfile, assessmentId);

    // 4. Save questions to DB
    const savedQuestions = [];
    for (const q of questions) {
      const result = await db.query(
        `INSERT INTO questions (assessment_id, question_text, question_type, options, category, order_index)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, question_text, question_type, options, category, order_index`,
        [assessmentId, q.questionText, q.questionType, JSON.stringify(q.options || null), q.category, q.orderIndex]
      );
      savedQuestions.push(result.rows[0]);
    }

    // 5. Log LLM usage
    await db.query(
      `INSERT INTO llm_logs (assessment_id, provider, prompt_type, prompt_tokens, completion_tokens, total_tokens, status, duration_ms)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        assessmentId,
        logData.provider,
        'generate_questions',
        logData.promptTokens || null,
        logData.completionTokens || null,
        logData.totalTokens || null,
        logData.status,
        logData.durationMs || null,
      ]
    );

    res.json({ success: true, data: { questions: savedQuestions } });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/questionnaire/answers
 * Save student answers for an assessment.
 * Idempotent: upserts answers.
 */
router.post('/answers', validate(schemas.answersSchema), async (req, res, next) => {
  try {
    const { assessmentId, answers } = req.body;

    // Verify assessment
    const assessmentResult = await db.query(
      'SELECT id, status FROM assessments WHERE id = $1',
      [assessmentId]
    );
    if (assessmentResult.rows.length === 0) {
      throw new AppError('Assessment not found', 404);
    }

    const assessment = assessmentResult.rows[0];
    if (assessment.status === 'completed') {
      throw new AppError('Assessment is already completed', 409);
    }

    // Upsert answers
    await db.withTransaction(async (client) => {
      for (const answer of answers) {
        await client.query(
          `INSERT INTO answers (assessment_id, question_id, answer_text, answer_value)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (assessment_id, question_id)
           DO UPDATE SET answer_text = EXCLUDED.answer_text,
                         answer_value = EXCLUDED.answer_value`,
          [
            assessmentId,
            answer.questionId,
            answer.answerText || null,
            answer.answerValue != null ? JSON.stringify(answer.answerValue) : null,
          ]
        );
      }

      // Mark assessment as completed
      await client.query(
        `UPDATE assessments
         SET status = 'completed', completed_at = NOW(), updated_at = NOW()
         WHERE id = $1`,
        [assessmentId]
      );
    });

    res.json({ success: true, message: 'Answers saved successfully', data: { assessmentId } });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
