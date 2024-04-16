// src/routes/api/putById.js

require('dotenv').config();

const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const { createErrorResponse, createSuccessResponse } = require ('../../response');

// For setting the header, choosing the appropriate header
let apiUrl;
if (process.env.API_URL) {
  apiUrl = process.env.API_URL;
} else {
  apiUrl = 'http://localhost:8080';
}

module.exports = async (req, res) => {
  const id = req.params['id'];
  try {
    // check if fragment exists
    let fragment = new Fragment (await Fragment.byId(req.user, id));

    // check content-type matches the existing fragments type
    if (req.headers['content-type'] != fragment.type && !Buffer.isBuffer(req.body)) {
      res.status(400).json(createErrorResponse(400, 'Content-type of the request does not match the existing fragments type'));
      logger.error("Content-type of the request does not match the existing fragment's type");
    } else {
      logger.info('Updating the user fragment')
      await fragment.save();
      await fragment.setData(req.body);
      res.setHeader('Content-Type', fragment.type);
      res.setHeader('Location', `${apiUrl}/v1/fragments/${fragment.id}`);
      res.status(200).json(createSuccessResponse(fragment));
      logger.debug({
        fragment: fragment, contentType: fragment.type 
      }, 'Fragment data successfully updated')
    }
  } catch (err) {
    logger.error("Something went wrong with the PUT request", {err});
    res.status(404).json(createErrorResponse(404, 'Fragment data not found'));
  }
};
