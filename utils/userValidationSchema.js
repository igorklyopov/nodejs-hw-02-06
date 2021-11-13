const Joi = require('joi');

const userValidationSchema = Joi.object({
  password: Joi.string()
    .pattern(/^(?=.*[0-9])(?=.*[a-zA-Z]).{5,8}$/)
    .message(
      'Password must contain from 5 to 8 characters, contain letters and numbers'
    )
    .required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .required(),
  subscription: Joi.string().min(3).max(20),
});

module.exports = userValidationSchema;
