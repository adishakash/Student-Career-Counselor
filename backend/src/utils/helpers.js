'use strict';
const crypto = require('crypto');

/**
 * Generate a cryptographically random hex string of given byte length.
 */
function randomHex(bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex');
}

/**
 * Create an HMAC-SHA256 signature.
 */
function hmacSHA256(data, secret) {
  return crypto.createHmac('sha256', secret).update(data).digest('hex');
}

/**
 * Hash a string with SHA-256 (for storing tokens).
 */
function sha256(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Sleep for ms milliseconds.
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Sanitize email to lowercase trimmed string.
 */
function normalizeEmail(email) {
  return (email || '').toLowerCase().trim();
}

/**
 * Format amount from paise to readable INR string.
 */
function formatINR(paise) {
  const rupees = paise / 100;
  return `₹${rupees.toLocaleString('en-IN')}`;
}

/**
 * Pick specific keys from an object.
 */
function pick(obj, keys) {
  return keys.reduce((acc, key) => {
    if (Object.prototype.hasOwnProperty.call(obj, key)) acc[key] = obj[key];
    return acc;
  }, {});
}

module.exports = { randomHex, hmacSHA256, sha256, sleep, normalizeEmail, formatINR, pick };
