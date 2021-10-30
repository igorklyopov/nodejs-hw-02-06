const express = require('express');
const router = express.Router();
const { NotFound, BadRequest } = require('http-errors');

const contacts = require('../../model/index.js');
const contactValidationSchema = require('../../utils/contactValidationSchema.js');

router.get('/', async (req, res, next) => {
  try {
    const contactsAll = await contacts.listContacts();

    res.json(contactsAll);
  } catch (error) {
    next(error);
  }
});

router.get('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const contact = await contacts.getContactById(contactId);

    if (!contact) {
      throw new NotFound('Not found');
    }

    res.status(200).json({ status: 'success', code: 200, data: { contact } });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { error } = contactValidationSchema.validate(req.body);

    if (error) {
      throw new BadRequest(error.message);
    }

    const contact = await contacts.addContact(req.body);

    res.status(201).json({ status: 'success', code: 201, data: contact });
  } catch (error) {
    next(error);
  }
});

router.delete('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;

    if (!contactId) {
      throw new NotFound('Not found');
    }

    await contacts.removeContact(contactId);
    res
      .status(200)
      .json({ status: 'success', code: 200, message: 'delete contact' });
  } catch (error) {
    next(error);
  }
});

router.put('/:contactId', async (req, res, next) => {
  try {
    const { error } = contactValidationSchema.validate(req.body);

    if (error) {
      throw new BadRequest(error.message);
    }

    const { contactId } = req.params;
    const updatedContact = await contacts.updateContact(contactId, req.body);

    if (!updatedContact) {
      throw new NotFound('Not found');
    }

    res.status(201).json({
      status: 'success',
      code: 201,
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
