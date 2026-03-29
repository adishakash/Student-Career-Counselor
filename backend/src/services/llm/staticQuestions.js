'use strict';

/**
 * Built-in static question bank — used when no LLM provider is configured
 * or as fallback when an LLM call fails.
 *
 * Questions are tailored by standard (grade level) for age-appropriate content.
 */

const EARLY_SECONDARY_FREE_QUESTIONS = [
  {
    orderIndex: 1,
    category: 'academics',
    questionType: 'single_choice',
    questionText: 'Which subject do you enjoy the most in school?',
    options: [
      { value: 'science', label: 'Science (Physics, Chemistry, Biology)' },
      { value: 'math', label: 'Mathematics' },
      { value: 'commerce', label: 'Commerce & Accounts' },
      { value: 'humanities', label: 'Humanities & Social Studies' },
      { value: 'arts', label: 'Arts & Craft' },
      { value: 'languages', label: 'Languages & Literature' },
    ],
  },
  {
    orderIndex: 2,
    category: 'interests',
    questionType: 'single_choice',
    questionText: 'What kind of activities do you enjoy outside of school?',
    options: [
      { value: 'tech', label: 'Computers, coding, or technology' },
      { value: 'sports', label: 'Sports or fitness' },
      { value: 'music', label: 'Music, singing, or dancing' },
      { value: 'drawing', label: 'Drawing, painting, or design' },
      { value: 'reading', label: 'Reading books or writing stories' },
      { value: 'helping', label: 'Helping or volunteering in the community' },
    ],
  },
  {
    orderIndex: 3,
    category: 'personality',
    questionType: 'single_choice',
    questionText: 'How would you describe yourself best?',
    options: [
      { value: 'analytical', label: 'Analytical — I love solving problems' },
      { value: 'creative', label: 'Creative — I love making new things' },
      { value: 'social', label: 'Social — I love working with people' },
      { value: 'organised', label: 'Organised — I love planning and order' },
      { value: 'adventurous', label: 'Adventurous — I love taking risks' },
      { value: 'caring', label: 'Caring — I love helping others' },
    ],
  },
  {
    orderIndex: 4,
    category: 'goals',
    questionType: 'single_choice',
    questionText: 'What is your biggest dream for the future?',
    options: [
      { value: 'stability', label: 'Earn a stable and safe income' },
      { value: 'impact', label: 'Make a positive impact on society' },
      { value: 'fame', label: 'Become famous or well-recognised' },
      { value: 'entrepreneur', label: 'Start my own business' },
      { value: 'explore', label: 'Travel and explore the world' },
      { value: 'passion', label: 'Follow my passion, whatever it is' },
    ],
  },
  {
    orderIndex: 5,
    category: 'skills',
    questionType: 'single_choice',
    questionText: 'Which of the following feels most natural to you?',
    options: [
      { value: 'writing', label: 'Writing and explaining ideas' },
      { value: 'building', label: 'Building or fixing things' },
      { value: 'leading', label: 'Leading and organising groups' },
      { value: 'calculating', label: 'Calculating and analysing data' },
      { value: 'performing', label: 'Performing or presenting to an audience' },
      { value: 'researching', label: 'Researching and discovering new knowledge' },
    ],
  },
  {
    orderIndex: 6,
    category: 'academics',
    questionType: 'single_choice',
    questionText: 'How are your academic grades overall?',
    options: [
      { value: 'excellent', label: 'Excellent — I score above 90%' },
      { value: 'good', label: 'Good — I score between 75%–90%' },
      { value: 'average', label: 'Average — I score between 50%–75%' },
      { value: 'working', label: 'Still working on it' },
    ],
  },
  {
    orderIndex: 7,
    category: 'interests',
    questionType: 'multi_choice',
    questionText: 'Which of these career fields sound interesting to you? (Select all that apply)',
    options: [
      { value: 'engineering', label: 'Engineering & Technology' },
      { value: 'medicine', label: 'Medicine & Healthcare' },
      { value: 'business', label: 'Business & Finance' },
      { value: 'design', label: 'Design, Arts & Media' },
      { value: 'law', label: 'Law & Policy' },
      { value: 'education', label: 'Education & Research' },
      { value: 'defence', label: 'Defence & Government Services' },
      { value: 'sports', label: 'Sports & Fitness' },
    ],
  },
  {
    orderIndex: 8,
    category: 'personality',
    questionType: 'scale',
    questionText: 'How comfortable are you working independently without supervision?',
    options: [
      { value: '1', label: 'Not at all comfortable' },
      { value: '2', label: 'Slightly comfortable' },
      { value: '3', label: 'Moderately comfortable' },
      { value: '4', label: 'Very comfortable' },
      { value: '5', label: 'Completely self-driven' },
    ],
  },
  {
    orderIndex: 9,
    category: 'goals',
    questionType: 'single_choice',
    questionText: 'After Class 10, what are you most likely to do?',
    options: [
      { value: 'science', label: 'Take Science stream (PCM/PCB)' },
      { value: 'commerce', label: 'Take Commerce stream' },
      { value: 'arts', label: 'Take Arts/Humanities stream' },
      { value: 'vocational', label: 'Take a vocational / diploma course' },
      { value: 'work', label: 'Start working / doing internships' },
      { value: 'unsure', label: "I'm not sure yet" },
    ],
  },
  {
    orderIndex: 10,
    category: 'skills',
    questionType: 'text',
    questionText: 'In 1-2 sentences, describe what you dream of doing as a career. (No wrong answer!)',
    options: null,
  },
];

const HIGHER_SECONDARY_FREE_QUESTIONS = [
  {
    orderIndex: 1,
    category: 'academics',
    questionType: 'single_choice',
    questionText: 'Which subject do you enjoy the most in your current stream?',
    options: [
      { value: 'physics', label: 'Physics' },
      { value: 'chemistry', label: 'Chemistry' },
      { value: 'biology', label: 'Biology' },
      { value: 'math', label: 'Mathematics' },
      { value: 'commerce', label: 'Commerce & Accounts' },
      { value: 'humanities', label: 'Humanities & Social Studies' },
      { value: 'arts', label: 'Arts & Craft' },
      { value: 'languages', label: 'Languages & Literature' },
    ],
  },
  {
    orderIndex: 2,
    category: 'interests',
    questionType: 'single_choice',
    questionText: 'What kind of activities do you enjoy outside of school?',
    options: [
      { value: 'tech', label: 'Computers, coding, or technology' },
      { value: 'sports', label: 'Sports or fitness' },
      { value: 'music', label: 'Music, singing, or dancing' },
      { value: 'drawing', label: 'Drawing, painting, or design' },
      { value: 'reading', label: 'Reading books or writing stories' },
      { value: 'helping', label: 'Helping or volunteering in the community' },
      { value: 'debate', label: 'Debates, MUN, or public speaking' },
      { value: 'entrepreneurship', label: 'Starting small projects or businesses' },
    ],
  },
  {
    orderIndex: 3,
    category: 'personality',
    questionType: 'single_choice',
    questionText: 'How would you describe yourself best?',
    options: [
      { value: 'analytical', label: 'Analytical — I love solving problems' },
      { value: 'creative', label: 'Creative — I love making new things' },
      { value: 'social', label: 'Social — I love working with people' },
      { value: 'organised', label: 'Organised — I love planning and order' },
      { value: 'adventurous', label: 'Adventurous — I love taking risks' },
      { value: 'caring', label: 'Caring — I love helping others' },
    ],
  },
  {
    orderIndex: 4,
    category: 'goals',
    questionType: 'single_choice',
    questionText: 'What is your biggest career goal?',
    options: [
      { value: 'stability', label: 'Earn a stable and safe income' },
      { value: 'impact', label: 'Make a positive impact on society' },
      { value: 'fame', label: 'Become famous or well-recognised' },
      { value: 'entrepreneur', label: 'Start my own business' },
      { value: 'explore', label: 'Travel and explore the world' },
      { value: 'passion', label: 'Follow my passion, whatever it is' },
    ],
  },
  {
    orderIndex: 5,
    category: 'skills',
    questionType: 'single_choice',
    questionText: 'Which of the following feels most natural to you?',
    options: [
      { value: 'writing', label: 'Writing and explaining ideas' },
      { value: 'building', label: 'Building or fixing things' },
      { value: 'leading', label: 'Leading and organising groups' },
      { value: 'calculating', label: 'Calculating and analysing data' },
      { value: 'performing', label: 'Performing or presenting to an audience' },
      { value: 'researching', label: 'Researching and discovering new knowledge' },
    ],
  },
  {
    orderIndex: 6,
    category: 'academics',
    questionType: 'single_choice',
    questionText: 'How are your academic grades overall?',
    options: [
      { value: 'excellent', label: 'Excellent — I score above 90%' },
      { value: 'good', label: 'Good — I score between 75%–90%' },
      { value: 'average', label: 'Average — I score between 50%–75%' },
      { value: 'working', label: 'Still working on it' },
    ],
  },
  {
    orderIndex: 7,
    category: 'interests',
    questionType: 'multi_choice',
    questionText: 'Which of these career fields sounds interesting to you? (Select all that apply)',
    options: [
      { value: 'engineering', label: 'Engineering & Technology' },
      { value: 'medicine', label: 'Medicine & Healthcare' },
      { value: 'business', label: 'Business & Finance' },
      { value: 'design', label: 'Design, Arts & Media' },
      { value: 'law', label: 'Law & Policy' },
      { value: 'education', label: 'Education & Research' },
      { value: 'defence', label: 'Defence & Government Services' },
      { value: 'sports', label: 'Sports & Fitness' },
    ],
  },
  {
    orderIndex: 8,
    category: 'personality',
    questionType: 'scale',
    questionText: 'How comfortable are you working independently without supervision?',
    options: [
      { value: '1', label: 'Not at all comfortable' },
      { value: '2', label: 'Slightly comfortable' },
      { value: '3', label: 'Moderately comfortable' },
      { value: '4', label: 'Very comfortable' },
      { value: '5', label: 'Completely self-driven' },
    ],
  },
  {
    orderIndex: 9,
    category: 'goals',
    questionType: 'single_choice',
    questionText: 'After Class 12, what are you most likely to do?',
    options: [
      { value: 'college_india', label: 'Apply for college in India (JEE / NEET / others)' },
      { value: 'college_abroad', label: 'Study abroad (USA / UK / Canada / Australia)' },
      { value: 'vocational', label: 'Take a vocational / diploma course' },
      { value: 'work', label: 'Start working / doing internships' },
      { value: 'business', label: 'Start a small business or side project' },
      { value: 'unsure', label: "I'm not sure yet" },
    ],
  },
  {
    orderIndex: 10,
    category: 'skills',
    questionType: 'text',
    questionText: 'In 1-2 sentences, describe what you dream of doing as a career. (No wrong answer!)',
    options: null,
  },
];

const GRADUATED_FREE_QUESTIONS = [
  {
    orderIndex: 1,
    category: 'academics',
    questionType: 'single_choice',
    questionText: 'What was your favorite subject in Class 12?',
    options: [
      { value: 'physics', label: 'Physics' },
      { value: 'chemistry', label: 'Chemistry' },
      { value: 'biology', label: 'Biology' },
      { value: 'math', label: 'Mathematics' },
      { value: 'commerce', label: 'Commerce & Accounts' },
      { value: 'humanities', label: 'Humanities & Social Studies' },
      { value: 'arts', label: 'Arts & Craft' },
      { value: 'languages', label: 'Languages & Literature' },
    ],
  },
  {
    orderIndex: 2,
    category: 'interests',
    questionType: 'single_choice',
    questionText: 'What kind of activities do you enjoy in your free time?',
    options: [
      { value: 'tech', label: 'Computers, coding, or technology' },
      { value: 'sports', label: 'Sports or fitness' },
      { value: 'music', label: 'Music, singing, or dancing' },
      { value: 'drawing', label: 'Drawing, painting, or design' },
      { value: 'reading', label: 'Reading books or writing stories' },
      { value: 'helping', label: 'Helping or volunteering in the community' },
      { value: 'debate', label: 'Debates, MUN, or public speaking' },
      { value: 'entrepreneurship', label: 'Starting small projects or businesses' },
    ],
  },
  {
    orderIndex: 3,
    category: 'personality',
    questionType: 'single_choice',
    questionText: 'How would you describe yourself best?',
    options: [
      { value: 'analytical', label: 'Analytical — I love solving problems' },
      { value: 'creative', label: 'Creative — I love making new things' },
      { value: 'social', label: 'Social — I love working with people' },
      { value: 'organised', label: 'Organised — I love planning and order' },
      { value: 'adventurous', label: 'Adventurous — I love taking risks' },
      { value: 'caring', label: 'Caring — I love helping others' },
    ],
  },
  {
    orderIndex: 4,
    category: 'goals',
    questionType: 'single_choice',
    questionText: 'What is your biggest career goal?',
    options: [
      { value: 'stability', label: 'Earn a stable and safe income' },
      { value: 'impact', label: 'Make a positive impact on society' },
      { value: 'fame', label: 'Become famous or well-recognised' },
      { value: 'entrepreneur', label: 'Start my own business' },
      { value: 'explore', label: 'Travel and explore the world' },
      { value: 'passion', label: 'Follow my passion, whatever it is' },
    ],
  },
  {
    orderIndex: 5,
    category: 'skills',
    questionType: 'single_choice',
    questionText: 'Which of the following feels most natural to you?',
    options: [
      { value: 'writing', label: 'Writing and explaining ideas' },
      { value: 'building', label: 'Building or fixing things' },
      { value: 'leading', label: 'Leading and organising groups' },
      { value: 'calculating', label: 'Calculating and analysing data' },
      { value: 'performing', label: 'Performing or presenting to an audience' },
      { value: 'researching', label: 'Researching and discovering new knowledge' },
    ],
  },
  {
    orderIndex: 6,
    category: 'academics',
    questionType: 'single_choice',
    questionText: 'How were your Class 12 board exam results?',
    options: [
      { value: 'excellent', label: 'Excellent — above 90%' },
      { value: 'good', label: 'Good — between 75%–90%' },
      { value: 'average', label: 'Average — between 50%–75%' },
      { value: 'working', label: 'Still working on entrance exams' },
    ],
  },
  {
    orderIndex: 7,
    category: 'interests',
    questionType: 'multi_choice',
    questionText: 'Which of these career fields sounds interesting to you? (Select all that apply)',
    options: [
      { value: 'engineering', label: 'Engineering & Technology' },
      { value: 'medicine', label: 'Medicine & Healthcare' },
      { value: 'business', label: 'Business & Finance' },
      { value: 'design', label: 'Design, Arts & Media' },
      { value: 'law', label: 'Law & Policy' },
      { value: 'education', label: 'Education & Research' },
      { value: 'defence', label: 'Defence & Government Services' },
      { value: 'sports', label: 'Sports & Fitness' },
    ],
  },
  {
    orderIndex: 8,
    category: 'personality',
    questionType: 'scale',
    questionText: 'How comfortable are you working independently without supervision?',
    options: [
      { value: '1', label: 'Not at all comfortable' },
      { value: '2', label: 'Slightly comfortable' },
      { value: '3', label: 'Moderately comfortable' },
      { value: '4', label: 'Very comfortable' },
      { value: '5', label: 'Completely self-driven' },
    ],
  },
  {
    orderIndex: 9,
    category: 'goals',
    questionType: 'single_choice',
    questionText: 'What are you planning to do next?',
    options: [
      { value: 'college_india', label: 'Apply for college in India (JEE / NEET / others)' },
      { value: 'college_abroad', label: 'Study abroad (USA / UK / Canada / Australia)' },
      { value: 'vocational', label: 'Take a vocational / diploma course' },
      { value: 'work', label: 'Start working / doing internships' },
      { value: 'business', label: 'Start a small business or side project' },
      { value: 'gap', label: 'Take a gap year' },
    ],
  },
  {
    orderIndex: 10,
    category: 'skills',
    questionType: 'text',
    questionText: 'In 1-2 sentences, describe what you dream of doing as a career. (No wrong answer!)',
    options: null,
  },
];

const FREE_QUESTIONS = EARLY_SECONDARY_FREE_QUESTIONS;

const EARLY_SECONDARY_PAID_EXTRA_QUESTIONS = [
  {
    orderIndex: 11,
    category: 'personality',
    questionType: 'multi_choice',
    questionText: 'What motivates you most in life? (Select up to 3)',
    options: [
      { value: 'money', label: 'Financial success and wealth' },
      { value: 'recognition', label: 'Achievement and recognition' },
      { value: 'curiosity', label: 'Learning new things' },
      { value: 'family', label: 'Providing for my family' },
      { value: 'creativity', label: 'Expressing my creativity' },
      { value: 'meaning', label: 'Finding meaning and purpose' },
      { value: 'freedom', label: 'Freedom and flexibility' },
    ],
  },
  {
    orderIndex: 12,
    category: 'skills',
    questionType: 'single_choice',
    questionText: 'When given a complex problem, what is your first instinct?',
    options: [
      { value: 'research', label: 'Research it thoroughly before acting' },
      { value: 'experiment', label: 'Try different solutions and learn by doing' },
      { value: 'discuss', label: 'Discuss it with others to get their input' },
      { value: 'systematic', label: 'Break it into smaller systematic steps' },
      { value: 'intuition', label: 'Go with my gut feeling' },
    ],
  },
  {
    orderIndex: 13,
    category: 'interests',
    questionType: 'single_choice',
    questionText: 'If you could shadow a professional for a day, who would it be?',
    options: [
      { value: 'scientist', label: 'A research scientist in a lab' },
      { value: 'ceo', label: 'A CEO running a company' },
      { value: 'doctor', label: 'A doctor or surgeon' },
      { value: 'artist', label: 'A filmmaker, musician, or artist' },
      { value: 'lawyer', label: 'A lawyer in a courtroom' },
      { value: 'ias', label: 'An IAS officer or government official' },
      { value: 'athlete', label: 'A professional athlete or coach' },
      { value: 'teacher', label: 'A professor or teacher at a top university' },
    ],
  },
  {
    orderIndex: 14,
    category: 'academics',
    questionType: 'multi_choice',
    questionText: 'Which subjects do you find challenging? (They might actually point to hidden strengths)',
    options: [
      { value: 'math', label: 'Mathematics' },
      { value: 'physics', label: 'Physics' },
      { value: 'chemistry', label: 'Chemistry' },
      { value: 'biology', label: 'Biology' },
      { value: 'english', label: 'English or Communication' },
      { value: 'history', label: 'History / Civics' },
      { value: 'economics', label: 'Economics' },
      { value: 'none', label: 'None — I manage well in all subjects' },
    ],
  },
  {
    orderIndex: 15,
    category: 'goals',
    questionType: 'scale',
    questionText: 'How important is earning a high income to your career choice?',
    options: [
      { value: '1', label: 'Not important — I care more about passion' },
      { value: '2', label: 'Slightly important' },
      { value: '3', label: 'Moderately important — I want a balance' },
      { value: '4', label: 'Very important' },
      { value: '5', label: 'Extremely important — income is my top priority' },
    ],
  },
  {
    orderIndex: 16,
    category: 'personality',
    questionType: 'single_choice',
    questionText: 'What kind of work environment would make you happiest?',
    options: [
      { value: 'office', label: 'A structured office with clear processes' },
      { value: 'outdoor', label: 'Outdoors or fieldwork' },
      { value: 'remote', label: 'Remote — work from anywhere' },
      { value: 'hospital', label: 'Hospital, clinic, or social setting' },
      { value: 'startup', label: 'A fast-paced startup' },
      { value: 'creative', label: 'A creative studio or media company' },
    ],
  },
  {
    orderIndex: 17,
    category: 'skills',
    questionType: 'single_choice',
    questionText: 'Which of these skills do you most want to develop?',
    options: [
      { value: 'communication', label: 'Communication and public speaking' },
      { value: 'technical', label: 'Technical / coding / engineering skills' },
      { value: 'leadership', label: 'Leadership and management' },
      { value: 'creative', label: 'Creative and design skills' },
      { value: 'analytical', label: 'Analytical and data interpretation' },
      { value: 'research', label: 'Research and academic writing' },
    ],
  },
  {
    orderIndex: 18,
    category: 'interests',
    questionType: 'text',
    questionText: 'Is there a person (family member, celebrity, leader) whose career you admire? What do you admire about it?',
    options: null,
  },
  {
    orderIndex: 19,
    category: 'goals',
    questionType: 'text',
    questionText: 'What is one thing about your future career that worries or confuses you the most?',
    options: null,
  },
  {
    orderIndex: 20,
    category: 'personality',
    questionType: 'text',
    questionText: 'Describe a moment when you felt truly proud of something you accomplished. What was it, and why did it make you proud?',
    options: null,
  },
];

const HIGHER_SECONDARY_PAID_EXTRA_QUESTIONS = [
  {
    orderIndex: 11,
    category: 'personality',
    questionType: 'multi_choice',
    questionText: 'What motivates you most in life? (Select up to 3)',
    options: [
      { value: 'money', label: 'Financial success and wealth' },
      { value: 'recognition', label: 'Achievement and recognition' },
      { value: 'curiosity', label: 'Learning new things' },
      { value: 'family', label: 'Providing for my family' },
      { value: 'creativity', label: 'Expressing my creativity' },
      { value: 'meaning', label: 'Finding meaning and purpose' },
      { value: 'freedom', label: 'Freedom and flexibility' },
    ],
  },
  {
    orderIndex: 12,
    category: 'skills',
    questionType: 'single_choice',
    questionText: 'When given a complex problem, what is your first instinct?',
    options: [
      { value: 'research', label: 'Research it thoroughly before acting' },
      { value: 'experiment', label: 'Try different solutions and learn by doing' },
      { value: 'discuss', label: 'Discuss it with others to get their input' },
      { value: 'systematic', label: 'Break it into smaller systematic steps' },
      { value: 'intuition', label: 'Go with my gut feeling' },
    ],
  },
  {
    orderIndex: 13,
    category: 'interests',
    questionType: 'single_choice',
    questionText: 'If you could shadow a professional for a day, who would it be?',
    options: [
      { value: 'scientist', label: 'A research scientist in a lab' },
      { value: 'ceo', label: 'A CEO running a company' },
      { value: 'doctor', label: 'A doctor or surgeon' },
      { value: 'artist', label: 'A filmmaker, musician, or artist' },
      { value: 'lawyer', label: 'A lawyer in a courtroom' },
      { value: 'ias', label: 'An IAS officer or government official' },
      { value: 'athlete', label: 'A professional athlete or coach' },
      { value: 'teacher', label: 'A professor or teacher at a top university' },
    ],
  },
  {
    orderIndex: 14,
    category: 'academics',
    questionType: 'multi_choice',
    questionText: 'Which subjects do you find challenging? (They might actually point to hidden strengths)',
    options: [
      { value: 'math', label: 'Mathematics' },
      { value: 'physics', label: 'Physics' },
      { value: 'chemistry', label: 'Chemistry' },
      { value: 'biology', label: 'Biology' },
      { value: 'english', label: 'English or Communication' },
      { value: 'history', label: 'History / Civics' },
      { value: 'economics', label: 'Economics' },
      { value: 'none', label: 'None — I manage well in all subjects' },
    ],
  },
  {
    orderIndex: 15,
    category: 'goals',
    questionType: 'scale',
    questionText: 'How important is earning a high income to your career choice?',
    options: [
      { value: '1', label: 'Not important — I care more about passion' },
      { value: '2', label: 'Slightly important' },
      { value: '3', label: 'Moderately important — I want a balance' },
      { value: '4', label: 'Very important' },
      { value: '5', label: 'Extremely important — income is my top priority' },
    ],
  },
  {
    orderIndex: 16,
    category: 'personality',
    questionType: 'single_choice',
    questionText: 'What kind of work environment would make you happiest?',
    options: [
      { value: 'office', label: 'A structured office with clear processes' },
      { value: 'outdoor', label: 'Outdoors or fieldwork' },
      { value: 'remote', label: 'Remote — work from anywhere' },
      { value: 'hospital', label: 'Hospital, clinic, or social setting' },
      { value: 'startup', label: 'A fast-paced startup' },
      { value: 'creative', label: 'A creative studio or media company' },
    ],
  },
  {
    orderIndex: 17,
    category: 'skills',
    questionType: 'single_choice',
    questionText: 'Which of these skills do you most want to develop?',
    options: [
      { value: 'communication', label: 'Communication and public speaking' },
      { value: 'technical', label: 'Technical / coding / engineering skills' },
      { value: 'leadership', label: 'Leadership and management' },
      { value: 'creative', label: 'Creative and design skills' },
      { value: 'analytical', label: 'Analytical and data interpretation' },
      { value: 'research', label: 'Research and academic writing' },
    ],
  },
  {
    orderIndex: 18,
    category: 'interests',
    questionType: 'text',
    questionText: 'Is there a person (family member, celebrity, leader) whose career you admire? What do you admire about it?',
    options: null,
  },
  {
    orderIndex: 19,
    category: 'goals',
    questionType: 'text',
    questionText: 'What is one thing about your future career that worries or confuses you the most?',
    options: null,
  },
  {
    orderIndex: 20,
    category: 'personality',
    questionType: 'text',
    questionText: 'Describe a moment when you felt truly proud of something you accomplished. What was it, and why did it make you proud?',
    options: null,
  },
];

const GRADUATED_PAID_EXTRA_QUESTIONS = [
  {
    orderIndex: 11,
    category: 'personality',
    questionType: 'multi_choice',
    questionText: 'What motivates you most in life? (Select up to 3)',
    options: [
      { value: 'money', label: 'Financial success and wealth' },
      { value: 'recognition', label: 'Achievement and recognition' },
      { value: 'curiosity', label: 'Learning new things' },
      { value: 'family', label: 'Providing for my family' },
      { value: 'creativity', label: 'Expressing my creativity' },
      { value: 'meaning', label: 'Finding meaning and purpose' },
      { value: 'freedom', label: 'Freedom and flexibility' },
    ],
  },
  {
    orderIndex: 12,
    category: 'skills',
    questionType: 'single_choice',
    questionText: 'When given a complex problem, what is your first instinct?',
    options: [
      { value: 'research', label: 'Research it thoroughly before acting' },
      { value: 'experiment', label: 'Try different solutions and learn by doing' },
      { value: 'discuss', label: 'Discuss it with others to get their input' },
      { value: 'systematic', label: 'Break it into smaller systematic steps' },
      { value: 'intuition', label: 'Go with my gut feeling' },
    ],
  },
  {
    orderIndex: 13,
    category: 'interests',
    questionType: 'single_choice',
    questionText: 'If you could shadow a professional for a day, who would it be?',
    options: [
      { value: 'scientist', label: 'A research scientist in a lab' },
      { value: 'ceo', label: 'A CEO running a company' },
      { value: 'doctor', label: 'A doctor or surgeon' },
      { value: 'artist', label: 'A filmmaker, musician, or artist' },
      { value: 'lawyer', label: 'A lawyer in a courtroom' },
      { value: 'ias', label: 'An IAS officer or government official' },
      { value: 'athlete', label: 'A professional athlete or coach' },
      { value: 'teacher', label: 'A professor or teacher at a top university' },
    ],
  },
  {
    orderIndex: 14,
    category: 'academics',
    questionType: 'multi_choice',
    questionText: 'Which subjects did you find challenging in Class 12? (They might actually point to hidden strengths)',
    options: [
      { value: 'math', label: 'Mathematics' },
      { value: 'physics', label: 'Physics' },
      { value: 'chemistry', label: 'Chemistry' },
      { value: 'biology', label: 'Biology' },
      { value: 'english', label: 'English or Communication' },
      { value: 'history', label: 'History / Civics' },
      { value: 'economics', label: 'Economics' },
      { value: 'none', label: 'None — I managed well in all subjects' },
    ],
  },
  {
    orderIndex: 15,
    category: 'goals',
    questionType: 'scale',
    questionText: 'How important is earning a high income to your career choice?',
    options: [
      { value: '1', label: 'Not important — I care more about passion' },
      { value: '2', label: 'Slightly important' },
      { value: '3', label: 'Moderately important — I want a balance' },
      { value: '4', label: 'Very important' },
      { value: '5', label: 'Extremely important — income is my top priority' },
    ],
  },
  {
    orderIndex: 16,
    category: 'personality',
    questionType: 'single_choice',
    questionText: 'What kind of work environment would make you happiest?',
    options: [
      { value: 'office', label: 'A structured office with clear processes' },
      { value: 'outdoor', label: 'Outdoors or fieldwork' },
      { value: 'remote', label: 'Remote — work from anywhere' },
      { value: 'hospital', label: 'Hospital, clinic, or social setting' },
      { value: 'startup', label: 'A fast-paced startup' },
      { value: 'creative', label: 'A creative studio or media company' },
    ],
  },
  {
    orderIndex: 17,
    category: 'skills',
    questionType: 'single_choice',
    questionText: 'Which of these skills do you most want to develop?',
    options: [
      { value: 'communication', label: 'Communication and public speaking' },
      { value: 'technical', label: 'Technical / coding / engineering skills' },
      { value: 'leadership', label: 'Leadership and management' },
      { value: 'creative', label: 'Creative and design skills' },
      { value: 'analytical', label: 'Analytical and data interpretation' },
      { value: 'research', label: 'Research and academic writing' },
    ],
  },
  {
    orderIndex: 18,
    category: 'interests',
    questionType: 'text',
    questionText: 'Is there a person (family member, celebrity, leader) whose career you admire? What do you admire about it?',
    options: null,
  },
  {
    orderIndex: 19,
    category: 'goals',
    questionType: 'text',
    questionText: 'What is one thing about your future career that worries or confuses you the most?',
    options: null,
  },
  {
    orderIndex: 20,
    category: 'personality',
    questionType: 'text',
    questionText: 'Describe a moment when you felt truly proud of something you accomplished. What was it, and why did it make you proud?',
    options: null,
  },
];

const PAID_EXTRA_QUESTIONS = EARLY_SECONDARY_PAID_EXTRA_QUESTIONS;

/* ─────────────────────────────────────────────────────────────
   HINDI (hi) question bank
   ──────────────────────────────────────────────────────────── */

const EARLY_SECONDARY_FREE_QUESTIONS_HI = [
  {
    orderIndex: 1,
    category: 'academics',
    questionType: 'single_choice',
    questionText: 'School में तुम्हें कौन सा subject सबसे ज़्यादा पसंद है?',
    options: [
      { value: 'science', label: 'Science (Physics, Chemistry, Biology)' },
      { value: 'math', label: 'Mathematics' },
      { value: 'commerce', label: 'Commerce और Accounts' },
      { value: 'humanities', label: 'Humanities और Social Studies' },
      { value: 'arts', label: 'Arts और Craft' },
      { value: 'languages', label: 'Languages और Literature' },
    ],
  },
  {
    orderIndex: 2,
    category: 'interests',
    questionType: 'single_choice',
    questionText: 'School के बाहर तुम्हें कौन सी activities enjoy करना पसंद है?',
    options: [
      { value: 'tech', label: 'Computers, coding या technology' },
      { value: 'sports', label: 'Sports या fitness' },
      { value: 'music', label: 'Music, singing या dancing' },
      { value: 'drawing', label: 'Drawing, painting या design' },
      { value: 'reading', label: 'Books पढ़ना या stories लिखना' },
      { value: 'helping', label: 'Community में लोगों की help करना' },
    ],
  },
  {
    orderIndex: 3,
    category: 'personality',
    questionType: 'single_choice',
    questionText: 'खुद को best describe करने के लिए तुम क्या कहोगे?',
    options: [
      { value: 'analytical', label: 'Analytical — मुझे problems solve करना अच्छा लगता है' },
      { value: 'creative', label: 'Creative — मुझे नई चीज़ें बनाना पसंद है' },
      { value: 'social', label: 'Social — मुझे लोगों के साथ काम करना अच्छा लगता है' },
      { value: 'organised', label: 'Organised — मुझे planning और order पसंद है' },
      { value: 'adventurous', label: 'Adventurous — मुझे risks लेना पसंद है' },
      { value: 'caring', label: 'Caring — मुझे दूसरों की help करना अच्छा लगता है' },
    ],
  },
  {
    orderIndex: 4,
    category: 'goals',
    questionType: 'single_choice',
    questionText: 'तुम्हारा सबसे बड़ा dream क्या है?',
    options: [
      { value: 'stability', label: 'एक stable और safe income कमाना' },
      { value: 'impact', label: 'Society पर positive impact डालना' },
      { value: 'fame', label: 'Famous या well-recognised बनना' },
      { value: 'entrepreneur', label: 'अपना खुद का business शुरू करना' },
      { value: 'explore', label: 'Travel करना और दुनिया explore करना' },
      { value: 'passion', label: 'अपने passion को follow करना' },
    ],
  },
  {
    orderIndex: 5,
    category: 'skills',
    questionType: 'single_choice',
    questionText: 'इनमें से कौन सी चीज़ तुम्हें सबसे naturally आती है?',
    options: [
      { value: 'writing', label: 'Writing और ideas explain करना' },
      { value: 'building', label: 'चीज़ें बनाना या ठीक करना' },
      { value: 'leading', label: 'Groups को lead और organise करना' },
      { value: 'calculating', label: 'Data calculate और analyse करना' },
      { value: 'performing', label: 'Audience के सामने perform या present करना' },
      { value: 'researching', label: 'Research करना और नई knowledge discover करना' },
    ],
  },
  {
    orderIndex: 6,
    category: 'academics',
    questionType: 'single_choice',
    questionText: 'Overall तुम्हारी academic grades कैसी हैं?',
    options: [
      { value: 'excellent', label: 'Excellent — 90% से ऊपर आता है' },
      { value: 'good', label: 'Good — 75%–90% के बीच' },
      { value: 'average', label: 'Average — 50%–75% के बीच' },
      { value: 'working', label: 'अभी improve कर रहा/रही हूँ' },
    ],
  },
  {
    orderIndex: 7,
    category: 'interests',
    questionType: 'multi_choice',
    questionText: 'इनमें से कौन से career fields interesting लगते हैं? (जितने चाहो select करो)',
    options: [
      { value: 'engineering', label: 'Engineering और Technology' },
      { value: 'medicine', label: 'Medicine और Healthcare' },
      { value: 'business', label: 'Business और Finance' },
      { value: 'design', label: 'Design, Arts और Media' },
      { value: 'law', label: 'Law और Policy' },
      { value: 'education', label: 'Education और Research' },
      { value: 'defence', label: 'Defence और Government Services' },
      { value: 'sports', label: 'Sports और Fitness' },
    ],
  },
  {
    orderIndex: 8,
    category: 'personality',
    questionType: 'scale',
    questionText: 'बिना supervision के अकेले काम करने में तुम कितने comfortable हो?',
    options: [
      { value: '1', label: 'बिल्कुल comfortable नहीं' },
      { value: '2', label: 'थोड़ा comfortable' },
      { value: '3', label: 'Moderately comfortable' },
      { value: '4', label: 'बहुत comfortable' },
      { value: '5', label: 'पूरी तरह self-driven हूँ' },
    ],
  },
  {
    orderIndex: 9,
    category: 'goals',
    questionType: 'single_choice',
    questionText: 'Class 10 के बाद तुम सबसे likely क्या करोगे?',
    options: [
      { value: 'science', label: 'Science stream (PCM/PCB) लेगा/लेगी' },
      { value: 'commerce', label: 'Commerce stream लेगा/लेगी' },
      { value: 'arts', label: 'Arts/Humanities stream लेगा/लेगी' },
      { value: 'vocational', label: 'Vocational या diploma course करेगा/करेगी' },
      { value: 'work', label: 'काम शुरू करेगा/करेगी या internship करेगा/करेगी' },
      { value: 'unsure', label: 'अभी sure नहीं हूँ' },
    ],
  },
  {
    orderIndex: 10,
    category: 'skills',
    questionType: 'text',
    questionText: '1-2 sentences में बताओ — career में तुम क्या करना चाहते/चाहती हो? (कोई गलत जवाब नहीं है!)',
    options: null,
  },
];

const FREE_QUESTIONS_HI = EARLY_SECONDARY_FREE_QUESTIONS_HI;

const EARLY_SECONDARY_PAID_EXTRA_QUESTIONS_HI = [
  {
    orderIndex: 11,
    category: 'personality',
    questionType: 'multi_choice',
    questionText: 'ज़िंदगी में तुम्हें सबसे ज़्यादा क्या motivate करता है? (3 तक select करो)',
    options: [
      { value: 'money', label: 'Financial success और पैसा' },
      { value: 'recognition', label: 'Achievement और recognition' },
      { value: 'curiosity', label: 'नई चीज़ें सीखना' },
      { value: 'family', label: 'Family के लिए provide करना' },
      { value: 'creativity', label: 'Creativity express करना' },
      { value: 'meaning', label: 'Meaning और purpose ढूंढना' },
      { value: 'freedom', label: 'Freedom और flexibility' },
    ],
  },
  {
    orderIndex: 12,
    category: 'skills',
    questionType: 'single_choice',
    questionText: 'कोई complex problem मिले तो तुम्हारी पहली instinct क्या होती है?',
    options: [
      { value: 'research', label: 'Act करने से पहले अच्छे से research करता/करती हूँ' },
      { value: 'experiment', label: 'अलग solutions try करता/करती हूँ और करते-करते सीखता/सीखती हूँ' },
      { value: 'discuss', label: 'दूसरों से discuss करता/करती हूँ' },
      { value: 'systematic', label: 'छोटे-छोटे systematic steps में break करता/करती हूँ' },
      { value: 'intuition', label: 'Gut feeling से जाता/जाती हूँ' },
    ],
  },
  {
    orderIndex: 13,
    category: 'interests',
    questionType: 'single_choice',
    questionText: 'अगर एक दिन किसी professional के साथ shadow करने का मौका मिले तो कौन होगा?',
    options: [
      { value: 'scientist', label: 'Lab में एक research scientist' },
      { value: 'ceo', label: 'एक company run करने वाला CEO' },
      { value: 'doctor', label: 'एक doctor या surgeon' },
      { value: 'artist', label: 'एक filmmaker, musician या artist' },
      { value: 'lawyer', label: 'Court में एक lawyer' },
      { value: 'ias', label: 'एक IAS officer या government official' },
      { value: 'athlete', label: 'एक professional athlete या coach' },
      { value: 'teacher', label: 'किसी top university में professor या teacher' },
    ],
  },
  {
    orderIndex: 14,
    category: 'academics',
    questionType: 'multi_choice',
    questionText: 'कौन से subjects challenging लगते हैं? (ये hidden strengths भी point कर सकते हैं)',
    options: [
      { value: 'math', label: 'Mathematics' },
      { value: 'physics', label: 'Physics' },
      { value: 'chemistry', label: 'Chemistry' },
      { value: 'biology', label: 'Biology' },
      { value: 'english', label: 'English या Communication' },
      { value: 'history', label: 'History / Civics' },
      { value: 'economics', label: 'Economics' },
      { value: 'none', label: 'कोई नहीं — सब subjects ठीक जाते हैं' },
    ],
  },
  {
    orderIndex: 15,
    category: 'goals',
    questionType: 'scale',
    questionText: 'Career choice में high income कमाना तुम्हारे लिए कितना important है?',
    options: [
      { value: '1', label: 'Important नहीं — passion ज़्यादा matter करता है' },
      { value: '2', label: 'थोड़ा important' },
      { value: '3', label: 'Moderately important — balance चाहिए' },
      { value: '4', label: 'बहुत important' },
      { value: '5', label: 'बेहद important — income सबसे पहले है' },
    ],
  },
  {
    orderIndex: 16,
    category: 'personality',
    questionType: 'single_choice',
    questionText: 'कैसा work environment तुम्हें सबसे खुश रखेगा?',
    options: [
      { value: 'office', label: 'एक structured office जहाँ clear processes हों' },
      { value: 'outdoor', label: 'Outdoors या fieldwork' },
      { value: 'remote', label: 'Remote — कहीं से भी काम करूँ' },
      { value: 'hospital', label: 'Hospital, clinic या social setting' },
      { value: 'startup', label: 'एक fast-paced startup' },
      { value: 'creative', label: 'एक creative studio या media company' },
    ],
  },
  {
    orderIndex: 17,
    category: 'skills',
    questionType: 'single_choice',
    questionText: 'इनमें से कौन सी skill तुम सबसे ज़्यादा develop करना चाहते/चाहती हो?',
    options: [
      { value: 'communication', label: 'Communication और public speaking' },
      { value: 'technical', label: 'Technical / coding / engineering skills' },
      { value: 'leadership', label: 'Leadership और management' },
      { value: 'creative', label: 'Creative और design skills' },
      { value: 'analytical', label: 'Analytical और data interpretation' },
      { value: 'research', label: 'Research और academic writing' },
    ],
  },
  {
    orderIndex: 18,
    category: 'interests',
    questionType: 'text',
    questionText: 'कोई ऐसा इंसान है (family member, celebrity, leader) जिसका career तुम्हें admire करता है? उसमें क्या चीज़ पसंद है?',
    options: null,
  },
  {
    orderIndex: 19,
    category: 'goals',
    questionType: 'text',
    questionText: 'अपने future career के बारे में तुम्हें सबसे ज़्यादा कौन सी चीज़ confuse या worry करती है?',
    options: null,
  },
  {
    orderIndex: 20,
    category: 'personality',
    questionType: 'text',
    questionText: 'वो moment describe करो जब तुम किसी चीज़ पर clearly proud feel किया हो। क्या था वो और क्यों proud था/थी?',
    options: null,
  },
];

const PAID_EXTRA_QUESTIONS_HI = EARLY_SECONDARY_PAID_EXTRA_QUESTIONS_HI;

/**
 * Returns the appropriate question bank based on language, planType, and standard.
 * @param {'en'|'hi'} language
 * @param {'free'|'paid'} planType
 * @param {string} standard - The student's current standard/class
 * @returns {Array}
 */
function getStaticQuestions(language = 'en', planType = 'free', standard = '8th') {
  // Determine question set based on standard
  let isEarlySecondary = ['8th', '9th', '10th'].includes(standard);
  let isHigherSecondary = ['11th Science', '11th Commerce', '11th Arts/Humanities', '12th Science', '12th Commerce', '12th Arts/Humanities'].includes(standard);
  let isGraduated = standard === 'Graduated (Class 12 done)';

  let base, extra;

  if (language === 'hi') {
    if (isEarlySecondary) {
      base = EARLY_SECONDARY_FREE_QUESTIONS_HI;
      extra = planType === 'paid' ? EARLY_SECONDARY_PAID_EXTRA_QUESTIONS_HI : [];
    } else if (isHigherSecondary) {
      // For now, use early secondary for higher secondary too (can be customized later)
      base = EARLY_SECONDARY_FREE_QUESTIONS_HI;
      extra = planType === 'paid' ? EARLY_SECONDARY_PAID_EXTRA_QUESTIONS_HI : [];
    } else if (isGraduated) {
      // For now, use early secondary for graduated too (can be customized later)
      base = EARLY_SECONDARY_FREE_QUESTIONS_HI;
      extra = planType === 'paid' ? EARLY_SECONDARY_PAID_EXTRA_QUESTIONS_HI : [];
    } else {
      base = EARLY_SECONDARY_FREE_QUESTIONS_HI;
      extra = planType === 'paid' ? EARLY_SECONDARY_PAID_EXTRA_QUESTIONS_HI : [];
    }
  } else {
    if (isEarlySecondary) {
      base = EARLY_SECONDARY_FREE_QUESTIONS;
      extra = planType === 'paid' ? EARLY_SECONDARY_PAID_EXTRA_QUESTIONS : [];
    } else if (isHigherSecondary) {
      base = HIGHER_SECONDARY_FREE_QUESTIONS;
      extra = planType === 'paid' ? HIGHER_SECONDARY_PAID_EXTRA_QUESTIONS : [];
    } else if (isGraduated) {
      base = GRADUATED_FREE_QUESTIONS;
      extra = planType === 'paid' ? GRADUATED_PAID_EXTRA_QUESTIONS : [];
    } else {
      base = EARLY_SECONDARY_FREE_QUESTIONS;
      extra = planType === 'paid' ? EARLY_SECONDARY_PAID_EXTRA_QUESTIONS : [];
    }
  }

  return [...base, ...extra];
}

module.exports = { FREE_QUESTIONS, PAID_EXTRA_QUESTIONS, FREE_QUESTIONS_HI, PAID_EXTRA_QUESTIONS_HI, getStaticQuestions };
