function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  if (req.app.get("env") !== "production") {
    console.error(err);
  }

  res.status(status).json({
    error: status === 500 ? "Internal Server Error" : "Request Error",
    message,
  });
}

module.exports = errorHandler;
