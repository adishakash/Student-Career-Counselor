'use strict';
const crypto = require('crypto');
const db = require('../../config/database');
const config = require('../../config/config');
const { AppError } = require('../../middleware/errorHandler');
const { sha256 } = require('../../utils/helpers');
const logger = require('../../utils/logger');

const TokenService = {
  /**
   * Create a signed upgrade token for a free report.
   * The raw token is returned (for embedding in PDF link).
   * Only the hash is stored in the DB.
   */
  async createUpgradeToken(studentId, assessmentId) {
    const expiryDays = config.jwt.upgradeTokenExpiryDays;
    const expiresAt = new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000);

    // Build payload: studentId:assessmentId:timestamp
    const payload = `${studentId}:${assessmentId}:${Date.now()}`;
    const signature = crypto
      .createHmac('sha256', config.jwt.upgradeTokenSecret)
      .update(payload)
      .digest('hex');

    // Token = base64url(payload) + '.' + signature
    const rawToken = `${Buffer.from(payload).toString('base64url')}.${signature}`;
    const tokenHash = sha256(rawToken);

    await db.query(
      `INSERT INTO upgrade_tokens (student_id, assessment_id, token_hash, expires_at)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (token_hash) DO NOTHING`,
      [studentId, assessmentId, tokenHash, expiresAt]
    );

    logger.debug('Upgrade token created', { studentId, assessmentId });
    return rawToken;
  },

  /**
   * Validate an upgrade token from a URL query param.
   * Returns student and assessment data if valid.
   * Throws AppError if invalid, expired, or already used.
   */
  async validateUpgradeToken(rawToken) {
    if (!rawToken || typeof rawToken !== 'string') {
      throw new AppError('Invalid upgrade token', 400);
    }

    const parts = rawToken.split('.');
    if (parts.length !== 2) throw new AppError('Malformed upgrade token', 400);

    const [b64Payload, signature] = parts;

    let payload;
    try {
      payload = Buffer.from(b64Payload, 'base64url').toString('utf8');
    } catch {
      throw new AppError('Malformed upgrade token', 400);
    }

    // Verify HMAC signature
    const expectedSignature = crypto
      .createHmac('sha256', config.jwt.upgradeTokenSecret)
      .update(payload)
      .digest('hex');

    const isValid = crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'hex'),
      Buffer.from(signature.padStart(64, '0').slice(0, 64), 'hex')
    );

    if (!isValid) throw new AppError('Invalid upgrade token signature', 400);

    const [studentId, assessmentId] = payload.split(':');
    if (!studentId || !assessmentId) throw new AppError('Malformed token payload', 400);

    const tokenHash = sha256(rawToken);

    const result = await db.query(
      `SELECT ut.id, ut.used, ut.expires_at,
              s.id as student_id, s.name as student_name, s.email as student_email,
              ut.assessment_id
       FROM upgrade_tokens ut
       JOIN students s ON s.id = ut.student_id
       WHERE ut.token_hash = $1`,
      [tokenHash]
    );

    if (result.rows.length === 0) throw new AppError('Upgrade token not found', 404);

    const token = result.rows[0];

    if (token.used) throw new AppError('This upgrade link has already been used', 409);
    if (new Date(token.expires_at) < new Date()) throw new AppError('This upgrade link has expired', 410);

    return {
      tokenId: token.id,
      studentId: token.student_id,
      assessmentId: token.assessment_id,
      studentName: token.student_name,
      studentEmail: token.student_email,
    };
  },

  /**
   * Mark a token as used after successful payment.
   */
  async markTokenUsed(tokenHash) {
    await db.query(
      `UPDATE upgrade_tokens SET used = TRUE, used_at = NOW() WHERE token_hash = $1`,
      [tokenHash]
    );
  },
};

module.exports = TokenService;
