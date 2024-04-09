// src/routes/api/get-id-share.js

const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const logger = require('../../logger');

const signedUrl = require('../../model/data/aws/signed-url');

/**
 * Get a signed URL to share this fragment
 */
module.exports = async (req, res, next) => {
  const user = req.user;
  const id = req.params.id;

  try {
    const fragment = await Fragment.byId(user, id);
    const url = await signedUrl(fragment);

    logger.debug({ url, fragment }, 'signed URL for fragment');
    res.status(201).json(
      createSuccessResponse({
        url,
      })
    );
  } catch (err) {
    logger.info({ err, user, id }, 'GET fragment/:id/share error');
    return next(createErrorResponse(404, `unable to get fragment with id ${id}`));
  }
};
