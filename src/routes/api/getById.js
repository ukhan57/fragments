// src/routes/api/getById.js

const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const { createErrorResponse } = require ('../../response');
const MarkdownIt = require('markdown-it');
const sharp = require('sharp');

module.exports = async (req,res) => {
  const id = req.params.id
  const md = MarkdownIt();
  try {
    const fragment = new Fragment(await Fragment.byId(req.user, id));
    if (Fragment.isSupportedType(fragment.type)) {
      // for '.html' conversion
      if (req.params.ext === 'html') {
        // only markdown and html support html conversion
        if (fragment.type === 'text/markdown' || fragment.type === 'text/html') {
          const fragData = await fragment.getData();
          const convertedData = md.render(`${fragData}`);
          res.setHeader('Content-Type', 'text/html');
          res.status(200).send(convertedData);
        } else {
          res.status(415).json(createErrorResponse(415, 'Cannot convert data to .html'));
        }
      }
      // for '.txt' conversion 
      else if (req.params.ext === 'txt') {
        if (fragment.type === 'text/plain' || fragment.type === 'text/markdown' || fragment.type === 'text/html' || fragment.type === 'text/csv' || fragment.type === 'application/json') {
          const fragData = await fragment.getData();
          res.setHeader('Content-Type', 'text/plain');
          res.status(200).send(fragData);
        } else {
          res.status(415).json(createErrorResponse(415, 'Connot convert data to .txt'));
        }
      }
      // for .md
      else if (req.params.ext === 'md') {
        if (fragment.type === 'text/markdown') {
          const fragData = await fragment.getData();
          res.setHeader('Content-Type', 'text/markdown');
          res.status(200).send(fragData);
        } else {
          res.status(415).json(createErrorResponse(415, 'Cannot convert data to .md'));
        }
      }
      // for .json
      else if (req.params.ext === 'json') {
        if (fragment.type === 'application/json' || fragment.type === 'text/csv') {
          const fragData = await fragment.getData();
          res.setHeader('Content-Type', 'application/json');
          res.status(200).send(fragData);
        } else {
          res.status(415).json(createErrorResponse(415, 'Cannot convert data to .json'));
        }
      }
      // for .csv
      else if (req.params.ext === 'csv') {
        if (fragment.type === 'text/csv') {
          const fragData = await fragment.getData();
          res.setHeader('Content-Type', 'text/csv');
          res.status(200).send(fragData);
        } else {
          res.status(415).json(createErrorResponse(415, 'Cannot convert data to .csv'));
        }
      }
      // for .png, .jpg, .webp, .gif, .avif
      else if (req.params.ext === 'png' || req.params.ext === 'jpg' || req.params.ext === 'webp' || req.params.ext === 'gif' || req.params.ext === 'avif') {
        if (fragment.type.startsWith('image/')) {
          let fragData = await fragment.getData();
          logger.debug({fragData}, 'Fragment Data:')
          try {
            const convertedData = await sharp(Buffer.from(fragData)).toFormat(req.params.ext).toBuffer();
            res.setHeader('Content-Type', `image/${req.params.ext}`)
            res.status(200).send(convertedData); 
          } catch (error) {
            logger.error({error}, 'Error converting image');
            res.status(415).json(createErrorResponse(415, 'Error converting image'));
          }
        } else {
          res.status(415).json(createErrorResponse(415, 'Cannot convet non-image types'));
        }
      }
      // For default - if no ext provided
      else if (typeof req.params.ext === 'undefined') {
        const fragData = await fragment.getData();
        res.setHeader('Content-Type', fragment.type);
        res.status(200).send(fragData);
      } else {
        res.status(415).json(createErrorResponse(415, 'Unsupported Extension Type'));
      }
    } else {
      res.status(415).json(createErrorResponse(415, 'Conversion type provided is not supported'));
    }
  } catch (err) {
    logger.error({err}, 'Error fetching the fragment');
    res.status(404).json(createErrorResponse(404, 'Cannot retrieve the fragment with id provided.'));
  }
}
