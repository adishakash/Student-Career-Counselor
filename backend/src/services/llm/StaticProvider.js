'use strict';
const LLMProvider = require('./LLMProvider');
const { FREE_QUESTIONS, PAID_EXTRA_QUESTIONS } = require('./staticQuestions');

/**
 * StaticProvider — uses built-in question bank and rule-based report generation.
 * Used as: default fallback when no LLM is configured, or as ultimate fallback.
 */
class StaticProvider extends LLMProvider {
  constructor() {
    super('static');
  }

  async generateQuestions(studentProfile, assessmentId) {
    const questions = [...FREE_QUESTIONS];
    if (studentProfile.planType === 'paid') {
      questions.push(...PAID_EXTRA_QUESTIONS);
    }
    return {
      questions,
      logData: this.buildLogData('success'),
    };
  }

  async generateReport(studentProfile, qna, assessmentId) {
    const reportContent = this._buildStaticReport(studentProfile, qna);
    return {
      reportContent,
      logData: this.buildLogData('success'),
    };
  }

  _buildStaticReport(student, qna) {
    const answerMap = {};
    qna.forEach((row) => {
      answerMap[row.category] = answerMap[row.category] || [];
      answerMap[row.category].push({
        question: row.question_text,
        answer: row.answer_text || (row.answer_value ? JSON.stringify(row.answer_value) : 'Not answered'),
      });
    });

    const interestAnswer = qna.find((q) => q.category === 'interests' && q.answer_value);
    const skillAnswer = qna.find((q) => q.category === 'skills' && q.answer_value);
    const goalAnswer = qna.find((q) => q.category === 'goals' && q.answer_value);

    // Map interest values to career paths
    const careerMap = {
      engineering: ['Software Engineer', 'Mechanical Engineer', 'Civil Engineer'],
      medicine: ['Doctor', 'Nurse', 'Medical Researcher', 'Pharmacist'],
      business: ['Entrepreneur', 'CA / CFA', 'Business Analyst', 'Marketing Manager'],
      design: ['UX Designer', 'Architect', 'Film Director', 'Fashion Designer'],
      law: ['Lawyer', 'Policy Analyst', 'Judge', 'Legal Consultant'],
      education: ['Professor', 'Educator', 'Researcher', 'Content Creator'],
      defence: ['Army Officer', 'IAS / IPS', 'Air Force Pilot', 'Coast Guard Officer'],
      sports: ['Professional Athlete', 'Sports Coach', 'Sports Physiotherapist'],
      tech: ['Software Developer', 'Data Scientist', 'Cybersecurity Expert'],
      science: ['Research Scientist', 'Biotechnologist', 'Physicist'],
      commerce: ['Chartered Accountant', 'Investment Banker', 'Economist'],
      humanities: ['Journalist', 'Psychologist', 'Sociologist', 'NGO Leader'],
    };

    const interestValues = (() => {
      try {
        const raw = interestAnswer?.answer_value;
        if (Array.isArray(raw)) return raw;
        if (typeof raw === 'string') return [raw];
        return [];
      } catch { return []; }
    })();

    const suggestedCareers = interestValues
      .flatMap((v) => careerMap[v] || [])
      .filter(Boolean)
      .slice(0, 6);

    if (suggestedCareers.length < 3) {
      suggestedCareers.push('Software Developer', 'Business Analyst', 'Educator');
    }

    return {
      studentName: student.name,
      standard: student.standard,
      age: student.age,
      reportType: student.planType,
      summary: `Based on your responses, ${student.name}, you show a strong inclination towards activities that align with analytical thinking, creativity, and a desire to make an impact. Your interests and personality suggest you are well-suited for careers that combine your strengths with purpose-driven work.`,
      strengths: [
        'Natural curiosity and eagerness to learn',
        'Strong subject engagement in your areas of interest',
        'Clear sense of long-term goals and values',
        'Growing self-awareness about your unique strengths',
      ],
      careerSuggestions: suggestedCareers.map((career) => ({
        title: career,
        fit: 'High',
        description: `A career in ${career} would leverage your strengths and align with your expressed interests.`,
        pathway: `Focus on core subjects, seek internships or related activities, and explore entrance exams or skill certifications in this field.`,
      })),
      academicPathways: [
        'Identify 2-3 career options from the suggestions above that excite you most',
        'Research the specific entrance exams / degrees required (JEE, NEET, CLAT, CUET, etc.)',
        'Speak with a counselor at your school about stream selection options',
        'Look for summer programs, workshops, or online courses in your fields of interest',
      ],
      nextSteps: [
        `Reflect on which career suggestions resonate most with your vision for the future`,
        `Research top colleges and entrance exams required for your shortlisted fields`,
        `Find a mentor — a professional in your chosen field — who can guide you`,
        `Work on building skills relevant to your chosen path starting today`,
        `Book a 1-on-1 session with our counselors for personalised guidance`,
      ],
      motivation: `Remember, ${student.name}: choosing a career is not a one-time decision — it is an evolving journey. The most important step is to stay curious, keep exploring, and make informed choices. You have the potential to achieve great things.`,
    };
  }
}

module.exports = StaticProvider;
