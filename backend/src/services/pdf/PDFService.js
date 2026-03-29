'use strict';
const PDFDocument = require('pdfkit');
const config = require('../../config/config');
const StorageService = require('../storage/StorageService');
const logger = require('../../utils/logger');

// ── Palette ──────────────────────────────────────────────────────────────────
const C = {
  indigo700:    '#4338CA',
  indigo600:    '#4F46E5',
  indigo200:    '#A5B4FC',
  indigo100:    '#E0E7FF',
  indigo50:     '#EEF2FF',
  emerald600:   '#059669',
  emerald500:   '#10B981',
  amber500:     '#F59E0B',
  amber200:     '#FDE68A',
  amber50:      '#FFFBEB',
  gray900:      '#111827',
  gray700:      '#374151',
  gray500:      '#6B7280',
  gray300:      '#D1D5DB',
  gray100:      '#F3F4F6',
  white:        '#FFFFFF',
};

/** Convert a #RRGGBB hex string to a PDFKit-compatible "rgb(r,g,b)" string. */
function rgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${r},${g},${b})`;
}

// ── Page constants (A4 in points) ────────────────────────────────────────────
const PW = 595.28;   // page width
const PH = 841.89;   // page height
const ML = 48;       // left/right margin
const CW = PW - ML * 2; // content width ≈ 499 pt

// ── Language label lookup ────────────────────────────────────────────────────
function getLabels(language) {
  if (language === 'hi') {
    return {
      careerOverview:       'Career Overview',
      keyStrengths:         'Key Strengths',
      careerPaths:          'Career Paths',
      nextSteps:            'Next Steps',
      executiveSummary:     'Executive Summary',
      personalityStyle:     'Personality & Learning Style',
      interestPattern:      'Interest Pattern Analysis',
      personalisedPaths:    'Personalised Career Paths',
      academicRoadmap:      'Academic & Skill Roadmap',
      actionPlan:           'Action Plan',
      overview_sub:         '(tumhara career overview)',
      strengths_sub:        '(tumhari strengths)',
      steps_sub:            '(agle steps)',
      pursuePath:           'Is path ke liye kya karein:',
      contactNudge: (email) => `Personalized guidance ke liye hum se contact karein: ${email}`,
    };
  }
  return {
    careerOverview:       'Your Career Overview',
    keyStrengths:         'Your Key Strengths',
    careerPaths:          'Suggested Career Paths',
    nextSteps:            'Recommended Next Steps',
    executiveSummary:     'Executive Summary',
    personalityStyle:     'Personality & Learning Style',
    interestPattern:      'Interest Pattern Analysis',
    personalisedPaths:    'Personalised Career Paths',
    academicRoadmap:      'Academic & Skill Roadmap',
    actionPlan:           'Your Action Plan',
    overview_sub:         null,
    strengths_sub:        null,
    steps_sub:            null,
    pursuePath:           'How to pursue this path:',
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
      // Use zero margins so we control all coordinates absolutely
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 0, bottom: 0, left: 0, right: 0 },
        info: {
          Title: `Career Counseling Report — ${student.name}`,
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

  // ── Drawing Primitives ───────────────────────────────────────────────────────

  /**
   * Hero header spanning full page width.
   * Sets doc.y to below the header when done.
   */
  _drawHeader(doc, company, reportType) {
    const hh = 122; // header height

    // Deep indigo background
    doc.rect(0, 0, PW, hh).fill(rgb(C.indigo700));

    // Subtle right panel (slightly lighter shade to add depth)
    doc.rect(PW - 200, 0, 200, hh).fill(rgb(C.indigo600));

    // Diagonal accent strip
    doc.polygon([PW - 220, 0], [PW - 200, 0], [PW - 260, hh], [PW - 280, hh])
      .fill(rgb(C.indigo600));

    // ── Badge ─────────────────────────────────────────────────────────────────
    const isPaid = reportType === 'paid';
    const badgeText = isPaid ? 'PREMIUM REPORT' : 'FREE REPORT';
    const badgeColor = isPaid ? C.amber500 : '#475569';
    const bw = 118; const bh = 24; const bx = PW - ML - bw; const by = 16;
    doc.roundedRect(bx, by, bw, bh, 4).fill(rgb(badgeColor));
    doc.fillColor(rgb(C.white)).fontSize(9).font('Helvetica-Bold')
      .text(badgeText, bx, by + 7, { width: bw, align: 'center' });

    // ── Company name ──────────────────────────────────────────────────────────
    doc.fillColor(rgb(C.white)).fontSize(27).font('Helvetica-Bold')
      .text(company.name, ML, 20);

    // ── Subtitle ──────────────────────────────────────────────────────────────
    doc.fillColor(rgb(C.indigo200)).fontSize(12).font('Helvetica')
      .text('Student Career Counseling Report', ML, 58);

    // ── Website line ──────────────────────────────────────────────────────────
    const site = (company.website || '').replace(/^https?:\/\//, '');
    if (site) {
      doc.fillColor(rgb(C.indigo200)).fontSize(9).font('Helvetica')
        .text(site, ML, 82);
    }

    // Advance past header
    doc.y = hh + 20;
    doc.x = ML;
  },

  /**
   * Student info card with left accent bar.
   * Advances doc.y when done.
   */
  _drawStudentCard(doc, student) {
    const y = doc.y;
    const h = 74;

    // Card background
    doc.rect(ML, y, CW, h).fill(rgb(C.indigo50));
    // Left accent bar
    doc.rect(ML, y, 4, h).fill(rgb(C.indigo600));

    const tx = ML + 18;

    // Student name
    doc.fillColor(rgb(C.gray900)).fontSize(16).font('Helvetica-Bold')
      .text(student.name, tx, y + 11);

    // Class · Age · Email
    const meta = [
      `Class: ${student.standard}`,
      `Age: ${student.age} years`,
      student.email,
    ].join('   ·   ');
    doc.fillColor(rgb(C.gray500)).fontSize(10.5).font('Helvetica')
      .text(meta, tx, y + 34);

    // Date
    const dateStr = new Date().toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
    doc.fillColor(rgb(C.gray500)).fontSize(9).font('Helvetica')
      .text(`Report generated on ${dateStr}`, tx, y + 54);

    doc.y = y + h + 22;
    doc.x = ML;
  },

  /**
   * Section title with a coloured left bar and a thin rule underneath.
   * Advances doc.y when done.
   */
  _drawSectionTitle(doc, title, accent) {
    const accentColor = accent || C.indigo600;
    const y = doc.y;
    const barH = 22;

    // Left accent bar
    doc.rect(ML, y, 4, barH).fill(rgb(accentColor));

    // Title text — positioned correctly INSIDE the bar area
    doc.fillColor(rgb(C.gray900)).fontSize(13).font('Helvetica-Bold')
      .text(title, ML + 12, y + 4);

    // Rule below the title
    const ruleY = y + barH + 5;
    doc.moveTo(ML + 12, ruleY).lineTo(PW - ML, ruleY)
      .strokeColor(rgb(C.gray300)).lineWidth(0.5).stroke();

    doc.y = ruleY + 12;
    doc.x = ML;
  },

  /**
   * Single bullet point line.
   */
  _drawBullet(doc, text, indent) {
    const offsetX = indent || 0;
    const x = ML + offsetX;
    const y = doc.y;

    // Filled circle bullet
    doc.circle(x + 5, y + 6, 3).fill(rgb(C.emerald500));

    // Text
    doc.fillColor(rgb(C.gray700)).fontSize(11).font('Helvetica')
      .text(text, x + 16, y, { width: CW - offsetX - 16 });

    doc.moveDown(0.3);
    doc.x = ML;
  },

  /**
   * Numbered career card.
   */
  _drawCareerCard(doc, career, index, showPathway, L) {
    const labels = L || getLabels('en');
    if (doc.y > PH - 155) {
      doc.addPage();
      doc.y = 50;
      doc.x = ML;
    }

    const badgeR = 13;
    const badgeCX = ML + badgeR;   // badge circle centre x
    const tx = ML + badgeR * 2 + 12; // text start x
    const tw = CW - badgeR * 2 - 12; // text width
    const startY = doc.y;

    // ── Number badge ──────────────────────────────────────────────────────────
    doc.circle(badgeCX, startY + badgeR, badgeR).fill(rgb(C.indigo600));
    doc.fillColor(rgb(C.white)).fontSize(11).font('Helvetica-Bold')
      .text(`${index + 1}`, ML, startY + 5, { width: badgeR * 2, align: 'center' });

    // ── Career title ──────────────────────────────────────────────────────────
    doc.fillColor(rgb(C.indigo600)).fontSize(12.5).font('Helvetica-Bold')
      .text(career.title || 'Career Path', tx, startY);
    const afterTitle = doc.y;

    // ── Fit badge (paid only) ─────────────────────────────────────────────────
    let curY = afterTitle;
    if (career.fit) {
      const fitColors = { High: C.emerald600, Medium: C.amber500, Low: C.gray500 };
      const fc = fitColors[career.fit] || C.gray500;
      doc.roundedRect(tx, curY, 62, 17, 3).fill(rgb(fc));
      doc.fillColor(rgb(C.white)).fontSize(8.5).font('Helvetica-Bold')
        .text(`${career.fit} Fit`, tx, curY + 4, { width: 62, align: 'center' });
      curY += 23;
    }

    // ── Description ───────────────────────────────────────────────────────────
    if (career.description) {
      doc.fillColor(rgb(C.gray700)).fontSize(10.5).font('Helvetica')
        .text(career.description, tx, curY, { width: tw });
      curY = doc.y;
    }

    // ── Pathway (paid) ────────────────────────────────────────────────────────
    if (showPathway && career.pathway) {
      doc.fillColor(rgb(C.emerald600)).fontSize(10).font('Helvetica-Bold')
        .text(labels.pursuePath, tx, curY);
      curY = doc.y;
      doc.fillColor(rgb(C.gray700)).fontSize(10).font('Helvetica')
        .text(career.pathway, tx, curY, { width: tw });
      curY = doc.y;
    }

    // ── Separator ─────────────────────────────────────────────────────────────
    const sepY = curY + 8;
    doc.moveTo(ML, sepY).lineTo(PW - ML, sepY)
      .strokeColor(rgb(C.gray300)).lineWidth(0.4).stroke();

    doc.y = sepY + 14;
    doc.x = ML;
  },

  /**
   * Amber upgrade CTA box.
   */
  _drawUpgradeCTA(doc, upgradeToken, company, language) {
    const isHindi = language === 'hi';
    if (doc.y > PH - 135) {
      doc.addPage();
      doc.y = 50;
      doc.x = ML;
    }

    const y = doc.y;
    const h = 106;
    const upgradeUrl = `${company.website}/upgrade?token=${upgradeToken}`;

    // Box fill
    doc.rect(ML, y, CW, h).fill(rgb(C.amber50));
    // Top accent strip
    doc.rect(ML, y, CW, 4).fill(rgb(C.amber500));
    // Left accent bar
    doc.rect(ML, y, 4, h).fill(rgb(C.amber500));

    // Headline
    doc.fillColor(rgb(C.gray900)).fontSize(13.5).font('Helvetica-Bold')
      .text(
        isHindi
          ? 'Apni Full Report Unlock Karo — Sirf \u20B9499'
          : 'Unlock Your Full Personalised Report \u2014 Only \u20B9499',
        ML + 18, y + 16, { width: CW - 28 },
      );

    // Sub-text
    doc.fillColor(rgb(C.gray700)).fontSize(10.5).font('Helvetica')
      .text(
        isHindi
          ? '6+ career paths, personality insights aur personalised action plan pao.'
          : 'Get in-depth career analysis, 6+ career paths, personality insights, and a personalised action plan.',
        ML + 18, y + 40, { width: CW - 28 },
      );

    // Upgrade link
    doc.fillColor(rgb(C.indigo600)).fontSize(10).font('Helvetica-Bold')
      .text(
        isHindi ? `Abhi Upgrade Karo \u2192 ${upgradeUrl}` : `Upgrade Now \u2192 ${upgradeUrl}`,
        ML + 18, y + 76, { width: CW - 28, link: upgradeUrl, underline: true },
      );

    doc.y = y + h + 18;
    doc.x = ML;
  },

  /**
   * Page footer — call once per page (or only on the last page).
   */
  _drawFooter(doc, company) {
    const fy = PH - 40;
    doc.moveTo(ML, fy).lineTo(PW - ML, fy)
      .strokeColor(rgb(C.gray300)).lineWidth(0.5).stroke();
    doc.fillColor(rgb(C.gray500)).fontSize(9).font('Helvetica')
      .text(
        `${company.name}  |  ${company.email}  |  ${company.address || 'India'}`,
        ML, fy + 8, { width: CW, align: 'center' },
      );
  },

  // ── Free Report ───────────────────────────────────────────────────────────

  _buildFreeReport(doc, student, report, upgradeToken, company, language = 'en') {
    const L = getLabels(language);
    PDFService._drawHeader(doc, company, 'free');
    PDFService._drawStudentCard(doc, student);

    // Career Overview
    PDFService._drawSectionTitle(doc, L.careerOverview);
    doc.fillColor(rgb(C.gray700)).fontSize(11).font('Helvetica')
      .text(
        report.summary ||
          'Based on your responses, we have prepared a preliminary overview of your career potential.',
        ML, doc.y, { width: CW },
      );
    doc.moveDown(1.5);
    doc.x = ML;

    // Key Strengths
    PDFService._drawSectionTitle(doc, L.keyStrengths, C.emerald600);
    (report.strengths || []).forEach((s) => PDFService._drawBullet(doc, s));
    doc.moveDown(1);

    // Suggested Career Paths (top 3)
    PDFService._drawSectionTitle(doc, L.careerPaths);
    (report.careerSuggestions || []).slice(0, 3)
      .forEach((s, i) => PDFService._drawCareerCard(doc, s, i, false, L));

    // Next Steps
    PDFService._drawSectionTitle(doc, L.nextSteps, C.emerald600);
    (report.nextSteps || []).slice(0, 4).forEach((s) => PDFService._drawBullet(doc, s));
    doc.moveDown(1.2);

    // Upgrade CTA
    if (upgradeToken) PDFService._drawUpgradeCTA(doc, upgradeToken, company, language);

    PDFService._drawFooter(doc, company);
  },

  // ── Paid Report ───────────────────────────────────────────────────────────

  _buildPaidReport(doc, student, report, company, language = 'en') {
    const L = getLabels(language);
    PDFService._drawHeader(doc, company, 'paid');
    PDFService._drawStudentCard(doc, student);

    const pageBreak = (minSpace) => {
      if (doc.y > PH - (minSpace || 160)) {
        doc.addPage();
        doc.y = 50;
        doc.x = ML;
      }
    };

    // Executive Summary
    PDFService._drawSectionTitle(doc, L.executiveSummary);
    doc.fillColor(rgb(C.gray700)).fontSize(11).font('Helvetica')
      .text(report.summary || '', ML, doc.y, { width: CW });
    doc.moveDown(1.5);
    doc.x = ML;

    // Personality & Learning Style
    if (report.personalityInsights) {
      pageBreak();
      PDFService._drawSectionTitle(doc, L.personalityStyle, C.emerald600);
      doc.fillColor(rgb(C.gray700)).fontSize(11).font('Helvetica')
        .text(report.personalityInsights, ML, doc.y, { width: CW });
      doc.moveDown(1.5);
      doc.x = ML;
    }

    // Interest Pattern Analysis
    if (report.interestPattern) {
      pageBreak();
      PDFService._drawSectionTitle(doc, L.interestPattern, C.emerald600);
      doc.fillColor(rgb(C.gray700)).fontSize(11).font('Helvetica')
        .text(report.interestPattern, ML, doc.y, { width: CW });
      doc.moveDown(1.5);
      doc.x = ML;
    }

    // Key Strengths
    pageBreak();
    PDFService._drawSectionTitle(doc, L.keyStrengths, C.emerald600);
    (report.strengths || []).forEach((s) => PDFService._drawBullet(doc, s));
    doc.moveDown(1);

    // Personalised Career Paths
    pageBreak();
    PDFService._drawSectionTitle(doc, L.personalisedPaths);
    (report.careerSuggestions || []).forEach((s, i) =>
      PDFService._drawCareerCard(doc, s, i, true, L),
    );

    // Academic & Skill Roadmap
    pageBreak();
    PDFService._drawSectionTitle(doc, L.academicRoadmap, C.emerald600);
    (report.academicPathways || []).forEach((s, i) =>
      PDFService._drawBullet(doc, `${i + 1}. ${s}`),
    );
    doc.moveDown(1);

    // Action Plan
    pageBreak();
    PDFService._drawSectionTitle(doc, L.actionPlan);
    (report.nextSteps || []).forEach((s, i) =>
      PDFService._drawBullet(doc, `${i + 1}. ${s}`),
    );
    doc.moveDown(1.2);

    // Motivation quote box
    if (report.motivation) {
      pageBreak(110);
      const y = doc.y;
      const h = 80;
      doc.rect(ML, y, CW, h).fill(rgb(C.indigo50));
      doc.rect(ML, y, 4, h).fill(rgb(C.indigo600));
      doc.fillColor(rgb(C.indigo200)).fontSize(36).font('Helvetica-Bold')
        .text('\u201C', ML + 14, y + 6);
      doc.fillColor(rgb(C.gray700)).fontSize(11).font('Helvetica-Oblique')
        .text(report.motivation, ML + 48, y + 18, { width: CW - 62 });
      doc.y = y + h + 16;
      doc.x = ML;
    }

    // Contact nudge
    pageBreak(60);
    doc.fillColor(rgb(C.gray500)).fontSize(10).font('Helvetica')
      .text(
        L.contactNudge(company.email),
        ML, doc.y, { width: CW, align: 'center' },
      );
    doc.moveDown(0.8);

    PDFService._drawFooter(doc, company);
  },
};

module.exports = PDFService;
