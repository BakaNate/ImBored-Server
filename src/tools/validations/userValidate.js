const Joi = require('@hapi/joi');

const userValidate = async function (data) {
  const schema = Joi.object({
    userEmail: Joi.string()
      .pattern(/^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
      .required(),

    userPswd: Joi.string()
      .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{3,255}$/)
      .required(),
  });
  if (schema.validate(data).error) return false;
  return true;
};

module.exports = {
  userValidate,
};
