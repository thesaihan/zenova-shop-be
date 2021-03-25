export const notFoundHandler = (req, res, next) => {
  const error = new Error(`URL Not Found : ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "prod" ? undefined : err.stack,
  });
};
