# Student Career Counselor

A production-ready full-stack web application by **Akash Universal Solutions** — helping students discover their ideal career path through intelligent counseling, AI-powered assessments, and professional PDF reports.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js 18+ + Express 5 |
| Database | PostgreSQL 15+ |
| Payments | Razorpay |
| PDF Generation | PDFKit |
| Email | Nodemailer (SMTP — Gmail / SendGrid compatible) |
| AI/LLM | OpenAI (primary), Anthropic, Google Gemini (pluggable) |
| Storage | Local filesystem (abstracted for S3 migration) |

---

## Project Structure

```
student-career-counselor/
├── backend/              # Node.js + Express API server
│   ├── database/         # PostgreSQL schema & migrations
│   ├── src/
│   │   ├── config/       # DB config, app config
│   │   ├── middleware/   # Auth, rate limit, validation, error handler
│   │   ├── routes/       # API route handlers
│   │   ├── services/     # LLM, PDF, Email, Payment, Token services
│   │   └── utils/        # Logger, helpers
│   ├── storage/pdfs/     # Generated PDF files (add to .gitignore)
│   └── server.js
├── frontend/             # React 18 + Vite app
│   └── src/
│       ├── components/   # Reusable UI + layout + section components
│       ├── context/      # React Context for global state
│       ├── hooks/        # Custom React hooks
│       ├── pages/        # Route-level page components
│       ├── services/     # Axios API service layer
│       └── utils/        # Frontend utilities
└── README.md
```

---

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- A Razorpay account (test keys for dev)
- An SMTP email account (Gmail app password works)
- Optional: OpenAI / Anthropic / Gemini API key

### 1. Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment

```bash
# Backend
cp .env.example .env
# Edit backend/.env with your values

# Frontend
cp .env.example .env
# Edit frontend/.env with your values
```

### 3. Set Up Database

```bash
# Create the database
createdb student_career_counselor

# Run schema
psql -d student_career_counselor -f backend/database/schema.sql
```

### 4. Start Development Servers

```bash
# Terminal 1 — Backend (port 5000)
cd backend && npm run dev

# Terminal 2 — Frontend (port 5173)
cd frontend && npm run dev
```

Visit http://localhost:5173

---

## Key User Flows

### Flow 1: Free Report
```
Home → Click "Free Report" → Intake Form (Name/Age/Class/Email)
→ Questionnaire → Thank You → PDF emailed
```

### Flow 2: Paid Report (₹499)
```
Home → Click "Paid Report" → Intake Form → Razorpay Checkout
→ Payment Success → Questionnaire → Thank You → PDF emailed
```

### Flow 3: Upgrade via Free PDF Link
```
Free PDF → Click Upgrade Link → /upgrade?token=XXX
→ Razorpay Checkout → Payment Success → Paid PDF emailed
```

### Flow 4: Resend Report
```
Footer → "Already took test?" → Enter Email → Report re-sent
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/students/register` | Register student, create assessment |
| POST | `/api/payments/create-order` | Create Razorpay order |
| POST | `/api/payments/verify` | Verify payment signature |
| GET | `/api/payments/upgrade-info` | Validate upgrade token |
| GET | `/api/questionnaire/questions/:assessmentId` | Get questions |
| POST | `/api/questionnaire/answers` | Submit answers |
| POST | `/api/reports/generate` | Generate & email PDF report |
| POST | `/api/reports/resend` | Resend report to email |
| GET | `/api/health` | Health check |

---

## AI / LLM Architecture

The LLM layer is fully abstracted via a provider pattern:

```
LLMFactory → picks provider from config (openai / anthropic / gemini)
           → falls back to static question bank if LLM is unavailable
           → logs all prompts/responses to llm_logs table
```

To swap providers, change `LLM_PROVIDER=openai` in `.env`.

**What the LLM does:**
1. Generates tailored questionnaire questions based on student profile
2. Analyzes answers and generates structured report content
3. Free report: shorter prompt, high-level guidance
4. Paid report: detailed prompt, deep personalized analysis

---

## Security

- Razorpay signature verified with HMAC-SHA256 on backend (never on frontend)
- Upgrade links use signed HMAC tokens with 30-day expiry
- Rate limiting on all sensitive endpoints
- Helmet.js for HTTP security headers
- Joi validation on all inputs
- No API keys exposed on frontend
- PDFs served via token-protected static paths

---

## Deployment

| Component | Recommended Platform |
|---|---|
| Frontend | Vercel / Netlify |
| Backend | Railway / Render / EC2 |
| Database | Supabase / Railway PostgreSQL / RDS |
| PDF Storage | Local → migrate to AWS S3 / Cloudflare R2 |
| Email | SendGrid SMTP / Gmail / AWS SES |

---

## Contact

**Akash Universal Solutions**
- Email: adish@akashuniversalsolutions.com
- Address: 31/3, Channi Himmat, Jammu (J&K), India
