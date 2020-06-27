const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validatePostInput(data) {
  let errors = {};

  data.text = !isEmpty(data.text) ? data.text : "";
  data.title = !isEmpty(data.title) ? data.title : "";
  data.code = !isEmpty(data.code) ? data.code : "";

  if (Validator.isEmpty(data.text)) {
    errors.text = "Text is required";
  }

  if (Validator.isEmpty(data.title)) {
    errors.title = "Title is required";
  }

  if (!Validator.isLength(data.text, { min: 4, max: 500 })) {
    errors.text = "Post must be between 4 and 500 characters";
  }

  if (!Validator.isLength(data.title, { min: 3, max: 500 })) {
    errors.text = "Title must be between 3 and 50 characters";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
