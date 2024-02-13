// src/routes/api/get.js

const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require ('../../response');

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  // TODO: this is just a placeholder. To get something working, return an empty array...
  // res.status(200).json({
  //   status: 'ok',
  //   // TODO: change me
  //   fragments: [],
  // });

  // Modifications to the code
  // const resData =  {
  //   fragments: Fragment,
  // };

  try {
    // let frags = [];
    // frags = await Fragment.byUser(req.user, true);
    // res.status(200).json(createSuccessResponse({ frags }));
    // const data = { fragments: await Fragment.byUser(req.user, false) };

    const data = { fragments: await Fragment.byUser(req.user, req.query.expand) };
    const successResponse = createSuccessResponse(data);
    res.status(200).json(successResponse);
  } catch (error) {
    res.status(404).json(createErrorResponse("User's fragments not found"));
  }
};
