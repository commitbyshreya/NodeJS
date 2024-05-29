const {
    VALIDATION_ERROR,
    UNAUTHORIZED,
    FORBIDDEN,
    NOT_FOUND, SERVER_ERROR
} = require("../constants")

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;

  switch (statusCode) {
    case VALIDATION_ERROR:
      res.json({
        title: "Validation Failed",
        err: err.message,
        stackTrace: err.stack,
      });
          break;
      case UNAUTHORIZED:
        res.json({
            title: "Authorization Failed",
            err: err.message,
            stackTrace: err.stack,
          });
              break;
      case FORBIDDEN:
        res.json({
            title: "Forbidden",
            err: err.message,
            stackTrace: err.stack,
          });
              break;
      case NOT_FOUND:
        res.json({
            title: "Not FOund",
            err: err.message,
            stackTrace: err.stack,
          });
              break;
      case SERVER_ERROR:
        res.json({
            title: "Server Error",
            err: err.message,
            stackTrace: err.stack,
          });
              break;

      default:
          console.log("No error. All Good!")
      break;
  }

  res.json({ err: err.message, stackTrace: err.stack });
};

module.exports = errorHandler;
