const express = require('express');
const router = express.Router();

const usersOperations = require('../../controllers/usersOperations');
const controllerErrorCatcher = require('../../utils/controllerErrorCatcher');
const userValidationSchema = require('../../utils/userValidationSchema');
const makeValidation = require('../../utils/makeValidation');
const authenticate = require('../../utils/authenticate');

router.post(
  '/signup',
  makeValidation(userValidationSchema),
  controllerErrorCatcher(usersOperations.signUp)
);

router.post(
  '/login',
  makeValidation(userValidationSchema),
  controllerErrorCatcher(usersOperations.logIn)
);

router.post(
  '/logout',
  controllerErrorCatcher(authenticate),
  controllerErrorCatcher(usersOperations.logOut)
);

router.get(
  '/current',
  controllerErrorCatcher(authenticate),
  controllerErrorCatcher(usersOperations.getCurrentUser)
);

module.exports = router;
