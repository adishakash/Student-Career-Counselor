'use strict';
const nodemailer = require('nodemailer');
const config = require('../../config/config');
const db = require('../../config/database');
const StorageService = require('../storage/StorageService');
const logger = require('../../utils/logger');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.secure,
    auth: {
      type: 'LOGIN',
      user: config.smtp.user,
      pass: config.smtp.password,
    },
    tls: {
      rejectUnauthorized: false,
    },
    pool: true,
    maxConnections: 5,
  });
  return transporter;
}

const EmailService = {
  /**
   * Send the career report PDF to the student via email.
   */
  async sendReport({ to, studentName, reportType, pdfPath, studentId, assessmentId, isResend = false, language = 'en' }) {
    const isPaid = reportType === 'paid';
    const isHindi = language === 'hi';
    const subject = isPaid
      ? (isHindi
          ? `तुम्हारी Premium Career Counseling Report तैयार है — ${config.company.name}`
          : `Your Premium Career Counseling Report is Ready — ${config.company.name}`)
      : (isHindi
          ? `तुम्हारी Free Career Counseling Report — ${config.company.name}`
          : `Your Free Career Counseling Report — ${config.company.name}`);

    const html = EmailService._buildReportEmailHTML(studentName, reportType, isResend, config.company, language);

    let logId = null;
    try {
      // Create email log entry
      const logResult = await db.query(
        `INSERT INTO email_logs (student_id, assessment_id, email_to, email_type, status)
         VALUES ($1, $2, $3, $4, 'pending')
         RETURNING id`,
        [studentId, assessmentId, to, isResend ? 'resend' : `${reportType}_report`]
      );
      logId = logResult.rows[0].id;

      const attachments = [];
      if (pdfPath) {
        try {
          const pdfBuffer = await StorageService.download(pdfPath);
          attachments.push({
            filename: `Career_Report_${studentName.split(' ')[0]}.pdf`,
            content: pdfBuffer,
            contentType: 'application/pdf',
          });
        } catch (downloadErr) {
          logger.warn('Could not download PDF from Spaces for attachment', { key: pdfPath, error: downloadErr.message });
        }
      }

      const info = await getTransporter().sendMail({
        from: `"${config.smtp.fromName}" <${config.smtp.fromAddress}>`,
        to,
        subject,
        html,
        attachments,
      });

      // Update log to sent
      await db.query(
        `UPDATE email_logs SET status = 'sent', message_id = $1, sent_at = NOW() WHERE id = $2`,
        [info.messageId, logId]
      );

      logger.info('Email sent', { to, subject, messageId: info.messageId });
      return info;
    } catch (err) {
      logger.error('Email send failed', { to, error: err.message });
      if (logId) {
        await db.query(
          `UPDATE email_logs SET status = 'failed', error_message = $1 WHERE id = $2`,
          [err.message, logId]
        ).catch(() => {});
      }
      throw err;
    }
  },

  _buildReportEmailHTML(studentName, reportType, isResend, company, language = 'en') {
    const isHindi = language === 'hi';

    let greeting, intro, attachNote, contactNote, closing;
    if (isHindi) {
      greeting = isResend ? `नमस्ते ${studentName},` : `बधाई हो, ${studentName}! 🎉`;
      const typeLabel = reportType === 'paid' ? 'Premium Career Counseling' : 'Free Career Counseling';
      intro = isResend
        ? `जैसा तुमने request किया था, यह रहा तुम्हारा <strong>${typeLabel} Report</strong> ${company.name} की तरफ से।`
        : `<strong>${company.name}</strong> के साथ career assessment complete करने के लिए शुक्रिया। तुम्हारी <strong>${typeLabel} Report</strong> तैयार है!`;
      attachNote = 'तुम्हारी report PDF की form में इस email के साथ attached है। इसे ध्यान से पढ़ो और अपने parents या guardian के साथ share करो।';
      contactNote = 'कोई सवाल है या report discuss करनी है तो हमसे contact करो:';
      closing = `तुम्हारे उज्जवल भविष्य की शुभकामनाएं,<br><strong style="color:#1e293b;">${company.name} Team</strong>`;
    } else {
      greeting = isResend ? `Hi ${studentName},` : `Congratulations, ${studentName}! 🎉`;
      const typeLabel = reportType === 'paid' ? 'Premium Career Counseling' : 'Free Career Counseling';
      intro = isResend
        ? `As requested, here is your <strong>${typeLabel} Report</strong> from ${company.name}.`
        : `Thank you for completing your career assessment with <strong>${company.name}</strong>. Your <strong>${typeLabel} Report</strong> is ready!`;
      attachNote = 'Please find your report attached to this email as a PDF. Review it carefully and share it with your parents or guardian.';
      contactNote = 'If you have any questions or would like to discuss your report, feel free to reach out to us:';
      closing = `Wishing you a bright future,<br><strong style="color:#1e293b;">${company.name} Team</strong>`;
    }

    const upgradeSection = reportType === 'free'
      ? (isHindi
          ? `<div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:16px 20px;margin:24px 0;border-radius:4px;">
               <p style="margin:0;font-weight:bold;color:#92400e;">Deeper analysis चाहिए?</p>
               <p style="margin:8px 0 0;color:#78350f;">सिर्फ ₹499 में <strong>Premium Report</strong> upgrade करो और personalized career paths, personality insights और detailed action plan पाओ।</p>
               <p style="margin:8px 0 0;"><a href="${company.website}" style="color:#1e40af;font-weight:bold;">अभी Upgrade करें →</a></p>
             </div>`
          : `<div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:16px 20px;margin:24px 0;border-radius:4px;">
               <p style="margin:0;font-weight:bold;color:#92400e;">Want a deeper analysis?</p>
               <p style="margin:8px 0 0;color:#78350f;">Upgrade to our <strong>Premium Report</strong> for only ₹499 and get personalized career paths, personality insights, and a detailed action plan.</p>
               <p style="margin:8px 0 0;"><a href="${company.website}" style="color:#1e40af;font-weight:bold;">Upgrade Now →</a></p>
             </div>`)
      : '';

    return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="font-family:Arial,sans-serif;background:#f8fafc;margin:0;padding:0;">
  <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
    <div style="background:#1e40af;padding:32px 40px;">
      <h1 style="color:#ffffff;margin:0;font-size:22px;">${company.name}</h1>
      <p style="color:#bfdbfe;margin:8px 0 0;font-size:14px;">Student Career Counseling</p>
    </div>
    <div style="padding:32px 40px;">
      <p style="font-size:18px;color:#1e293b;font-weight:bold;">${greeting}</p>
      <p style="color:#475569;line-height:1.6;">${intro}</p>
      <p style="color:#475569;line-height:1.6;">${attachNote}</p>
      ${upgradeSection}
      <p style="color:#475569;line-height:1.6;">${contactNote}</p>
      <div style="background:#f1f5f9;padding:16px 20px;border-radius:6px;margin:16px 0;">
        <p style="margin:0;color:#334155;"><strong>📧 Email:</strong> <a href="mailto:${company.email}" style="color:#1e40af;">${company.email}</a></p>
        <p style="margin:8px 0 0;color:#334155;"><strong>📍 Address:</strong> ${company.address}</p>
      </div>
      <p style="color:#94a3b8;font-size:13px;margin-top:32px;">${closing}</p>
    </div>
    <div style="background:#f8fafc;padding:16px 40px;border-top:1px solid #e2e8f0;text-align:center;">
      <p style="color:#94a3b8;font-size:12px;margin:0;">&copy; ${new Date().getFullYear()} ${company.name}. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
  },
};

module.exports = EmailService;
