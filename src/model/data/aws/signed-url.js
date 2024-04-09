// src/model/data/aws/signed-url.js

const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { GetObjectCommand } = require('@aws-sdk/client-s3');

const s3Client = require('./s3Client');

/**
 * Get a signed URL to GET an existing fragment
 * @param {Fragment} fragment
 * @param {number} expiresIn number of seconds
 * @returns Promise<string>
 */
module.exports = (fragment, expiresIn = 3600) => {
  const { ownerId, id } = fragment;

  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${ownerId}/${id}`,
  });

  // NOTE: needs to get signed by AWS, returns a Promise<string>
  return getSignedUrl(s3Client, command, { expiresIn });
};
