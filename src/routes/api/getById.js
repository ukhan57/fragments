// src/routes/api/getById.js

const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const { createErrorResponse } = require ('../../response');
const md = require('markdown-it');
const path = require('path');

// module.exports = async (req, res) => {
//   const id = req.params.id;
//   try {
//     // check if fragment exists
//     const fragment = await Fragment.byId(req.user, id);
//     let fragData = await fragment.getData();
//     res.setHeader('Content-Type', fragment.type);
//     res.status(200).send(fragData);
//     logger.info({
//       fragment: fragment, contentType: fragment.type 
//     }, 'Fragment data successfully retrieved')
//   } catch (err) {
//     logger.error("Error retrieving fragment(s) data", err);
//     res.status(404).json(createErrorResponse(404, 'Fragment data not found'));
//   }
// };

module.exports = async (req, res) => {
  let fragment;
  let fragData;
  const id = req.params.id;
  try {
    switch (path.extname(id)) {
      case '.html':
        try {
          const fragment = await Fragment.byId(req.user, path.basename(id, path.extname(id)));
          fragData = await fragment.getData();
          if (fragment.type === 'text/markdown') {
           const htmlData = md.render(fragData.toString());
           res.setHeader('Content-Type', 'text/html');
           res.status(200).send(htmlData);
           logger.info({
            fragment: fragment, 
            contentType: fragment.type 
          }, 'Fragment data successfully retrieved');
          } else {
            res.status(415).json(createErrorResponse('Unsupproted fragment conversion'));
          }
        } catch (err) {
          logger.error("Error retrieving fragment data: ", err);
          res.status(415).json(createErrorResponse('Fragment data not found'));
        }
        break;

      case '':
        fragment = new Fragment(await Fragment.byId(req.user, id));
        fragData = await fragment.getData();
        res.setHeader('Content-Type', fragment.type);
        logger.info({
          fragment: fragment, 
          contentType: fragment.type 
        }, 'Fragment data successfully retrieved');
        res.status(200).send(fragData);
        break;

      default:
        res.status(415).json(createErrorResponse('Unsupported Type'));
        break;
    }
  } catch (err) {
    logger.error("Error retrieving fragment(s) data", err);
    res.status(404).json(createErrorResponse('Fragment data not found'));
  }
}
