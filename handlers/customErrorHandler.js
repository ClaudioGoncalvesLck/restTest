const res = require("express/lib/response");
const { NotFoundError, ValidationError } = require("objection");
const environment = process.env.NODE_ENV || "development";

const response = { message: "Something went wrong", statusCode: 500 };

function responseBuilder(err) {
  if (environment == "production") {
    if (err instanceof NotFoundError) {
      response.message = "Not found";
      response.statusCode = 404;
      return response;
    } else if (err instanceof ValidationError) {
      return response;
    } else {
    }
  } else {
    return {
      message: err.message,
      statusCode: err.statusCode,
      stack: err.stack,
    };
  }
}

function errorHandler(err, req, res, next) {
  const response = responseBuilder(err);
  res.status(200).send(response); // FIX
}

module.exports = errorHandler;
