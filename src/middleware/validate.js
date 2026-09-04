const mongoose = require('mongoose');
const { ApiError } = require('../utils');


function validateObjectId(req, _res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new ApiError(400, 'Invalid id format'));
  }
  next();
}

function validateCreate(req, _res, next) {
  const { title } = req.body;
  if (typeof title !== 'string' || title.trim().length === 0) {
    return next(new ApiError(400, 'title is required and must be a non-empty string'));
  }
  next();
}

function validateUpdate(req, _res, next) {
  const { title, completed } = req.body;
  if (title !== undefined && (typeof title !== 'string' || title.trim().length === 0)) {
    return next(new ApiError(400, 'title must be a non-empty string'));
  }
  if (completed !== undefined && typeof completed !== 'boolean') {
    return next(new ApiError(400, 'completed must be a boolean'));
  }
  next();
}

module.exports = { validateObjectId, validateCreate, validateUpdate };

