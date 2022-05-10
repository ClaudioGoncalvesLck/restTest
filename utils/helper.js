/**
 * Handle validation errors
 * @param {object} error - The caught validation error.
 * @returns {object} - Returns object with the fields and their respective errors
 */
const inputValidationErrorHandler = (error) => {
  const errorData = error.data;
  const errors = {};

  for (const key in errorData) {
    if (Object.hasOwnProperty.call(errorData, key)) {
      const element = errorData[key];

      if (element[0].keyword === "required") {
        errors[key] = { message: `is required` };
      } else {
        errors[key] = { message: element[0].message };
      }
    }
  }
  return errors;
};

module.exports = { inputValidationErrorHandler };
