'use strict';
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const config = require('../../config/config');
const logger = require('../../utils/logger');

let s3Client = null;

function getClient() {
  if (s3Client) return s3Client;
  s3Client = new S3Client({
    endpoint: config.spaces.endpoint,
    region: config.spaces.region,
    credentials: {
      accessKeyId: config.spaces.accessKeyId,
      secretAccessKey: config.spaces.secretAccessKey,
    },
    forcePathStyle: false,
  });
  return s3Client;
}

const StorageService = {
  /**
   * Upload a buffer to DigitalOcean Spaces.
   * @param {string} key - Object key (e.g. 'pdfs/report_John_1234567.pdf')
   * @param {Buffer} buffer - File contents
   * @param {string} [contentType] - MIME type
   * @returns {Promise<string>} The key that was stored
   */
  async upload(key, buffer, contentType = 'application/pdf') {
    const client = getClient();
    await client.send(
      new PutObjectCommand({
        Bucket: config.spaces.bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        ACL: 'private',
      })
    );
    logger.info('Uploaded file to Spaces', { key, bucket: config.spaces.bucket });
    return key;
  },

  /**
   * Download an object from Spaces as a Buffer.
   * @param {string} key - Object key
   * @returns {Promise<Buffer>}
   */
  async download(key) {
    const client = getClient();
    const response = await client.send(
      new GetObjectCommand({
        Bucket: config.spaces.bucket,
        Key: key,
      })
    );
    const chunks = [];
    for await (const chunk of response.Body) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  },

  /**
   * Check if an object exists in Spaces.
   * @param {string} key - Object key
   * @returns {Promise<boolean>}
   */
  async exists(key) {
    const client = getClient();
    try {
      await client.send(
        new HeadObjectCommand({ Bucket: config.spaces.bucket, Key: key })
      );
      return true;
    } catch (err) {
      if (err.name === 'NotFound' || err.$metadata?.httpStatusCode === 404) {
        return false;
      }
      throw err;
    }
  },

  /**
   * Generate a short-lived pre-signed URL to download an object.
   * @param {string} key - Object key
   * @param {number} [expiresIn=3600] - Expiry in seconds
   * @returns {Promise<string>} Pre-signed URL
   */
  async getSignedUrl(key, expiresIn = 3600) {
    const client = getClient();
    const command = new GetObjectCommand({
      Bucket: config.spaces.bucket,
      Key: key,
    });
    return getSignedUrl(client, command, { expiresIn });
  },
};

module.exports = StorageService;
