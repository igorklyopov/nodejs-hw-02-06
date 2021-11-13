const express = require('express');
const router = express.Router();

const contactsOperations = require('../../controllers/contactsOperations');
const contactValidationSchema = require('../../utils/contactValidationSchema');
const makeValidation = require('../../utils/makeValidation');
const controllerErrorCatcher = require('../../utils/controllerErrorCatcher');
const authenticate = require('../../utils/authenticate');

router.get(
  '/',
  controllerErrorCatcher(authenticate),
  controllerErrorCatcher(contactsOperations.listContacts)
);

router.get(
  '/:contactId',
  controllerErrorCatcher(authenticate),
  controllerErrorCatcher(contactsOperations.getContactById)
);

router.post(
  '/',
  controllerErrorCatcher(authenticate),
  makeValidation(contactValidationSchema),
  controllerErrorCatcher(contactsOperations.addContact)
);

router.put(
  '/:contactId',
  controllerErrorCatcher(authenticate),
  makeValidation(contactValidationSchema),
  controllerErrorCatcher(contactsOperations.updateContact)
);

router.patch(
  '/:contactId/favorite',
  controllerErrorCatcher(authenticate),
  controllerErrorCatcher(contactsOperations.updateStatusContact)
);

router.delete(
  '/:contactId',
  controllerErrorCatcher(authenticate),
  controllerErrorCatcher(contactsOperations.removeContact)
);

module.exports = router;
