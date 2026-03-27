'use strict';

/**
 * Base class / interface for all LLM providers.
 * Each provider must implement generateQuestions() and generateReport().
 */
class LLMProvider {
  constructor(name) {
    this.name = name;
  }

  /**
   * Generate questionnaire questions for a student profile.
   * @param {Object} studentProfile - { name, age, standard, planType }
   * @param {string} assessmentId
   * @returns {{ questions: Array, logData: Object }}
   */
  async generateQuestions(studentProfile, assessmentId) {
    throw new Error(`LLMProvider.generateQuestions not implemented in ${this.name}`);
  }

  /**
   * Generate a career report based on Q&A.
   * @param {Object} studentProfile
   * @param {Array} qna - [{ question_text, category, answer_text, answer_value }]
   * @param {string} assessmentId
   * @returns {{ reportContent: Object, logData: Object }}
   */
  async generateReport(studentProfile, qna, assessmentId) {
    throw new Error(`LLMProvider.generateReport not implemented in ${this.name}`);
  }

  /**
   * Build the base log data object.
   */
  buildLogData(status = 'success', extras = {}) {
    return { provider: this.name, status, ...extras };
  }
}

module.exports = LLMProvider;
