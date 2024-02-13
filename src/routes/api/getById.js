// src/routes/api/getFragment.js

const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const { createErrorResponse, createSuccessResponse } = require ('../../response');

module.exports = async (req, res) => {
  const { id } = req.params;
  try {
    // check if fragment exists
    const fragment = await Fragment.byId(req.user, id);
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.status(200).json(createSuccessResponse(fragment));
  } catch (err) {
    logger.warn(err);
    res.status(404).json(createErrorResponse(404, 'Fragment not found'));
  }
};
