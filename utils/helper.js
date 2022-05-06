/**
 * Verify request query.
 * @param {object} req.params - The parameters received in the request.
 * @param {...array} properties - The properties you want to verify.
 * @returns {boolean} - Returns whether the properties are present and not empty in the request
 */

const validateEntityInfo = (entity, ...properties) => {
  for (let i = 0; i < properties.length; i++) {
    const element = properties[i];
    if (
      !Object.keys(entity).includes(element) ||
      Object.values(entity).includes("")
    ) {
      return false;
    }
  }
  return true;
};

module.exports = { validateEntityInfo };
