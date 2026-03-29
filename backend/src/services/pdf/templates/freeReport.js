'use strict';

/* ─────────────────────────────────────────────────────────────────────────────
   FREE Report HTML Template
   Brand palette: CAD Gurukul green (#0D9A58) + gold yellow (#F5C400)
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
    badge:           'FREE REPORT',
    tagline:         'Your Personal Career Counseling Report',
    greeting:        (name) => `Awesome, ${name}! Your Report is Ready!`,
    careerOverview:  'Your Career Overview',
    keyStrengths:    'Your Top Strengths',
    careerPaths:     'Best Career Paths For You',
    nextSteps:       'What To Do Next',
    motivation:      'Your Motivational Edge',
    upgradeHeadline: 'Unlock Your Full Report — Just ₹499!',
    upgradeDesc:     'Get 6+ career paths, deep personality insights, academic roadmap & a personalised action plan.',
    upgradeBtn:      'Upgrade Now →',
    generatedOn:     'Generated on',
    highMatch:       'High Match',
    medMatch:       'Medium Match',
    lowMatch:        'Low Match',
  },
  hi: {
    badge:           'FREE REPORT',
    tagline:         'Tumhara Personal Career Counseling Report',
    greeting:        (name) => `Wah ${name}! Tumhara Report Ready Hai!`,
    careerOverview:  'Tumhara Career Overview',
    keyStrengths:    'Tumhari Top Strengths',
    careerPaths:     'Best Career Paths for You',
    nextSteps:       'Agle Steps (Kya Karo Abhi)',
    motivation:      'Tumhara Motivational Edge',
    upgradeHeadline: 'Full Report Unlock Karo — Sirf ₹499!',
    upgradeDesc:     '6+ career paths, deep personality insights aur personalised action plan pao.',
    upgradeBtn:      'Abhi Upgrade Karo →',
    generatedOn:     'Date',
    highMatch:       'High Match',
    medMatch:       'Medium Match',
    lowMatch:        'Low Match',
  },
};

// Rotating colors for strength pills
const PILL_COLORS = [
  { bg: '#DCFCE7', color: '#064E3B', dot: '#0D9A58' },
  { bg: '#FFFDE6', color: '#5C3D00', dot: '#D4A800' },
  { bg: '#DCFCE7', color: '#064E3B', dot: '#34C077' },
  { bg: '#FFFDE6', color: '#5C3D00', dot: '#F5C400' },
  { bg: '#DCFCE7', color: '#064E3B', dot: '#0D9A58' },
  { bg: '#FFFDE6', color: '#5C3D00', dot: '#D4A800' },
];

// Rotating stripe/number badge colors for career cards
const CARD_STRIPES  = ['#0D9A58', '#D4A800', '#34C077', '#0D9A58', '#D4A800', '#34C077'];
const CARD_NUM_BG   = ['#0D9A58', '#F5C400', '#34C077', '#0D9A58', '#F5C400', '#34C077'];
const CARD_NUM_FG   = ['#FFFFFF', '#064E3B', '#FFFFFF', '#FFFFFF', '#064E3B', '#FFFFFF'];

// ── Partial renderers ────────────────────────────────────────────────────────

function renderStrengthTags(strengths = []) {
  if (!strengths.length) return '<p style="color:#6B7280;font-size:10pt;">No strengths listed.</p>';
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
    High:   { bg: '#0D9A58', color: '#FFFFFF', label: L.highMatch },
    Medium: { bg: '#F5C400', color: '#064E3B', label: L.medMatch  },
    Low:    { bg: '#DCFCE7', color: '#064E3B', label: L.lowMatch  },
  };
  const s = map[fit] || map.Medium;
  return `<span class="fit-badge" style="background:${s.bg};color:${s.color};">${esc(s.label)}</span>`;
}

function renderCareerCards(careers = [], limit, L) {
  return (limit ? careers.slice(0, limit) : careers).map((c, i) => {
    const stripe = CARD_STRIPES[i % CARD_STRIPES.length];
    const numBg  = CARD_NUM_BG[i % CARD_NUM_BG.length];
    const numFg  = CARD_NUM_FG[i % CARD_NUM_FG.length];
    return `
    <div class="career-card">
      <div class="career-stripe" style="background:${stripe};"></div>
      <div class="career-body">
        <div class="career-row">
          <span class="career-num" style="background:${numBg};color:${numFg};">${i + 1}</span>
          <span class="career-title" style="color:#064E3B;">${esc(c.title || 'Career Path')}</span>
          ${fitBadgeHTML(c.fit, L)}
        </div>
        ${c.description ? `<p class="career-desc">${esc(c.description)}</p>` : ''}
      </div>
    </div>`;
  }).join('');
}

function renderSteps(steps = [], limit = 4) {
  return steps.slice(0, limit).map((s, i) => {
    const even    = i % 2 === 0;
    const numBg   = even ? '#0D9A58' : '#F5C400';
    const numFg   = even ? '#FFFFFF' : '#064E3B';
    return `
    <div class="step-row">
      <span class="step-num" style="background:${numBg};color:${numFg};">${i + 1}</span>
      <span class="step-text">${esc(s)}</span>
    </div>`;
  }).join('');
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
    background: #FFFFFF;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* ── Header ─────────────────────────────────────────── */
  .rh {
    background: #0D9A58;
    padding: 36px 44px 54px;
    position: relative;
    overflow: hidden;
  }

  /* Canva-style decorative blobs */
  .blob {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
  }
  .b1 { width: 200px; height: 200px; background: #F5C400; top: -65px; right: -40px; opacity: .92; }
  .b2 { width: 130px; height: 130px; background: #34C077; bottom: -50px; left: -35px; opacity: .75; }
  .b3 { width:  65px; height:  65px; background: #DCFCE7; bottom:  8px; left:  75px; opacity: .55; }

  .header-badge {
    position: absolute; top: 18px; right: 44px;
    background: #F5C400; color: #064E3B;
    font-weight: 800; font-size: 9pt; letter-spacing: .06em;
    padding: 5px 20px; border-radius: 20px; z-index: 2;
  }

  .co-name {
    color: #FFFFFF; font-size: 28pt; font-weight: 800;
    letter-spacing: -.02em; position: relative; z-index: 2;
    margin-bottom: 5px;
  }

  .co-tagline {
    color: #DCFCE7; font-size: 10.5pt; margin-bottom: 20px;
    position: relative; z-index: 2;
  }

  .greeting {
    color: #F5C400; font-size: 18pt; font-weight: 700;
    position: relative; z-index: 2; max-width: 78%;
  }

  /* ── Student Info Card ───────────────────────────────── */
  .student-card {
    background: #DCFCE7;
    margin: 20px 44px 0;
    border-radius: 10px;
    padding: 14px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-left: 7px solid #0D9A58;
  }
  .s-name { font-size: 14pt; font-weight: 700; color: #064E3B; }
  .s-meta { font-size: 9pt; color: #6B7280; margin-top: 4px; }
  .s-date { font-size: 9pt; color: #6B7280; white-space: nowrap; }

  /* ── Content Wrapper ────────────────────────────────── */
  .content { padding: 18px 44px 8px; }

  /* ── Section ────────────────────────────────────────── */
  .section { margin-bottom: 20px; page-break-inside: avoid; }

  .sec-title {
    padding: 9px 18px;
    border-radius: 7px;
    font-size: 12pt;
    font-weight: 700;
    margin-bottom: 12px;
  }
  .sec-green  { background: #0D9A58; color: #FFFFFF; border-left: 7px solid #064E3B; }
  .sec-yellow { background: #F5C400; color: #064E3B; border-left: 7px solid #A07800; }

  .sec-body {
    font-size: 10.5pt; color: #374151; line-height: 1.65; padding: 0 4px;
  }

  /* ── Strength Pills ─────────────────────────────────── */
  .pills { display: flex; flex-wrap: wrap; gap: 8px; padding: 2px 0; }

  .pill {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 5px 14px 5px 10px; border-radius: 20px;
    font-size: 10pt; font-weight: 600;
  }
  .pill-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

  /* ── Career Cards ───────────────────────────────────── */
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
  .fit-badge {
    font-size: 8.5pt; font-weight: 700;
    padding: 3px 12px; border-radius: 12px;
  }
  .career-desc { font-size: 10pt; color: #374151; line-height: 1.6; }

  /* ── Steps ──────────────────────────────────────────── */
  .step-row {
    display: flex; align-items: flex-start; gap: 12px;
    margin-bottom: 10px; page-break-inside: avoid;
  }
  .step-num {
    width: 26px; height: 26px; border-radius: 50%;
    display: inline-flex; align-items: center; justify-content: center;
    font-size: 10pt; font-weight: 700; flex-shrink: 0; margin-top: 1px;
  }
  .step-text { font-size: 10.5pt; color: #374151; line-height: 1.6; flex: 1; }

  /* ── Motivation Box ──────────────────────────────────── */
  .motivation {
    background: #DCFCE7; border-radius: 10px; padding: 18px 22px;
    border-top: 6px solid #0D9A58; margin-bottom: 20px;
    page-break-inside: avoid;
  }
  .motivation-text {
    font-size: 11pt; color: #064E3B; font-style: italic; line-height: 1.7;
  }

  /* ── Upgrade CTA ─────────────────────────────────────── */
  .upgrade {
    background: #FFFDE6; border-radius: 10px; padding: 20px 24px;
    border-top: 7px solid #0D9A58; margin-bottom: 22px;
    page-break-inside: avoid; position: relative; overflow: hidden;
  }
  .up-blob1 {
    position: absolute; width: 36px; height: 36px; background: #F5C400;
    border-radius: 50%; bottom: 12px; right: 18px; opacity: .7;
  }
  .up-blob2 {
    position: absolute; width: 22px; height: 22px; background: #DCFCE7;
    border-radius: 50%; top: 10px; left: 12px; opacity: .8;
  }
  .up-headline {
    font-size: 14pt; font-weight: 800; color: #064E3B;
    margin-bottom: 8px; position: relative; z-index: 1;
  }
  .up-desc {
    font-size: 10pt; color: #374151; margin-bottom: 12px;
    max-width: 86%; position: relative; z-index: 1;
  }
  .up-link {
    font-size: 10.5pt; font-weight: 700; color: #0D9A58;
    text-decoration: underline; position: relative; z-index: 1;
    word-break: break-all;
  }

  /* ── Footer ──────────────────────────────────────────── */
  .footer-green {
    background: #0D9A58; padding: 12px 44px; text-align: center;
  }
  .footer-yellow { background: #F5C400; height: 7px; }
  .footer-text { color: #FFFFFF; font-size: 8.5pt; }
`;

// ── Main builder ─────────────────────────────────────────────────────────────

/**
 * Build the HTML string for the FREE career report.
 *
 * @param {object} opts
 * @param {object} opts.student        – { name, standard, age, email }
 * @param {object} opts.report         – LLM report object
 * @param {string} [opts.upgradeToken] – token for upgrade URL
 * @param {object} opts.company        – { name, email, website, address }
 * @param {string} [opts.language]     – 'en' | 'hi'
 */
function buildFreeReportHTML({ student, report = {}, upgradeToken, company, language = 'en' }) {
  const L = LABELS[language] || LABELS.en;
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
  const upgradeUrl = upgradeToken
    ? `${company.website}/upgrade?token=${upgradeToken}`
    : company.website;

  const metaParts = [
    student.standard ? `Class ${esc(student.standard)}` : null,
    student.age      ? `Age ${esc(String(student.age))}`  : null,
    student.email    ? esc(student.email)                  : null,
  ].filter(Boolean);

  return `<!DOCTYPE html>
<html lang="${language === 'hi' ? 'hi' : 'en'}">
<head>
  <meta charset="UTF-8">
  <title>Career Report — ${esc(student.name)}</title>
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

  <!-- Career Overview -->
  <div class="section">
    <div class="sec-title sec-green">${esc(L.careerOverview)}</div>
    <p class="sec-body">${esc(report.summary || 'Based on your responses, here is a personalised overview of your career potential.')}</p>
  </div>

  <!-- Key Strengths -->
  <div class="section">
    <div class="sec-title sec-yellow">${esc(L.keyStrengths)}</div>
    <div class="pills">${renderStrengthTags(report.strengths)}</div>
  </div>

  <!-- Career Paths (top 3) -->
  <div class="section">
    <div class="sec-title sec-green">${esc(L.careerPaths)}</div>
    ${renderCareerCards(report.careerSuggestions, 3, L)}
  </div>

  <!-- Next Steps -->
  <div class="section">
    <div class="sec-title sec-yellow">${esc(L.nextSteps)}</div>
    ${renderSteps(report.nextSteps, 4)}
  </div>

  ${report.motivation ? `
  <!-- Motivation -->
  <div class="motivation">
    <p class="motivation-text">"${esc(report.motivation)}"</p>
  </div>` : ''}

  ${upgradeToken ? `
  <!-- Upgrade CTA -->
  <div class="upgrade">
    <div class="up-blob1"></div>
    <div class="up-blob2"></div>
    <div class="up-headline">${esc(L.upgradeHeadline)}</div>
    <p class="up-desc">${esc(L.upgradeDesc)}</p>
    <a class="up-link" href="${esc(upgradeUrl)}">${esc(L.upgradeBtn)} ${esc(upgradeUrl)}</a>
  </div>` : ''}

</div><!-- /content -->

<!-- ═══ FOOTER ══════════════════════════════════════════════════════════════ -->
<div class="footer-green">
  <div class="footer-text">
    ${esc(company.name)}  ·  ${esc(company.email)}  ·  ${esc(company.address || 'India')}
  </div>
</div>
<div class="footer-yellow"></div>

</body>
</html>`;
}

module.exports = { buildFreeReportHTML };
