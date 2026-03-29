'use strict';
const PDFDocument = require('pdfkit');
const config = require('../../config/config');
const StorageService = require('../storage/StorageService');
const logger = require('../../utils/logger');

// ── Vibrant student-friendly palette ─────────────────────────────────────────
const C = {
  // Primary — vivid purple/violet
  purple:       '#7C3AED',
  purpleLight:  '#A78BFA',
  purplePale:   '#EDE9FE',
  // Accent — hot pink / coral
  pink:         '#EC4899',
  pinkLight:    '#F9A8D4',
  pinkPale:     '#FCE7F3',
  // Fun green
  green:        '#10B981',
  greenLight:   '#6EE7B7',
  greenPale:    '#D1FAE5',
  // Sunny yellow / orange
  yellow:       '#F59E0B',
  yellowLight:  '#FDE68A',
  yellowPale:   '#FFFBEB',
  // Sky blue
  sky:          '#0EA5E9',
  skyLight:     '#BAE6FD',
  skyPale:      '#E0F2FE',
  // Warm coral/red
  coral:        '#F43F5E',
  coralLight:   '#FDA4AF',
  // Neutrals
  dark:         '#1E1B4B',
  bodyText:     '#374151',
  mutedText:    '#6B7280',
  rule:         '#E5E7EB',
  pageBg:       '#FAFAFA',
  white:        '#FFFFFF',
};

// Section accent rotation — keeps each section a different colour
const SECTION_COLORS = [C.purple, C.pink, C.green, C.sky, C.yellow, C.coral, C.purple, C.pink];

// ── Brochure-style palette for the FREE report (green + yellow) ──────────────
const CF = {
  green:       '#0D9A58',
  greenLight:  '#34C077',
  greenPale:   '#DCFCE7',
  greenDark:   '#064E3B',
  yellow:      '#F5C400',
  yellowPale:  '#FFFBE6',
  yellowDark:  '#713F12',
  white:       '#FFFFFF',
  dark:        '#111827',
  bodyText:    '#1F2937',
  mutedText:   '#6B7280',
  rule:        '#D1FAE5',
};

// ── Page constants (A4 in points) ────────────────────────────────────────────
const PW = 595.28;
const PH = 841.89;
const ML = 44;
const CW = PW - ML * 2;

// ── Language label lookup ────────────────────────────────────────────────────
function getLabels(language) {
  if (language === 'hi') {
    return {
      greeting:             (name) => `Wah ${name}! Tumhara Report Ready Hai! 🎉`,
      careerOverview:       '🌟  Tumhara Career Overview',
      keyStrengths:         '💪  Tumhari Super Strengths',
      careerPaths:          '🚀  Best Career Paths for You',
      nextSteps:            '✅  Agle Steps (Kya Karo Abhi)',
      executiveSummary:     '🌟  Tumhara Career Overview',
      personalityStyle:     '🧠  Tumhari Personality Style',
      interestPattern:      '🔍  Tumhare Interest Patterns',
      personalisedPaths:    '🚀  Tumhare Liye Career Paths',
      academicRoadmap:      '📚  Academic Roadmap',
      actionPlan:           '✅  Action Plan',
      pursuePath:           'Is career ke liye kya karein:',
      contactNudge: (email) => `Personalized guidance ke liye hum se contact karein: ${email}`,
    };
  }
  return {
    greeting:             (name) => `Awesome, ${name}! Your Report is Ready! 🎉`,
    careerOverview:       '🌟  Your Career Overview',
    keyStrengths:         '💪  Your Super Strengths',
    careerPaths:          '🚀  Best Career Paths For You',
    nextSteps:            '✅  What To Do Next',
    executiveSummary:     '🌟  Your Career Overview',
    personalityStyle:     '🧠  Your Personality Style',
    interestPattern:      '🔍  Your Interest Patterns',
    personalisedPaths:    '🚀  Career Paths Built For You',
    academicRoadmap:      '📚  Your Academic Roadmap',
    actionPlan:           '✅  Your Action Plan',
    pursuePath:           'How to get there:',
    contactNudge: (email) => `For personalised guidance, reach us at ${email}`,
  };
}

// ── Service ───────────────────────────────────────────────────────────────────
const PDFService = {
  async generate({ student, reportContent, reportType, upgradeToken, language = 'en' }) {
    const timestamp = Date.now();
    const safeName = (student.name || 'student').replace(/[^a-zA-Z0-9]/g, '_').slice(0, 20);
    const filename = `report_${safeName}_${timestamp}.pdf`;
    const key = `pdfs/${filename}`;

    const buffer = await new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 0, bottom: 0, left: 0, right: 0 },
        info: {
          Title: `Career Report — ${student.name}`,
          Author: config.company.name,
          Subject: 'Student Career Counseling',
        },
        autoFirstPage: true,
      });

      const chunks = [];
      doc.on('data', (c) => chunks.push(c));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      if (reportType === 'paid') {
        PDFService._buildPaidReport(doc, student, reportContent, config.company, language);
      } else {
        PDFService._buildFreeReport(doc, student, reportContent, upgradeToken, config.company, language);
      }

      doc.end();
    });

    await StorageService.upload(key, buffer);
    logger.debug('PDF uploaded to Spaces', { key });
    return { filename, key };
  },

  // ── Helpers ──────────────────────────────────────────────────────────────────

  /** Draw a filled rounded rectangle */
  _roundRect(doc, x, y, w, h, r, fillColor) {
    const R = parseInt(fillColor.slice(1, 3), 16);
    const G = parseInt(fillColor.slice(3, 5), 16);
    const B = parseInt(fillColor.slice(5, 7), 16);
    doc.roundedRect(x, y, w, h, r).fillColor(R, G, B).fill();
  },

  /** Draw filled rectangle */
  _rect(doc, x, y, w, h, fillColor) {
    const R = parseInt(fillColor.slice(1, 3), 16);
    const G = parseInt(fillColor.slice(3, 5), 16);
    const B = parseInt(fillColor.slice(5, 7), 16);
    doc.rect(x, y, w, h).fillColor(R, G, B).fill();
  },

  /** Set fill color from hex */
  _fc(doc, h) {
    const R = parseInt(h.slice(1, 3), 16);
    const G = parseInt(h.slice(3, 5), 16);
    const B = parseInt(h.slice(5, 7), 16);
    doc.fillColor(R, G, B);
  },

  /** Set stroke color from hex */
  _sc(doc, h) {
    const R = parseInt(h.slice(1, 3), 16);
    const G = parseInt(h.slice(3, 5), 16);
    const B = parseInt(h.slice(5, 7), 16);
    doc.strokeColor(R, G, B);
  },

  // ── Header ────────────────────────────────────────────────────────────────────
  /**
   * Fun gradient-style header with wavy bottom edge via stacked rects + decorative circles.
   */
  _drawHeader(doc, company, reportType, student, language) {
    const hh = 150;
    const isPaid = reportType === 'paid';

    // Background sweep: deep purple top → pink stripe
    PDFService._rect(doc, 0, 0, PW, hh, C.purple);

    // Decorative blobs (circles at varying opacity zones)
    // Top-right big blob
    PDFService._roundRect(doc, PW - 100, -40, 160, 160, 80, C.pink);
    // Mid-left small blob
    PDFService._roundRect(doc, -30, 60, 100, 100, 50, C.purpleLight);
    // Bottom-right tiny accent
    PDFService._roundRect(doc, PW - 60, hh - 40, 80, 60, 30, C.sky);

    // Wavy bottom: layered arcs using a polygon approximation
    // Draw a lighter purple strip that overlaps the bottom 20pt of header and provides a "wave"
    PDFService._rect(doc, 0, hh - 20, PW, 20, C.purpleLight);
    PDFService._roundRect(doc, -20, hh - 10, PW + 40, 24, 12, C.pageBg);

    // ── Badge ─────────────────────────────────────────────────────────────────
    const badgeText  = isPaid ? '⭐ PREMIUM' : '🆓 FREE REPORT';
    const badgeColor = isPaid ? C.yellow : C.green;
    PDFService._roundRect(doc, PW - ML - 100, 14, 100, 22, 11, badgeColor);
    PDFService._fc(doc, C.dark);
    doc.fontSize(8.5).font('Helvetica-Bold')
      .text(badgeText, PW - ML - 100, 19, { width: 100, align: 'center' });

    // ── Company name ──────────────────────────────────────────────────────────
    PDFService._fc(doc, C.white);
    doc.fontSize(22).font('Helvetica-Bold').text(company.name, ML, 22);

    // ── Tagline ───────────────────────────────────────────────────────────────
    PDFService._fc(doc, C.purpleLight);
    doc.fontSize(10.5).font('Helvetica').text('Your Personal Career Counseling Report', ML, 52);

    // ── Student name big greeting ─────────────────────────────────────────────
    const L = getLabels(language);
    PDFService._fc(doc, C.yellowLight);
    doc.fontSize(15).font('Helvetica-Bold')
      .text(L.greeting(student.name), ML, 80, { width: CW - 110 });

    doc.y = hh + 14;
    doc.x = ML;
  },

  // ── Student info pill ────────────────────────────────────────────────────────
  _drawStudentCard(doc, student) {
    const y = doc.y;
    const h = 52;

    PDFService._roundRect(doc, ML, y, CW, h, 10, C.purplePale);
    // Left accent pill
    PDFService._roundRect(doc, ML, y, 6, h, 3, C.purple);

    const tx = ML + 20;
    PDFService._fc(doc, C.dark);
    doc.fontSize(13).font('Helvetica-Bold').text(student.name, tx, y + 8);

    const meta = [`Class ${student.standard}`, `Age ${student.age}`, student.email]
      .filter(Boolean).join('   ·   ');
    PDFService._fc(doc, C.mutedText);
    doc.fontSize(9.5).font('Helvetica').text(meta, tx, y + 28);

    // Date stamp top-right
    const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    PDFService._fc(doc, C.mutedText);
    doc.fontSize(8.5).font('Helvetica')
      .text(dateStr, ML, y + 10, { width: CW, align: 'right' });

    doc.y = y + h + 18;
    doc.x = ML;
  },

  // ── Section title with colored banner ────────────────────────────────────────
  _drawSectionTitle(doc, title, accentColor) {
    const color = accentColor || C.purple;
    const y = doc.y;
    const h = 26;
    const r = 6;

    PDFService._roundRect(doc, ML, y, CW, h, r, color);

    PDFService._fc(doc, C.white);
    doc.fontSize(12.5).font('Helvetica-Bold')
      .text(title, ML + 14, y + 7, { width: CW - 14 });

    doc.y = y + h + 10;
    doc.x = ML;
  },

  // ── Colored bullet with pill background ──────────────────────────────────────
  _drawBullet(doc, text, accentColor) {
    const color = accentColor || C.green;
    const y = doc.y;
    // Small colored dot
    const R = parseInt(color.slice(1, 3), 16);
    const G = parseInt(color.slice(3, 5), 16);
    const B = parseInt(color.slice(5, 7), 16);
    doc.circle(ML + 6, y + 7, 4).fillColor(R, G, B).fill();

    PDFService._fc(doc, C.bodyText);
    doc.fontSize(10.5).font('Helvetica')
      .text(text, ML + 18, y, { width: CW - 18 });

    doc.moveDown(0.35);
    doc.x = ML;
  },

  // ── Strength tag pills (inline colorful tags) ─────────────────────────────────
  _drawStrengthTags(doc, strengths) {
    const tagColors = [C.purplePale, C.pinkPale, C.greenPale, C.skyPale, C.yellowPale, C.purplePale];
    const tagTextColors = [C.purple, C.pink, C.green, C.sky, C.yellow, C.purple];
    let x = ML;
    const startY = doc.y;
    let rowY = startY;

    strengths.forEach((s, i) => {
      const tw = Math.min(doc.widthOfString(s, { fontSize: 10 }) + 24, CW);
      const th = 22;
      // Wrap if needed
      if (x + tw > PW - ML + 4 && x !== ML) {
        x = ML;
        rowY += th + 6;
      }
      PDFService._roundRect(doc, x, rowY, tw, th, 11, tagColors[i % tagColors.length]);
      PDFService._fc(doc, tagTextColors[i % tagTextColors.length]);
      doc.fontSize(10).font('Helvetica-Bold')
        .text(s, x + 6, rowY + 6, { width: tw - 12, lineBreak: false });
      x += tw + 8;
    });

    doc.y = rowY + 28 + 8;
    doc.x = ML;
  },

  // ── Career card with colored left stripe ─────────────────────────────────────
  _drawCareerCard(doc, career, index, showPathway, L) {
    if (doc.y > PH - 160) {
      doc.addPage();
      doc.y = 40;
      doc.x = ML;
    }

    const cardColors = [C.purplePale, C.pinkPale, C.greenPale, C.skyPale, C.yellowPale];
    const stripeColors = [C.purple, C.pink, C.green, C.sky, C.yellow];
    const ci = index % cardColors.length;

    const startY = doc.y;
    const tx = ML + 14;
    const tw = CW - 18;

    // Measure content height roughly (we'll draw bg after measuring)
    // Draw title first to measure
    let curY = startY + 10;

    // ── Title row ─────────────────────────────────────────────────────────────
    PDFService._fc(doc, stripeColors[ci]);
    doc.fontSize(12).font('Helvetica-Bold')
      .text(`#${index + 1}  ${career.title || 'Career Path'}`, tx, curY, { width: tw });
    curY = doc.y + 3;

    // ── Fit badge ─────────────────────────────────────────────────────────────
    if (career.fit) {
      const fitBg = career.fit === 'High' ? C.greenPale : career.fit === 'Medium' ? C.yellowPale : C.skyPale;
      const fitTx = career.fit === 'High' ? C.green : career.fit === 'Medium' ? C.yellow : C.sky;
      PDFService._roundRect(doc, tx, curY, 68, 17, 8, fitBg);
      PDFService._fc(doc, fitTx);
      doc.fontSize(8.5).font('Helvetica-Bold')
        .text(`${career.fit} Match`, tx, curY + 4, { width: 68, align: 'center' });
      curY += 22;
    }

    // ── Description ───────────────────────────────────────────────────────────
    if (career.description) {
      PDFService._fc(doc, C.bodyText);
      doc.fontSize(10).font('Helvetica')
        .text(career.description, tx, curY, { width: tw });
      curY = doc.y + 4;
    }

    // ── Pathway ───────────────────────────────────────────────────────────────
    if (showPathway && career.pathway) {
      PDFService._fc(doc, stripeColors[ci]);
      doc.fontSize(9.5).font('Helvetica-Bold')
        .text((L || getLabels('en')).pursuePath, tx, curY, { width: tw });
      curY = doc.y;
      PDFService._fc(doc, C.bodyText);
      doc.fontSize(9.5).font('Helvetica')
        .text(career.pathway, tx, curY, { width: tw });
      curY = doc.y;
    }

    const cardH = curY - startY + 10;
    // Now draw background behind everything (we need to redraw over it)
    // Workaround: draw bg first, then re-render text
    // Actually draw bg before text by resetting and drawing
    // PDFKit doesn't have layers, so we draw bg at startY with estimated height before text
    // Instead: use a subtle bottom border only
    PDFService._sc(doc, cardColors[ci]);
    // Left stripe
    PDFService._rect(doc, ML, startY, 5, cardH, stripeColors[ci]);

    doc.y = curY + 12;
    doc.x = ML;
    // Thin rule between cards
    const R = parseInt(C.rule.slice(1, 3), 16);
    const G = parseInt(C.rule.slice(3, 5), 16);
    const B = parseInt(C.rule.slice(5, 7), 16);
    doc.moveTo(ML, doc.y - 6).lineTo(PW - ML, doc.y - 6)
      .strokeColor(R, G, B).lineWidth(0.4).stroke();
  },

  // ── Upgrade CTA box ──────────────────────────────────────────────────────────
  _drawUpgradeCTA(doc, upgradeToken, company, language) {
    const isHindi = language === 'hi';
    if (doc.y > PH - 130) {
      doc.addPage();
      doc.y = 40;
      doc.x = ML;
    }

    const y = doc.y;
    const h = 102;
    const upgradeUrl = `${company.website}/upgrade?token=${upgradeToken}`;

    PDFService._roundRect(doc, ML, y, CW, h, 10, C.yellowPale);
    // Top stripe
    PDFService._roundRect(doc, ML, y, CW, 6, 5, C.yellow);

    // Star emoji label
    PDFService._fc(doc, C.dark);
    doc.fontSize(14).font('Helvetica-Bold')
      .text(
        isHindi ? '⭐ Full Report Unlock Karo — Sirf ₹499!' : '⭐ Unlock Your Full Report — Just ₹499!',
        ML + 14, y + 16, { width: CW - 28 },
      );

    PDFService._fc(doc, C.bodyText);
    doc.fontSize(10).font('Helvetica')
      .text(
        isHindi
          ? '6+ career paths, deep personality insights aur personalised action plan pao.'
          : 'Get 6+ career paths, personality insights, academic roadmap & a personalised action plan.',
        ML + 14, y + 38, { width: CW - 28 },
      );

    PDFService._fc(doc, C.purple);
    doc.fontSize(10).font('Helvetica-Bold')
      .text(
        isHindi ? `Abhi Upgrade Karo → ${upgradeUrl}` : `Upgrade Now → ${upgradeUrl}`,
        ML + 14, y + 74, { width: CW - 28, link: upgradeUrl, underline: true },
      );

    doc.y = y + h + 16;
    doc.x = ML;
  },

  // ── Motivation box ───────────────────────────────────────────────────────────
  _drawMotivationBox(doc, text) {
    if (!text) return;
    if (doc.y > PH - 100) { doc.addPage(); doc.y = 40; doc.x = ML; }
    const y = doc.y;
    const h = 76;
    PDFService._roundRect(doc, ML, y, CW, h, 10, C.pinkPale);
    PDFService._roundRect(doc, ML, y, CW, 5, 5, C.pink);
    PDFService._fc(doc, C.pink);
    doc.fontSize(26).font('Helvetica-Bold').text('\u2728', ML + 14, y + 10);
    PDFService._fc(doc, C.dark);
    doc.fontSize(10.5).font('Helvetica-Oblique')
      .text(text, ML + 46, y + 14, { width: CW - 60 });
    doc.y = y + h + 14;
    doc.x = ML;
  },

  // ── Footer ───────────────────────────────────────────────────────────────────
  _drawFooter(doc, company) {
    const fy = PH - 36;
    PDFService._rect(doc, 0, fy - 1, PW, 37, C.purple);
    PDFService._fc(doc, C.purpleLight);
    doc.fontSize(8.5).font('Helvetica')
      .text(
        `${company.name}  ·  ${company.email}  ·  ${company.address || 'India'}`,
        ML, fy + 10, { width: CW, align: 'center' },
      );
  },

  // ── Free Report — brochure-style helpers (green + yellow) ──────────────────

  /** Brochure-style header: full green background with yellow blob decorations */
  _drawFreeHeader(doc, company, student, language) {
    const hh = 162;
    const L = getLabels(language);

    // Full green background
    PDFService._rect(doc, 0, 0, PW, hh, CF.green);

    // Yellow blob — large circle, top-right (mirrors brochure cover)
    PDFService._roundRect(doc, PW - 110, -55, 170, 170, 85, CF.yellow);
    // Yellow blob — medium circle, bottom-left
    PDFService._roundRect(doc, -35, hh - 68, 110, 110, 55, CF.yellow);
    // Small greenLight accent circle — lower-mid
    PDFService._roundRect(doc, ML - 8, hh - 18, 50, 50, 25, CF.greenLight);

    // Rounded white edge blending header into page
    PDFService._roundRect(doc, -20, hh - 14, PW + 40, 28, 14, CF.white);

    // Badge — yellow pill, top-right
    PDFService._roundRect(doc, PW - ML - 116, 14, 116, 24, 12, CF.yellow);
    PDFService._fc(doc, CF.greenDark);
    doc.fontSize(9).font('Helvetica-Bold')
      .text('\u2726 FREE REPORT', PW - ML - 116, 20, { width: 116, align: 'center' });

    // Company name — white, bold
    PDFService._fc(doc, CF.white);
    doc.fontSize(24).font('Helvetica-Bold').text(company.name, ML, 22);

    // Tagline — pale green
    PDFService._fc(doc, CF.greenPale);
    doc.fontSize(10).font('Helvetica').text('Your Personal Career Counseling Report', ML, 54);

    // Student greeting — yellow, large
    PDFService._fc(doc, CF.yellow);
    doc.fontSize(16).font('Helvetica-Bold')
      .text(L.greeting(student.name), ML, 86, { width: CW - 130 });

    doc.y = hh + 18;
    doc.x = ML;
  },

  /** Student info card — green-pale background with green left accent bar */
  _drawFreeStudentCard(doc, student) {
    const y = doc.y;
    const h = 50;
    PDFService._roundRect(doc, ML, y, CW, h, 8, CF.greenPale);
    PDFService._roundRect(doc, ML, y, 6, h, 3, CF.green);

    const tx = ML + 20;
    PDFService._fc(doc, CF.dark);
    doc.fontSize(13).font('Helvetica-Bold').text(student.name, tx, y + 8);

    const meta = [`Class ${student.standard}`, `Age ${student.age}`, student.email]
      .filter(Boolean).join('   \u00B7   ');
    PDFService._fc(doc, CF.mutedText);
    doc.fontSize(9.5).font('Helvetica').text(meta, tx, y + 28);

    const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    PDFService._fc(doc, CF.mutedText);
    doc.fontSize(8.5).font('Helvetica')
      .text(dateStr, ML, y + 10, { width: CW, align: 'right' });

    doc.y = y + h + 18;
    doc.x = ML;
  },

  /**
   * Section title banner.
   * useYellow=true  → yellow background, dark green text (for alternating contrast)
   * useYellow=false → green background, white text
   */
  _drawFreeSectionTitle(doc, title, useYellow) {
    const bg = useYellow ? CF.yellow : CF.green;
    const fg = useYellow ? CF.greenDark : CF.white;
    const y = doc.y;
    const h = 28;
    PDFService._roundRect(doc, ML, y, CW, h, 6, bg);
    PDFService._roundRect(doc, ML, y, 7, h, 3, useYellow ? CF.yellowDark : CF.greenDark);
    PDFService._fc(doc, fg);
    doc.fontSize(12.5).font('Helvetica-Bold')
      .text(title, ML + 18, y + 8, { width: CW - 22 });
    doc.y = y + h + 10;
    doc.x = ML;
  },

  /** Strength pills — alternating green-pale / yellow-pale tags */
  _drawFreeStrengthTags(doc, strengths) {
    const tagBgs = [CF.greenPale, CF.yellowPale, CF.greenPale, CF.yellowPale, CF.greenPale, CF.yellowPale];
    const tagFgs = [CF.green, CF.yellowDark, CF.greenDark, CF.yellowDark, CF.green, CF.greenDark];
    let x = ML;
    const startY = doc.y;
    let rowY = startY;

    strengths.forEach((s, i) => {
      const tw = Math.min(doc.widthOfString(s, { fontSize: 10 }) + 28, CW);
      const th = 24;
      if (x + tw > PW - ML + 4 && x !== ML) { x = ML; rowY += th + 8; }
      PDFService._roundRect(doc, x, rowY, tw, th, 12, tagBgs[i % tagBgs.length]);
      const dR = parseInt(tagFgs[i % tagFgs.length].slice(1, 3), 16);
      const dG = parseInt(tagFgs[i % tagFgs.length].slice(3, 5), 16);
      const dB = parseInt(tagFgs[i % tagFgs.length].slice(5, 7), 16);
      doc.circle(x + 11, rowY + 12, 3).fillColor(dR, dG, dB).fill();
      PDFService._fc(doc, tagFgs[i % tagFgs.length]);
      doc.fontSize(10).font('Helvetica-Bold')
        .text(s, x + 20, rowY + 7, { width: tw - 24, lineBreak: false });
      x += tw + 8;
    });

    doc.y = rowY + 32 + 8;
    doc.x = ML;
  },

  /** Career card — numbered circle + green/yellow left stripe */
  _drawFreeCareerCard(doc, career, index, L) {
    if (doc.y > PH - 170) { doc.addPage(); doc.y = 40; doc.x = ML; }

    const stripes = [CF.green, CF.yellow, CF.greenLight, CF.green, CF.yellow];
    const numFgs  = [CF.white,  CF.greenDark, CF.white,     CF.white, CF.greenDark];
    const ci = index % stripes.length;
    const tx = ML + 18;
    const tw = CW - 22;
    const startY = doc.y;
    let curY = startY + 10;

    // Numbered circle
    PDFService._roundRect(doc, ML + 8, curY - 2, 22, 22, 11, stripes[ci]);
    PDFService._fc(doc, numFgs[ci]);
    doc.fontSize(10).font('Helvetica-Bold')
      .text(`${index + 1}`, ML + 8, curY + 2, { width: 22, align: 'center' });

    // Career title
    PDFService._fc(doc, CF.greenDark);
    doc.fontSize(12).font('Helvetica-Bold')
      .text(career.title || 'Career Path', tx + 22, curY, { width: tw - 28 });
    curY = doc.y + 4;

    // Fit badge
    if (career.fit) {
      const fitBg = career.fit === 'High' ? CF.green   : career.fit === 'Medium' ? CF.yellow     : CF.greenPale;
      const fitFg = career.fit === 'High' ? CF.white   : career.fit === 'Medium' ? CF.yellowDark : CF.green;
      PDFService._roundRect(doc, tx, curY, 72, 18, 9, fitBg);
      PDFService._fc(doc, fitFg);
      doc.fontSize(8.5).font('Helvetica-Bold')
        .text(`${career.fit} Match`, tx, curY + 4, { width: 72, align: 'center' });
      curY += 24;
    }

    // Description
    if (career.description) {
      PDFService._fc(doc, CF.bodyText);
      doc.fontSize(10).font('Helvetica').text(career.description, tx, curY, { width: tw });
      curY = doc.y + 6;
    }

    // Left coloured stripe
    PDFService._rect(doc, ML, startY, 5, curY - startY + 6, stripes[ci]);

    // Separator rule
    const rR = parseInt(CF.rule.slice(1, 3), 16);
    const rG = parseInt(CF.rule.slice(3, 5), 16);
    const rB = parseInt(CF.rule.slice(5, 7), 16);
    doc.moveTo(ML, curY + 4).lineTo(PW - ML, curY + 4)
      .strokeColor(rR, rG, rB).lineWidth(0.4).stroke();

    doc.y = curY + 14;
    doc.x = ML;
  },

  /** Upgrade CTA — yellow panel with green top stripe + brochure-style blob accents */
  _drawFreeUpgradeCTA(doc, upgradeToken, company, language) {
    const isHindi = language === 'hi';
    if (doc.y > PH - 140) { doc.addPage(); doc.y = 40; doc.x = ML; }

    const y = doc.y;
    const h = 112;
    const upgradeUrl = `${company.website}/upgrade?token=${upgradeToken}`;

    // Yellow background
    PDFService._roundRect(doc, ML, y, CW, h, 10, CF.yellowPale);
    // Green top accent stripe
    PDFService._roundRect(doc, ML, y, CW, 7, 5, CF.green);
    // Decorative circles (brochure style)
    PDFService._roundRect(doc, PW - ML - 30, y + h - 34, 26, 26, 13, CF.yellow);
    PDFService._roundRect(doc, ML + 4, y + 8, 18, 18, 9, CF.greenPale);

    PDFService._fc(doc, CF.greenDark);
    doc.fontSize(14).font('Helvetica-Bold')
      .text(
        isHindi ? '\u2B50 Full Report Unlock Karo \u2014 Sirf \u20B9499!' : '\u2B50 Unlock Your Full Report \u2014 Just \u20B9499!',
        ML + 14, y + 18, { width: CW - 60 },
      );

    PDFService._fc(doc, CF.dark);
    doc.fontSize(10).font('Helvetica')
      .text(
        isHindi
          ? '6+ career paths, deep personality insights aur personalised action plan pao.'
          : 'Get 6+ career paths, personality insights, academic roadmap & a personalised action plan.',
        ML + 14, y + 44, { width: CW - 28 },
      );

    PDFService._fc(doc, CF.green);
    doc.fontSize(10.5).font('Helvetica-Bold')
      .text(
        isHindi ? `Abhi Upgrade Karo \u2192 ${upgradeUrl}` : `Upgrade Now \u2192 ${upgradeUrl}`,
        ML + 14, y + 82, { width: CW - 28, link: upgradeUrl, underline: true },
      );

    doc.y = y + h + 16;
    doc.x = ML;
  },

  /** Motivation box — green-pale background with green top stripe */
  _drawFreeMotivationBox(doc, text) {
    if (!text) return;
    if (doc.y > PH - 100) { doc.addPage(); doc.y = 40; doc.x = ML; }
    const y = doc.y;
    const h = 76;
    PDFService._roundRect(doc, ML, y, CW, h, 10, CF.greenPale);
    PDFService._roundRect(doc, ML, y, CW, 5, 5, CF.green);
    PDFService._fc(doc, CF.green);
    doc.fontSize(24).font('Helvetica-Bold').text('\u2726', ML + 14, y + 12);
    PDFService._fc(doc, CF.dark);
    doc.fontSize(10.5).font('Helvetica-Oblique')
      .text(text, ML + 46, y + 16, { width: CW - 60 });
    doc.y = y + h + 14;
    doc.x = ML;
  },

  /** Footer — green bar + yellow accent strip at very bottom */
  _drawFreeFooter(doc, company) {
    const fy = PH - 38;
    PDFService._rect(doc, 0, fy, PW, 32, CF.green);
    PDFService._rect(doc, 0, fy + 32, PW, 7, CF.yellow);
    PDFService._fc(doc, CF.white);
    doc.fontSize(8.5).font('Helvetica')
      .text(
        `${company.name}  \u00B7  ${company.email}  \u00B7  ${company.address || 'India'}`,
        ML, fy + 10, { width: CW, align: 'center' },
      );
  },

  // ── Free Report ───────────────────────────────────────────────────────────────
  _buildFreeReport(doc, student, report, upgradeToken, company, language = 'en') {
    const L = getLabels(language);

    // Brochure-style header (green + yellow blobs)
    PDFService._drawFreeHeader(doc, company, student, language);
    PDFService._drawFreeStudentCard(doc, student);

    // Career Overview — green section
    PDFService._drawFreeSectionTitle(doc, L.careerOverview, false);
    PDFService._fc(doc, CF.bodyText);
    doc.fontSize(10.5).font('Helvetica')
      .text(
        report.summary || 'Based on your responses, here is a personalised overview of your career potential.',
        ML, doc.y, { width: CW },
      );
    doc.moveDown(1.2);
    doc.x = ML;

    // Key Strengths — yellow section header, green/yellow tag pills
    PDFService._drawFreeSectionTitle(doc, L.keyStrengths, true);
    PDFService._drawFreeStrengthTags(doc, report.strengths || []);

    // Top 3 Career Paths — green section header
    if (doc.y > PH - 200) { doc.addPage(); doc.y = 40; doc.x = ML; }
    PDFService._drawFreeSectionTitle(doc, L.careerPaths, false);
    (report.careerSuggestions || []).slice(0, 3)
      .forEach((s, i) => PDFService._drawFreeCareerCard(doc, s, i, L));

    // Next Steps — yellow section header, alternating green/yellow bullets
    if (doc.y > PH - 160) { doc.addPage(); doc.y = 40; doc.x = ML; }
    PDFService._drawFreeSectionTitle(doc, L.nextSteps, true);
    (report.nextSteps || []).slice(0, 4).forEach((s, i) =>
      PDFService._drawBullet(doc, `${i + 1}.  ${s}`, i % 2 === 0 ? CF.green : CF.yellow),
    );
    doc.moveDown(0.8);

    // Motivation box
    PDFService._drawFreeMotivationBox(doc, report.motivation);

    // Upgrade CTA — yellow panel with green accent
    if (upgradeToken) PDFService._drawFreeUpgradeCTA(doc, upgradeToken, company, language);

    // Footer — green + yellow accent strip
    PDFService._drawFreeFooter(doc, company);
  },

  // ── Paid Report ───────────────────────────────────────────────────────────────
  _buildPaidReport(doc, student, report, company, language = 'en') {
    const L = getLabels(language);
    PDFService._drawHeader(doc, company, 'paid', student, language);
    PDFService._drawStudentCard(doc, student);

    const pageBreak = (minSpace) => {
      if (doc.y > PH - (minSpace || 160)) {
        doc.addPage();
        doc.y = 40;
        doc.x = ML;
      }
    };

    let sectionIdx = 0;
    const nextColor = () => SECTION_COLORS[sectionIdx++ % SECTION_COLORS.length];

    // Career Overview / Summary
    PDFService._drawSectionTitle(doc, L.executiveSummary, nextColor());
    PDFService._fc(doc, C.bodyText);
    doc.fontSize(10.5).font('Helvetica').text(report.summary || '', ML, doc.y, { width: CW });
    doc.moveDown(1.2); doc.x = ML;

    // Personality
    if (report.personalityInsights) {
      pageBreak();
      PDFService._drawSectionTitle(doc, L.personalityStyle, nextColor());
      PDFService._fc(doc, C.bodyText);
      doc.fontSize(10.5).font('Helvetica').text(report.personalityInsights, ML, doc.y, { width: CW });
      doc.moveDown(1.2); doc.x = ML;
    }

    // Interest Pattern
    if (report.interestPattern) {
      pageBreak();
      PDFService._drawSectionTitle(doc, L.interestPattern, nextColor());
      PDFService._fc(doc, C.bodyText);
      doc.fontSize(10.5).font('Helvetica').text(report.interestPattern, ML, doc.y, { width: CW });
      doc.moveDown(1.2); doc.x = ML;
    }

    // Key Strengths — color tags
    pageBreak();
    PDFService._drawSectionTitle(doc, L.keyStrengths, nextColor());
    PDFService._drawStrengthTags(doc, report.strengths || []);

    // Career Paths
    pageBreak();
    PDFService._drawSectionTitle(doc, L.personalisedPaths, nextColor());
    (report.careerSuggestions || []).forEach((s, i) =>
      PDFService._drawCareerCard(doc, s, i, true, L),
    );

    // Academic Roadmap
    pageBreak();
    PDFService._drawSectionTitle(doc, L.academicRoadmap, nextColor());
    (report.academicPathways || []).forEach((s, i) =>
      PDFService._drawBullet(doc, `${i + 1}.  ${s}`, C.sky),
    );
    doc.moveDown(0.8);

    // Action Plan
    pageBreak();
    PDFService._drawSectionTitle(doc, L.actionPlan, nextColor());
    (report.nextSteps || []).forEach((s, i) =>
      PDFService._drawBullet(doc, `${i + 1}.  ${s}`, C.green),
    );
    doc.moveDown(1);

    // Motivation
    PDFService._drawMotivationBox(doc, report.motivation);

    // Contact nudge
    pageBreak(60);
    PDFService._fc(doc, C.mutedText);
    doc.fontSize(9.5).font('Helvetica')
      .text(L.contactNudge(company.email), ML, doc.y, { width: CW, align: 'center' });
    doc.moveDown(0.8);

    PDFService._drawFooter(doc, company);
  },
};

module.exports = PDFService;
