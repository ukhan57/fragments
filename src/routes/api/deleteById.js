// src/routes/api/deleteById.js

const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const { createErrorResponse, createSuccessResponse } = require ('../../response');

module.exports = async (req, res) => {
  const id = req.params.id;
  try {
    // check if fragment exists
    const fragment = await Fragment.byId(req.user, id);
    if (fragment) {
      logger.info('Deleting fragment with id: ', id);
      await Fragment.delete(req.user, id);
      res.status(200).json(createSuccessResponse(200));  
    } else {
      res.status(404).json(createErrorResponse(404, 'Fragment not found'));  
    }
  } catch (err) {
    logger.error("Error deleting fragment", err);
    res.status(404).json(createErrorResponse(404, 'Fragment not found'));
  }
};
