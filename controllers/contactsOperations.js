const { NotFound, BadRequest } = require('http-errors');

const { Contact } = require('../model/contactsModel');

const listContacts = async (req, res) => {
  const contactsAll = await Contact.find({});

  res.json({
    status: 'success',
    code: 200,
    result: contactsAll,
  });
};

const getContactById = async (req, res, next) => {
  const { contactId } = req.params;
  const desiredContact = await Contact.findById(contactId);

  if (!desiredContact) {
    throw new NotFound('Not found');
  }

  res.status(200).json({
    status: 'success',
    code: 200,
    result: desiredContact,
  });
};

const removeContact = async (req, res) => {
  const { contactId } = req.params;
  const deletedContact = await Contact.findByIdAndRemove(contactId);

  if (!deletedContact) {
    throw new NotFound('Not found');
  }

  res.status(200).json({
    status: 'success',
    code: 200,
    message: 'delete contact',
  });
};

const addContact = async (req, res) => {
  const newContact = await Contact(req.body).save();

  res.status(201).json({
    status: 'success',
    code: 201,
    result: newContact,
  });
};

const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const updatedContact = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });

  if (!updatedContact) {
    throw new NotFound('Not found');
  }

  res.status(201).json({
    status: 'success',
    code: 201,
    data: updatedContact,
  });
};

const updateStatusContact = async (req, res) => {
  const { contactId } = req.params;
  const { favorite } = req.body;

  const updatedStatusContact = await Contact.findByIdAndUpdate(
    contactId,
    { favorite },
    { new: true }
  );

  if (!favorite && typeof favorite !== 'boolean') {
    throw new BadRequest('missing field favorite');
  }

  if (!updatedStatusContact) {
    throw new NotFound('Not found');
  }

  res.status(201).json({
    status: 'success',
    code: 201,
    data: updatedStatusContact,
  });
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
