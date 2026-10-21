
const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      message: "Invalid task ID.",
    });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: err.message,
    });
  }

  res.status(err.status || 500).json({
    message: err.status ? err.message : "Internal server error.",
  });
};

module.exports = errorHandler;
