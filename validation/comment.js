const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateCommentInput(data) {
  let errors = {};

  data.text = !isEmpty(data.text) ? data.text : "";

  data.code = !isEmpty(data.code) ? data.code : "";

  if (Validator.isEmpty(data.text)) {
    errors.text = "Text is required";
  }

  if (!Validator.isLength(data.text, { min: 4, max: 500 })) {
    errors.text = "Comment must be between 4 and 500 characters";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
