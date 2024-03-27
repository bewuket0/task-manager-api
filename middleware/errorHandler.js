const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (error, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = error.message;

  if (error.name === "CastError" && error.kind === "ObjectId") {
    //handling mongodb query conversion error
    statusCode = 400;
    message = "Resource not found";
  }

  if (error.name === "ZodError") {
    //handling validation errors
    // console.error(error);
    message = error.issues;
  }
  res.status(statusCode).json({
    message,

    stack: process.env.NODE_ENV == "development" ? error.stack : null,
  });
};

module.exports = { notFound, errorHandler };
