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

router.delete(
  '/:contactId',
  controllerErrorCatcher(contactsOperations.removeContact)
);

router.put(
  '/:contactId',
  makeContactsValidation(contactValidationSchema),
  controllerErrorCatcher(contactsOperations.updateContact)
);

router.put(
  '/:contactId/favorite',
  controllerErrorCatcher(contactsOperations.updateStatusContact)
);

router.patch(
  '/:contactId/favorite',
  controllerErrorCatcher(contactsOperations.updateStatusContact)
);

module.exports = router;
