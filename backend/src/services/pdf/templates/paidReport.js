'use strict';

/* ─────────────────────────────────────────────────────────────────────────────
   PAID (PREMIUM) Report HTML Template
   Brand palette: Purple → Pink → Green → Sky → Yellow → Coral rotation
   Layout inspired by the Canva education brochure style.
───────────────────────────────────────────────────────────────────────────── */

/** Safely escape a value for HTML text content */
const esc = (val) => {
  if (val == null) return '';
  return String(val)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

const LABELS = {
  en: {
    badge:             'PREMIUM',
    tagline:           'Your Personalised Career Analysis Report',
    greeting:          (name) => `Awesome, ${name}! Your Premium Report is Ready!`,
    executiveSummary:  'Your Career Overview',
    personalityStyle:  'Your Personality Style',
    interestPattern:   'Your Interest Patterns',
    keyStrengths:      'Your Top Strengths',
    personalisedPaths: 'Career Paths Built For You',
    academicRoadmap:   'Your Academic Roadmap',
    actionPlan:        'Your Action Plan',
    motivation:        'Your Motivational Edge',
    contactNudge:      (email) => `For personalised guidance, reach us at ${email}`,
    generatedOn:       'Generated on',
    highMatch:         'High Match',
    medMatch:         'Medium Match',
    lowMatch:          'Low Match',
    howToGetThere:     'How to get there:',
  },
  hi: {
    badge:             'PREMIUM',
    tagline:           'Tumhara Personalised Career Analysis Report',
    greeting:          (name) => `Wah ${name}! Tumhara Premium Report Ready Hai!`,
    executiveSummary:  'Tumhara Career Overview',
    personalityStyle:  'Tumhari Personality Style',
    interestPattern:   'Tumhare Interest Patterns',
    keyStrengths:      'Tumhari Top Strengths',
    personalisedPaths: 'Tumhare Liye Career Paths',
    academicRoadmap:   'Academic Roadmap',
    actionPlan:        'Action Plan',
    motivation:        'Tumhara Motivational Edge',
    contactNudge:      (email) => `Personalized guidance ke liye contact karein: ${email}`,
    generatedOn:       'Date',
    highMatch:         'High Match',
    medMatch:         'Medium Match',
    lowMatch:          'Low Match',
    howToGetThere:     'Is career ke liye kya karein:',
  },
};

// Section color rotation — each section gets a different accent
const SEC_COLORS = [
  { bg: '#7C3AED', fg: '#FFFFFF', border: '#5B21B6', pale: '#EDE9FE', text: '#3B1A8F' }, // purple
  { bg: '#EC4899', fg: '#FFFFFF', border: '#BE185D', pale: '#FCE7F3', text: '#831843' }, // pink
  { bg: '#10B981', fg: '#FFFFFF', border: '#059669', pale: '#D1FAE5', text: '#064E3B' }, // green
  { bg: '#0EA5E9', fg: '#FFFFFF', border: '#0284C7', pale: '#E0F2FE', text: '#0C4A6E' }, // sky
  { bg: '#F59E0B', fg: '#1E1B4B', border: '#D97706', pale: '#FFFBEB', text: '#78350F' }, // yellow
  { bg: '#F43F5E', fg: '#FFFFFF', border: '#BE123C', pale: '#FFE4E6', text: '#880016' }, // coral
];

// Career card stripe colors (paired with section color rotation)
const CARD_STRIPES = SEC_COLORS.map((c) => c.bg);
const CARD_NUM_BG  = SEC_COLORS.map((c) => c.bg);
const CARD_NUM_FG  = SEC_COLORS.map((c) => c.fg);

// ── Partial renderers ────────────────────────────────────────────────────────

function renderStrengthTags(strengths = []) {
  if (!strengths.length) return '<p style="color:#6B7280;font-size:10pt;">No strengths listed.</p>';
  const PILL_COLORS = [
    { bg: '#EDE9FE', color: '#3B1A8F', dot: '#7C3AED' },
    { bg: '#FCE7F3', color: '#831843', dot: '#EC4899' },
    { bg: '#D1FAE5', color: '#064E3B', dot: '#10B981' },
    { bg: '#E0F2FE', color: '#0C4A6E', dot: '#0EA5E9' },
    { bg: '#FFFBEB', color: '#78350F', dot: '#F59E0B' },
    { bg: '#FFE4E6', color: '#880016', dot: '#F43F5E' },
  ];
  return strengths.map((s, i) => {
    const c = PILL_COLORS[i % PILL_COLORS.length];
    return `<span class="pill" style="background:${c.bg};color:${c.color};">
      <span class="pill-dot" style="background:${c.dot};"></span>${esc(s)}
    </span>`;
  }).join('');
}

function fitBadgeHTML(fit, L) {
  if (!fit) return '';
  const map = {
    High:   { bg: '#10B981', color: '#FFFFFF', label: L.highMatch },
    Medium: { bg: '#F59E0B', color: '#1E1B4B', label: L.medMatch  },
    Low:    { bg: '#E0F2FE', color: '#0C4A6E', label: L.lowMatch  },
  };
  const s = map[fit] || map.Medium;
  return `<span class="fit-badge" style="background:${s.bg};color:${s.color};">${esc(s.label)}</span>`;
}

function renderCareerCards(careers = [], L) {
  return careers.map((c, i) => {
    const stripe = CARD_STRIPES[i % CARD_STRIPES.length];
    const numBg  = CARD_NUM_BG[i % CARD_NUM_BG.length];
    const numFg  = CARD_NUM_FG[i % CARD_NUM_FG.length];
    const secC   = SEC_COLORS[i % SEC_COLORS.length];
    return `
    <div class="career-card">
      <div class="career-stripe" style="background:${stripe};"></div>
      <div class="career-body">
        <div class="career-row">
          <span class="career-num" style="background:${numBg};color:${numFg};">${i + 1}</span>
          <span class="career-title" style="color:${secC.text};">${esc(c.title || 'Career Path')}</span>
          ${fitBadgeHTML(c.fit, L)}
        </div>
        ${c.description ? `<p class="career-desc">${esc(c.description)}</p>` : ''}
        ${c.pathway ? `
        <p class="career-pathway-label" style="color:${stripe};">${esc(L.howToGetThere)}</p>
        <p class="career-pathway">${esc(c.pathway)}</p>` : ''}
      </div>
    </div>`;
  }).join('');
}

function renderBullets(items = [], color = '#10B981') {
  return items.map((s, i) => `
    <div class="step-row">
      <span class="bullet-num" style="background:${color};">${i + 1}</span>
      <span class="step-text">${esc(s)}</span>
    </div>`).join('');
}

// ── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `
  @page { size: A4; margin: 0; }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
                 'Helvetica Neue', Arial, sans-serif;
    font-size: 10.5pt;
    line-height: 1.6;
    color: #1F2937;
    background: #FAFAFA;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* ── Header ───────────────────────────────────────────── */
  .rh {
    background: #7C3AED;
    padding: 36px 44px 54px;
    position: relative;
    overflow: hidden;
  }

  .blob { position: absolute; border-radius: 50%; pointer-events: none; }
  .b1 { width: 200px; height: 200px; background: #EC4899; top: -65px; right: -40px; opacity: .85; }
  .b2 { width: 110px; height: 110px; background: #A78BFA; bottom: -40px; left: -30px; opacity: .70; }
  .b3 { width:  70px; height:  70px; background: #0EA5E9; bottom: 8px; left: 78px; opacity: .50; }

  .header-badge {
    position: absolute; top: 18px; right: 44px;
    background: #F59E0B; color: #1E1B4B;
    font-weight: 800; font-size: 9pt; letter-spacing: .08em;
    padding: 5px 22px; border-radius: 20px; z-index: 2;
  }

  .co-name {
    color: #FFFFFF; font-size: 28pt; font-weight: 800;
    letter-spacing: -.02em; position: relative; z-index: 2; margin-bottom: 5px;
  }
  .co-tagline {
    color: #DDD6FE; font-size: 10.5pt; margin-bottom: 20px;
    position: relative; z-index: 2;
  }
  .greeting {
    color: #FDE68A; font-size: 17pt; font-weight: 700;
    position: relative; z-index: 2; max-width: 78%;
  }

  /* ── Student Card ────────────────────────────────────── */
  .student-card {
    background: #EDE9FE;
    margin: 20px 44px 0;
    border-radius: 10px; padding: 14px 20px;
    display: flex; justify-content: space-between; align-items: center;
    border-left: 7px solid #7C3AED;
  }
  .s-name { font-size: 14pt; font-weight: 700; color: #3B1A8F; }
  .s-meta { font-size: 9pt; color: #6B7280; margin-top: 4px; }
  .s-date { font-size: 9pt; color: #6B7280; white-space: nowrap; }

  /* ── Content ─────────────────────────────────────────── */
  .content { padding: 18px 44px 8px; }

  .section { margin-bottom: 20px; page-break-inside: avoid; }

  .sec-title {
    padding: 9px 18px; border-radius: 7px;
    font-size: 12pt; font-weight: 700; margin-bottom: 12px;
  }

  .sec-body {
    font-size: 10.5pt; color: #374151; line-height: 1.65; padding: 0 4px;
  }

  /* ── Strength Pills ──────────────────────────────────── */
  .pills { display: flex; flex-wrap: wrap; gap: 8px; padding: 2px 0; }

  .pill {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 5px 14px 5px 10px; border-radius: 20px;
    font-size: 10pt; font-weight: 600;
  }
  .pill-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

  /* ── Career Cards ────────────────────────────────────── */
  .career-card {
    display: flex; margin-bottom: 10px; border-radius: 8px;
    overflow: hidden; border: 1px solid #E5E7EB;
    page-break-inside: avoid;
  }
  .career-stripe { width: 6px; flex-shrink: 0; }
  .career-body   { padding: 11px 16px; flex: 1; }
  .career-row    { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; flex-wrap: wrap; }
  .career-num {
    width: 28px; height: 28px; border-radius: 50%;
    display: inline-flex; align-items: center; justify-content: center;
    font-size: 10pt; font-weight: 700; flex-shrink: 0;
  }
  .career-title { font-size: 12pt; font-weight: 700; flex: 1; }
  .fit-badge    { font-size: 8.5pt; font-weight: 700; padding: 3px 12px; border-radius: 12px; }
  .career-desc  { font-size: 10pt; color: #374151; line-height: 1.6; margin-bottom: 6px; }

  .career-pathway-label {
    font-size: 9.5pt; font-weight: 700; margin-bottom: 2px;
  }
  .career-pathway { font-size: 9.5pt; color: #374151; line-height: 1.55; }

  /* ── Bullets / Steps ─────────────────────────────────── */
  .step-row {
    display: flex; align-items: flex-start; gap: 12px;
    margin-bottom: 10px; page-break-inside: avoid;
  }
  .bullet-num {
    width: 26px; height: 26px; border-radius: 50%; color: #FFFFFF;
    display: inline-flex; align-items: center; justify-content: center;
    font-size: 10pt; font-weight: 700; flex-shrink: 0; margin-top: 1px;
  }
  .step-text { font-size: 10.5pt; color: #374151; line-height: 1.6; flex: 1; }

  /* ── Motivation Box ──────────────────────────────────── */
  .motivation {
    background: #FCE7F3; border-radius: 10px; padding: 18px 22px;
    border-top: 6px solid #EC4899; margin-bottom: 20px;
    page-break-inside: avoid;
  }
  .motivation-text { font-size: 11pt; color: #831843; font-style: italic; line-height: 1.7; }

  /* ── Contact Nudge ───────────────────────────────────── */
  .contact-nudge {
    font-size: 9.5pt; color: #6B7280; text-align: center;
    padding: 8px 0 14px;
  }

  /* ── Footer ──────────────────────────────────────────── */
  .footer-main {
    background: #7C3AED; padding: 12px 44px; text-align: center;
  }
  .footer-band { background: #F59E0B; height: 7px; }
  .footer-text { color: #FFFFFF; font-size: 8.5pt; }

  /* ── Page break hint ─────────────────────────────────── */
  .pb-before { page-break-before: always; padding-top: 24px; }
`;

// ── Main builder ─────────────────────────────────────────────────────────────

/**
 * Build the HTML string for the PREMIUM career report.
 *
 * @param {object} opts
 * @param {object} opts.student   – { name, standard, age, email }
 * @param {object} opts.report    – LLM report object
 * @param {object} opts.company   – { name, email, website, address }
 * @param {string} [opts.language] – 'en' | 'hi'
 */
function buildPaidReportHTML({ student, report = {}, company, language = 'en' }) {
  const L = LABELS[language] || LABELS.en;
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  const metaParts = [
    student.standard ? `Class ${esc(student.standard)}` : null,
    student.age      ? `Age ${esc(String(student.age))}`  : null,
    student.email    ? esc(student.email)                  : null,
  ].filter(Boolean);

  // Build sections dynamically; each consumes the next slot in SEC_COLORS
  let secIdx = 0;
  const nextSec = () => SEC_COLORS[secIdx++ % SEC_COLORS.length];

  const buildSection = (titleKey, content) => {
    const s = nextSec();
    return `
  <div class="section">
    <div class="sec-title" style="background:${s.bg};color:${s.fg};border-left:7px solid ${s.border};">
      ${esc(L[titleKey])}
    </div>
    ${content}
  </div>`;
  };

  const summarySection = buildSection(
    'executiveSummary',
    `<p class="sec-body">${esc(report.summary || '')}</p>`,
  );

  const personalitySection = report.personalityInsights
    ? buildSection('personalityStyle', `<p class="sec-body">${esc(report.personalityInsights)}</p>`)
    : '';

  const interestSection = report.interestPattern
    ? buildSection('interestPattern', `<p class="sec-body">${esc(report.interestPattern)}</p>`)
    : '';

  const strengthSection = buildSection(
    'keyStrengths',
    `<div class="pills">${renderStrengthTags(report.strengths)}</div>`,
  );

  const careerSection = buildSection(
    'personalisedPaths',
    renderCareerCards(report.careerSuggestions || [], L),
  );

  const academicSection = (report.academicPathways || []).length
    ? buildSection('academicRoadmap', renderBullets(report.academicPathways, '#0EA5E9'))
    : '';

  const s = nextSec();
  const actionSection = `
  <div class="section">
    <div class="sec-title" style="background:${s.bg};color:${s.fg};border-left:7px solid ${s.border};">
      ${esc(L.actionPlan)}
    </div>
    ${renderBullets(report.nextSteps || [], '#10B981')}
  </div>`;

  return `<!DOCTYPE html>
<html lang="${language === 'hi' ? 'hi' : 'en'}">
<head>
  <meta charset="UTF-8">
  <title>Premium Career Report — ${esc(student.name)}</title>
  <style>${CSS}</style>
</head>
<body>

<!-- ═══ HEADER ══════════════════════════════════════════════════════════════ -->
<div class="rh">
  <div class="blob b1"></div>
  <div class="blob b2"></div>
  <div class="blob b3"></div>
  <div class="header-badge">${esc(L.badge)}</div>
  <div class="co-name">${esc(company.name)}</div>
  <div class="co-tagline">${esc(L.tagline)}</div>
  <div class="greeting">${esc(L.greeting(student.name))}</div>
</div>

<!-- ═══ STUDENT CARD ══════════════════════════════════════════════════════════ -->
<div class="student-card">
  <div>
    <div class="s-name">${esc(student.name)}</div>
    <div class="s-meta">${metaParts.join('  ·  ')}</div>
  </div>
  <div class="s-date">${esc(L.generatedOn)}: ${dateStr}</div>
</div>

<!-- ═══ CONTENT ══════════════════════════════════════════════════════════════ -->
<div class="content">

  ${summarySection}
  ${personalitySection}
  ${interestSection}
  ${strengthSection}
  ${careerSection}
  ${academicSection}
  ${actionSection}

  ${report.motivation ? `
  <!-- Motivation -->
  <div class="motivation">
    <p class="motivation-text">"${esc(report.motivation)}"</p>
  </div>` : ''}

  <!-- Contact nudge -->
  <p class="contact-nudge">${esc(L.contactNudge(company.email))}</p>

</div><!-- /content -->

<!-- ═══ FOOTER ══════════════════════════════════════════════════════════════ -->
<div class="footer-main">
  <div class="footer-text">
    ${esc(company.name)}  ·  ${esc(company.email)}  ·  ${esc(company.address || 'India')}
  </div>
</div>
<div class="footer-band"></div>

</body>
</html>`;
}

module.exports = { buildPaidReportHTML };
