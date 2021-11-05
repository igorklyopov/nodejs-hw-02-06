const express = require('express');
const router = express.Router();

const contactsOperations = require('../../controllers/contactsOperations');
const contactValidationSchema = require('../../utils/contactValidationSchema');
const makeContactsValidation = require('../../utils/makeContactsValidation');
const controllerErrorCatcher = require('../../utils/controllerErrorCatcher');

router.get('/', controllerErrorCatcher(contactsOperations.listContacts));

router.get(
  '/:contactId',
  controllerErrorCatcher(contactsOperations.getContactById)
);

router.post(
  '/',
  makeContactsValidation(contactValidationSchema),
  controllerErrorCatcher(contactsOperations.addContact)
);

router.put(
  '/:contactId',
  makeContactsValidation(contactValidationSchema),
  controllerErrorCatcher(contactsOperations.updateContact)
);

router.patch(
  '/:contactId/favorite',
  controllerErrorCatcher(contactsOperations.updateStatusContact)
);

router.delete(
  '/:contactId',
  controllerErrorCatcher(contactsOperations.removeContact)
);

module.exports = router;
