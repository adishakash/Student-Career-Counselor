'use strict';
const puppeteer = require('puppeteer');
const config = require('../../config/config');
const StorageService = require('../storage/StorageService');
const logger = require('../../utils/logger');
const { buildFreeReportHTML } = require('./templates/freeReport');
const { buildPaidReportHTML } = require('./templates/paidReport');

// â”€â”€ Puppeteer launch args (safe for containerised / root environments) â”€â”€â”€â”€â”€â”€â”€
const PUPPETEER_ARGS = [
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-dev-shm-usage',
  '--disable-gpu',
];

// â”€â”€ Service â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const PDFService = {
  /**
   * Generate a PDF from an HTML/CSS template rendered by Puppeteer.
   *
   * @param {object} opts
   * @param {object}  opts.student       â€“ { name, standard, age, email }
   * @param {object}  opts.reportContent â€“ LLM report payload
   * @param {string}  opts.reportType    â€“ 'free' | 'paid'
   * @param {string}  [opts.upgradeToken]
   * @param {string}  [opts.language]    â€“ 'en' | 'hi'
   * @returns {{ filename: string, key: string }}
   */
  async generate({ student, reportContent, reportType, upgradeToken, language = 'en' }) {
    const timestamp = Date.now();
    const safeName  = (student.name || 'student').replace(/[^a-zA-Z0-9]/g, '_').slice(0, 20);
    const filename  = `report_${safeName}_${timestamp}.pdf`;
    const key       = `pdfs/${filename}`;

    const html = reportType === 'paid'
      ? buildPaidReportHTML({ student, report: reportContent, company: config.company, language })
      : buildFreeReportHTML({ student, report: reportContent, upgradeToken, company: config.company, language });

    let browser;
    try {
      browser = await puppeteer.launch({ headless: true, args: PUPPETEER_ARGS });
      const page = await browser.newPage();
      // setContent + networkidle0 ensures all CSS is applied before print
      await page.setContent(html, { waitUntil: 'networkidle0' });
      const buffer = await page.pdf({
        format:          'A4',
        printBackground: true,
        margin:          { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' },
      });
      logger.debug('PDF rendered by Puppeteer', { filename, bytes: buffer.length });

      await StorageService.upload(key, buffer);
      logger.debug('PDF uploaded to Spaces', { key });
      return { filename, key };
    } finally {
      if (browser) await browser.close();
    }
  },
};

module.exports = PDFService;
