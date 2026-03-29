'use strict';
const axios = require('axios');
const LLMProvider = require('./LLMProvider');
const config = require('../../config/config');
const { FREE_QUESTIONS, PAID_EXTRA_QUESTIONS } = require('./staticQuestions');
const logger = require('../../utils/logger');

const QUESTION_PROMPT = (student) => `
You are an expert career counselor. Generate a personalized set of career assessment questions for a student.

Student Profile:
- Name: ${student.name}
- Age: ${student.age} years
- Class/Standard: ${student.standard}
- Report Type: ${student.planType === 'paid' ? 'Premium (detailed)' : 'Basic (introductory)'}

Generate ${student.planType === 'paid' ? 20 : 10} career assessment questions covering these categories:
1. Academic interests (what subjects they enjoy)
2. Career interests (fields they find interesting)
3. Personality traits (how they work and think)
4. Skills and strengths
5. Goals and aspirations

Return a JSON object with a "questions" key containing an array of question objects. Each question object must have this exact structure:
{
  "questions": [
    {
      "orderIndex": <number starting from 1>,
      "category": "<academics|interests|personality|skills|goals>",
      "questionType": "<single_choice|multi_choice|scale|text>",
      "questionText": "<the question>",
      "options": [{"value": "<short_key>", "label": "<display text>"}] or null for text type
    }
  ]
}

Make questions friendly, clear, and appropriate for a ${student.age}-year-old student in India.
Return ONLY the JSON object with the "questions" key, no other text.
`;

function decodeAnswer(row) {
  const raw = row.answer_value;
  if (row.answer_text) return row.answer_text;
  if (!raw) return 'Not answered';
  try {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (Array.isArray(parsed)) return parsed.join(', ');
    return String(parsed);
  } catch { return String(raw); }
}

const REPORT_PROMPT = (student, qna, isPaid) => {
  const qnaText = qna
    .map((row, i) => `Q${i + 1} [${row.category}]: ${row.question_text}\nAnswer: ${decodeAnswer(row)}`)
    .join('\n\n');

  return `
You are a senior career counselor in India. Your job is to generate a DEEPLY PERSONALISED career report based STRICTLY on this specific student's actual answers below. Do NOT give generic advice. Every sentence must directly reference something the student said.

Student Profile:
- Name: ${student.name}
- Age: ${student.age}
- Class: ${student.standard}

Assessment Q&A (use these answers to drive ALL recommendations):
${qnaText}

Generate a structured JSON report reflecting ONLY what this specific student expressed:
{
  "studentName": "${student.name}",
  "standard": "${student.standard}",
  "age": ${student.age},
  "reportType": "${isPaid ? 'paid' : 'free'}",
  "summary": "<2-3 sentences describing THIS student's unique personality and interests based on their answers>",
  "strengths": ["<specific strength shown in their answers>", "<another specific strength>", "<third strength>", "<fourth strength>"],
  "interestPattern": "<what pattern of genuine interests emerges from their answers — be specific>",
  "personalityInsights": "<personality traits clearly visible in how they answered — be specific>",
  "careerSuggestions": [
    {
      "title": "<Career that directly matches what the student expressed interest in>",
      "fit": "<High|Medium|Good>",
      "description": "<why this specifically suits THIS student based on their answers>",
      "pathway": "<how to pursue this — relevant entrance exams, degree, skills for Indian students>"
    }
  ],
  "academicPathways": ["<step 1 tailored to their class and stated goals>", "<step 2>", "<step 3>"],
  "nextSteps": ["<actionable step tied to their specific interests>", "<step 2>", "<step 3>", "<step 4>", "<step 5>"],
  "motivation": "<a warm, encouraging message addressing ${student.name} directly by name, referencing their specific dreams>"
}

${isPaid ? 'For the premium report: include 5-7 career suggestions with detailed pathways, deep personality insights, and comprehensive next steps.' : 'For the basic report: include 3 career suggestions with high-level guidance.'}
CRITICAL: The report must be unique to this student. Do not produce a template response.

Return ONLY the JSON object, no other text.
`;
};

class OpenAIProvider extends LLMProvider {
  constructor() {
    super('openai');
    this.apiKey = config.llm.openai.apiKey;
    this.model = config.llm.openai.model;
  }

  async _callAPI(messages, options = {}) {
    const start = Date.now();
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: this.model,
        messages,
        temperature: 0.7,
        max_tokens: options.maxTokens || 3000,
        response_format: { type: 'json_object' },
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
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
      const { data, durationMs } = await this._callAPI([
        { role: 'system', content: 'You are a career assessment expert. Always respond with valid JSON.' },
        { role: 'user', content: QUESTION_PROMPT(studentProfile) },
      ]);

      const raw = JSON.parse(data.choices[0].message.content);
      const questions = Array.isArray(raw) ? raw : raw.questions || raw.data || raw.items || [];

      if (questions.length === 0) {
        throw new Error('OpenAI returned an empty questions array');
      }

      return {
        questions: questions.map((q) => ({
          orderIndex: q.orderIndex,
          category: q.category,
          questionType: q.questionType,
          questionText: q.questionText,
          options: q.options,
        })),
        logData: this.buildLogData('success', {
          promptTokens: data.usage?.prompt_tokens,
          completionTokens: data.usage?.completion_tokens,
          totalTokens: data.usage?.total_tokens,
          durationMs,
        }),
      };
    } catch (err) {
      logger.error('OpenAI generateQuestions failed', { error: err.message });
      // Fallback to static
      const StaticProvider = require('./StaticProvider');
      const staticProvider = new StaticProvider();
      const result = await staticProvider.generateQuestions(studentProfile, assessmentId);
      result.logData = this.buildLogData('fallback');
      return result;
    }
  }

  async generateReport(studentProfile, qna, assessmentId) {
    try {
      const isPaid = studentProfile.planType === 'paid';
      const { data, durationMs } = await this._callAPI(
        [
          { role: 'system', content: 'You are a career counselor. Always respond with valid JSON.' },
          { role: 'user', content: REPORT_PROMPT(studentProfile, qna, isPaid) },
        ],
        { maxTokens: isPaid ? 4000 : 2000 }
      );

      const reportContent = JSON.parse(data.choices[0].message.content);

      return {
        reportContent,
        logData: this.buildLogData('success', {
          promptTokens: data.usage?.prompt_tokens,
          completionTokens: data.usage?.completion_tokens,
          totalTokens: data.usage?.total_tokens,
          durationMs,
        }),
      };
    } catch (err) {
      logger.error('OpenAI generateReport failed', { error: err.message });
      const StaticProvider = require('./StaticProvider');
      const staticProvider = new StaticProvider();
      const result = await staticProvider.generateReport(studentProfile, qna, assessmentId);
      result.logData = this.buildLogData('fallback');
      return result;
    }
  }
}

module.exports = OpenAIProvider;
