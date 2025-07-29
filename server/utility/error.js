exports.handleValidationError = (errors) => {
  if (!errors.isEmpty()) {
    console.log("errors", errors);
    const error = new Error("Validation failed");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
};

// exports.handleMongooseError = function (model, statusCode, message, failStep = null, failStepType = null) {
//   if (!model) {
//     if (failStepType) {
//       failStep = failStepType
//     }
//     const error = new Error(message);
//     error.statusCode = statusCode;
//     throw error;
//   }
// }

exports.handleCatchError = function (next, err) {
  console.log("err", err);
  if (!err.statusCode) {
    err.statusCode = 500;
    err.message = "Something went wrong on our end. Please try again later.";
  }
  next(err);
};
