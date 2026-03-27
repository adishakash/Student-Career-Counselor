'use strict';
const rateLimit = require('express-rate-limit');

const windowMs = 15 * 60 * 1000; // 15 minutes

const generalLimiter = rateLimit({
  windowMs,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});

const paymentLimiter = rateLimit({
  windowMs,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many payment requests. Please wait before trying again.' },
});

const resendLimiter = rateLimit({
  windowMs,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many resend requests. Please try again in 15 minutes.' },
});

const registerLimiter = rateLimit({
  windowMs,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many registrations. Please try again later.' },
});

module.exports = { generalLimiter, paymentLimiter, resendLimiter, registerLimiter };
