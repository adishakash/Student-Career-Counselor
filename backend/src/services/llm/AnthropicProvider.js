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
        .map((row, i) => {
          let ans = row.answer_text;
          if (!ans && row.answer_value) {
            try {
              const parsed = typeof row.answer_value === 'string' ? JSON.parse(row.answer_value) : row.answer_value;
              ans = Array.isArray(parsed) ? parsed.join(', ') : String(parsed);
            } catch { ans = String(row.answer_value); }
          }
          return `Q${i + 1} [${row.category}]: ${row.question_text}\nAnswer: ${ans || 'Not answered'}`;
        })
        .join('\n\n');

      const prompt = isPaid
        ? `You are a senior career counselor in India. Respond with valid JSON only.

Generate a DEEPLY PERSONALISED premium career report based STRICTLY on this student's actual answers. Do NOT give generic advice — every sentence must reference what the student specifically said.
Student: ${studentProfile.name}, Age ${studentProfile.age}, Class ${studentProfile.standard}.

Q&A:
${qnaText}

Return JSON: {studentName, standard, age, reportType:"paid", summary, personalityInsights, interestPattern, strengths[4+], careerSuggestions[6+:{title,fit:"High|Medium|Good",description,pathway}], academicPathways[5+], nextSteps[5+], motivation}
CRITICAL: Report must be unique to this student. Include detailed pathways with entrance exams and degree routes. Address student by name in motivation.`
        : `You are a career counselor. Respond with valid JSON only.

Generate a PERSONALISED introductory career overview based STRICTLY on this student's actual answers.
Student: ${studentProfile.name}, Age ${studentProfile.age}, Class ${studentProfile.standard}.

Q&A:
${qnaText}

Return JSON: {studentName, standard, age, reportType:"free", summary, strengths[3], careerSuggestions[3:{title,fit:"High",description,pathway}], nextSteps[3], motivation}
CRITICAL: Every suggestion must directly match what this specific student expressed. Address student by name in motivation.`;

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
