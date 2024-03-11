// src/routes/api/getById.js

const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const { createErrorResponse } = require ('../../response');

module.exports = async (req, res) => {
  const id = req.params.id;
  try {
    // check if fragment exists
    const fragment = await Fragment.byId(req.user, id);
    const fragData = await fragment.getData();
    res.setHeader('Content-Type', fragment.type);
    res.status(200).send(fragData);
  } catch (err) {
    logger.warn("Error retrieving fragment(s) data", err);
    res.status(404).json(createErrorResponse(404, 'Fragments data not found'));
  }
};
