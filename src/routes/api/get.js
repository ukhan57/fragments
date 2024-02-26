// src/routes/api/get.js

const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require ('../../response');

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  try {
    const expand = req.query.expand === '1'; 
    const data = { fragments: await Fragment.byUser(req.user, expand) };
    const successResponse = createSuccessResponse(data);
    res.status(200).json(successResponse);
  } catch (error) {
    res.status(404).json(createErrorResponse("User's fragments not found"));
  }
};
