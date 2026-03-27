import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor for consistent error handling
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const message =
      err.response?.data?.message ||
      err.message ||
      'Something went wrong. Please try again.';
    return Promise.reject(new Error(message));
  }
);

// ─── Student ─────────────────────────────────────────────────
export const registerStudent = (data) => api.post('/students/register', data);

// ─── Payments ────────────────────────────────────────────────
export const createPaymentOrder = (data) => api.post('/payments/create-order', data);
export const verifyPayment = (data) => api.post('/payments/verify', data);
export const recordPaymentFailure = (data) => api.post('/payments/failure', data);
export const getUpgradeInfo = (token) => api.get(`/payments/upgrade-info?token=${encodeURIComponent(token)}`);

// ─── Questionnaire ────────────────────────────────────────────
export const getQuestions = (assessmentId) => api.get(`/questionnaire/questions/${assessmentId}`);
export const submitAnswers = (data) => api.post('/questionnaire/answers', data);

// ─── Reports ──────────────────────────────────────────────────
export const generateReport = (assessmentId) => api.post('/reports/generate', { assessmentId });
export const resendReport = (email) => api.post('/reports/resend', { email });

export default api;
