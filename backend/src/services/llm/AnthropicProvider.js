'use strict';
const axios = require('axios');
const LLMProvider = require('./LLMProvider');
const config = require('../../config/config');
const logger = require('../../utils/logger');

class AnthropicProvider extends LLMProvider {
  constructor() {
    super('anthropic');
    this.apiKey = config.llm.anthropic.apiKey;
    this.model = config.llm.anthropic.model;
  }

  async _callAPI(prompt, maxTokens = 3000) {
    const start = Date.now();
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: this.model,
        max_tokens: maxTokens,
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
        },
        timeout: 60000,
      }
    );
    const durationMs = Date.now() - start;
    return { data: response.data, durationMs };
  }

  async generateQuestions(studentProfile, assessmentId) {
    try {
      const OpenAIProvider = require('./OpenAIProvider');
      // Reuse the same prompts — see OpenAIProvider for prompt templates
      const { QUESTION_PROMPT } = require('./OpenAIProvider');
      const prompt = `You are a career assessment expert. Always respond with valid JSON only.\n\n${OpenAIProvider.QUESTION_PROMPT ? OpenAIProvider.QUESTION_PROMPT(studentProfile) : ''}`;

      const { data, durationMs } = await this._callAPI(
        `You are a career assessment expert. Respond with valid JSON only.\n\nGenerate ${studentProfile.planType === 'paid' ? 20 : 10} career assessment questions for: Name: ${studentProfile.name}, Age: ${studentProfile.age}, Class: ${studentProfile.standard}.\n\nReturn a JSON array of objects: [{orderIndex, category, questionType, questionText, options}]`,
        2500
      );

      const raw = JSON.parse(data.content[0].text);
      const questions = Array.isArray(raw) ? raw : raw.questions || [];

      return {
        questions,
        logData: this.buildLogData('success', {
          promptTokens: data.usage?.input_tokens,
          completionTokens: data.usage?.output_tokens,
          totalTokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0),
          durationMs,
        }),
      };
    } catch (err) {
      logger.error('Anthropic generateQuestions failed', { error: err.message });
      const StaticProvider = require('./StaticProvider');
      const result = await new StaticProvider().generateQuestions(studentProfile, assessmentId);
      result.logData = this.buildLogData('fallback');
      return result;
    }
  }

  async generateReport(studentProfile, qna, assessmentId) {
    try {
      const isPaid = studentProfile.planType === 'paid';
      const qnaText = qna
        .map((row, i) => `Q${i + 1}: ${row.question_text}\nAnswer: ${row.answer_text || row.answer_value || 'N/A'}`)
        .join('\n\n');

      const prompt = `You are a career counselor. Respond with valid JSON only.

Analyse this student's assessment and generate a career counseling report.
Student: ${studentProfile.name}, Age ${studentProfile.age}, Class ${studentProfile.standard}.

Q&A:
${qnaText}

Return JSON: {studentName, standard, age, reportType, summary, strengths[], careerSuggestions[{title,fit,description,pathway}], academicPathways[], nextSteps[], motivation}`;

      const { data, durationMs } = await this._callAPI(prompt, isPaid ? 4000 : 2000);
      const reportContent = JSON.parse(data.content[0].text);

      return {
        reportContent,
        logData: this.buildLogData('success', {
          promptTokens: data.usage?.input_tokens,
          completionTokens: data.usage?.output_tokens,
          totalTokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0),
          durationMs,
        }),
      };
    } catch (err) {
      logger.error('Anthropic generateReport failed', { error: err.message });
      const StaticProvider = require('./StaticProvider');
      const result = await new StaticProvider().generateReport(studentProfile, qna, assessmentId);
      result.logData = this.buildLogData('fallback');
      return result;
    }
  }
}

module.exports = AnthropicProvider;
