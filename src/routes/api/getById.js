// src/routes/api/getById.js

const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const { createErrorResponse } = require ('../../response');
// const { query } = require('express');
// const md = require('markdown-it');
// const path = require('path');

module.exports = async (req, res) => {
  const id = req.params.id;
  try {
    // check if fragment exists
    const fragment = await Fragment.byId(req.user, id);
    let fragData = await fragment.getData();
    res.setHeader('Content-Type', fragment.type);
    res.status(200).send(fragData);
    logger.info({
      fragment: fragment, contentType: fragment.type 
    }, 'Fragment data successfully retrieved')
  } catch (err) {
    logger.error("Error retrieving fragment(s) data", err);
    res.status(404).json(createErrorResponse(404, 'Fragment data not found'));
  }
};
