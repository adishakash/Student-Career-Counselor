/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Store the Chromium binary inside the project so the path is predictable
  // across local dev and containerised deployments (e.g. DigitalOcean App Platform).
  cacheDirectory: '.cache/puppeteer',
};
