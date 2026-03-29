'use strict';
const Joi = require('joi');

function validate(schema, target = 'body') {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[target], { abortEarly: false, stripUnknown: true });
    if (error) {
      const message = error.details.map((d) => d.message).join(', ');
      return res.status(422).json({ success: false, message });
    }
    req[target] = value;
    next();
  };
}

// ─── Schemas ─────────────────────────────────

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().email().lowercase().trim().required(),
  age: Joi.number().integer().min(10).max(30).required(),
  standard: Joi.string().trim().max(50).required(),
  phone: Joi.string().trim().max(15).optional().allow('', null),
  planType: Joi.string().valid('free', 'paid').required(),
  language: Joi.string().valid('en', 'hi').default('en'),
});

const answersSchema = Joi.object({
  assessmentId: Joi.string().uuid().required(),
  answers: Joi.array()
    .items(
      Joi.object({
        questionId: Joi.string().uuid().required(),
        answerText: Joi.string().trim().max(2000).optional().allow('', null),
        answerValue: Joi.alternatives().try(
          Joi.string(),
          Joi.number(),
          Joi.array().items(Joi.string())
        ).optional().allow(null),
      })
    )
    .min(1)
    .required(),
});

const resendSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
});

const createOrderSchema = Joi.object({
  assessmentId: Joi.string().uuid().required(),
  paymentType: Joi.string().valid('new', 'upgrade').default('new'),
});

const verifyPaymentSchema = Joi.object({
  razorpayOrderId: Joi.string().required(),
  razorpayPaymentId: Joi.string().required(),
  razorpaySignature: Joi.string().required(),
  assessmentId: Joi.string().uuid().required(),
});

module.exports = {
  validate,
  schemas: { registerSchema, answersSchema, resendSchema, createOrderSchema, verifyPaymentSchema },
};
