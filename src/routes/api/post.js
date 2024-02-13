// src/routes/api/post.js

const { Fragment } = require('../../model/fragment');
require('dotenv').config();

const { createSuccessResponse, createErrorResponse } = require ('../../response');
const logger = require('../../logger');

/*
 * Create a fragment for the current user
*/
module.exports = async (req, res) => {
  try {
    if (!Buffer.isBuffer(req.body)) {
      return res.status(415).json(createErrorResponse(415, 'Unsupported Content-Type'));
    }

    // const type = req.get('Content-Type');
    
    // To support text/plain type of fragments only
    if (!Fragment.isSupportedType(req.get('Content-Type'))) {
      return res.status(415).json(createErrorResponse(415, 'Unsupported Content-Type'));
    }

    const ownerId = req.user;
    const fragment = new Fragment({ownerId, type: req.get('Content-Type'), size: req.body.length,});

    await fragment.save();
    await fragment.setData(req.body);
    
    res.setHeader('Content-Type', fragment.type);
    res.set('Location', `http://${req.headers.host}/v1/fragments/${fragment.id}`);

    res.status(201).json(createSuccessResponse({fragment: fragment}));

    logger.info({ fragment: fragment }, `Fragment successfully posted`);
  } catch (error) {
    logger.Error({error}, 'Error creating fragment');
    res.status(500).json(createErrorResponse(500, `${error}`));
  }
};
