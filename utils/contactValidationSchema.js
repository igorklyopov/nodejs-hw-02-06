const Joi = require('joi');

const contactValidationSchema = Joi.object({
  name: Joi.string().min(1).max(40).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .required(),
  phone: Joi.string().min(7).max(20).required(),
  favorite: Joi.boolean(),
});

module.exports = contactValidationSchema;
