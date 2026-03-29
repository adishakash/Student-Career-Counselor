'use strict';
const axios = require('axios');
const LLMProvider = require('./LLMProvider');
const config = require('../../config/config');
const logger = require('../../utils/logger');

class GeminiProvider extends LLMProvider {
  constructor() {
    super('gemini');
    this.apiKey = config.llm.gemini.apiKey;
    this.model = config.llm.gemini.model;
  }

  async _callAPI(prompt, maxTokens = 3000) {
    const start = Date.now();
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
    const response = await axios.post(
      url,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: maxTokens, temperature: 0.7 },
      },
      { timeout: 60000 }
    );
    const durationMs = Date.now() - start;
    return { data: response.data, durationMs };
  }

  async generateQuestions(studentProfile, assessmentId) {
    try {
      const count = studentProfile.planType === 'paid' ? 20 : 10;
      const prompt = `You are a career counselor. Return ONLY valid JSON, no markdown.
Generate ${count} career assessment questions for: Name: ${studentProfile.name}, Age: ${studentProfile.age}, Class: ${studentProfile.standard}.
Return a JSON array: [{orderIndex, category, questionType, questionText, options}]
Categories: academics, interests, personality, skills, goals
Types: single_choice, multi_choice, scale, text`;

      const { data, durationMs } = await this._callAPI(prompt, 2500);
      const text = data.candidates[0].content.parts[0].text.replace(/```json|```/g, '').trim();
      const raw = JSON.parse(text);
      const questions = Array.isArray(raw) ? raw : raw.questions || [];

      return {
        questions,
        logData: this.buildLogData('success', {
          promptTokens: data.usageMetadata?.promptTokenCount,
          completionTokens: data.usageMetadata?.candidatesTokenCount,
          totalTokens: data.usageMetadata?.totalTokenCount,
          durationMs,
        }),
      };
    } catch (err) {
      logger.error('Gemini generateQuestions failed', { error: err.message });
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
        .map((r, i) => {
          let ans = r.answer_text;
          if (!ans && r.answer_value) {
            try {
              const parsed = typeof r.answer_value === 'string' ? JSON.parse(r.answer_value) : r.answer_value;
              ans = Array.isArray(parsed) ? parsed.join(', ') : String(parsed);
            } catch { ans = String(r.answer_value); }
          }
          return `Q${i + 1} [${r.category}]: ${r.question_text}\nAnswer: ${ans || 'Not answered'}`;
        })
        .join('\n\n');

      const prompt = isPaid
        ? `You are a senior career counselor in India. Return ONLY valid JSON, no markdown.
Generate a DEEPLY PERSONALISED premium career report based STRICTLY on this student's actual answers. Do NOT give generic advice — every sentence must reference what the student specifically said.
Student: ${studentProfile.name}, Age ${studentProfile.age}, Class ${studentProfile.standard}.
Q&A:
${qnaText}

Return JSON: {studentName, standard, age, reportType:"paid", summary, personalityInsights, interestPattern, strengths[4+], careerSuggestions[6+:{title,fit:"High|Medium|Good",description,pathway}], academicPathways[5+], nextSteps[5+], motivation}
CRITICAL: Report must be unique to this student's answers. Include detailed pathways with entrance exams and degree routes. Address student by name in motivation.`
        : `You are a career counselor. Return ONLY valid JSON, no markdown.
Generate a PERSONALISED introductory career overview based STRICTLY on this student's actual answers.
Student: ${studentProfile.name}, Age ${studentProfile.age}, Class ${studentProfile.standard}.
Q&A:
${qnaText}

Return JSON: {studentName, standard, age, reportType:"free", summary, strengths[3], careerSuggestions[3:{title,fit:"High",description,pathway}], nextSteps[3], motivation}
CRITICAL: Every suggestion must directly match what this specific student expressed. Address student by name in motivation.`;

      const { data, durationMs } = await this._callAPI(prompt, isPaid ? 4000 : 2000);
      const text = data.candidates[0].content.parts[0].text.replace(/```json|```/g, '').trim();
      const reportContent = JSON.parse(text);

      return {
        reportContent,
        logData: this.buildLogData('success', {
          promptTokens: data.usageMetadata?.promptTokenCount,
          completionTokens: data.usageMetadata?.candidatesTokenCount,
          totalTokens: data.usageMetadata?.totalTokenCount,
          durationMs,
        }),
      };
    } catch (err) {
      logger.error('Gemini generateReport failed', { error: err.message });
      const StaticProvider = require('./StaticProvider');
      const result = await new StaticProvider().generateReport(studentProfile, qna, assessmentId);
      result.logData = this.buildLogData('fallback');
      return result;
    }
  }
}

module.exports = GeminiProvider;
