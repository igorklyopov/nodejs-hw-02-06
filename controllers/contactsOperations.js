const { NotFound, BadRequest } = require('http-errors');

const { Contact } = require('../model/contactsModel');

const listContacts = async (req, res) => {
  const { page, limit, favorite } = req.query;

  const { _id } = req.user;
  const skipValue = (page - 1) * limit;
  const searchParams = { owner: _id };
  if (favorite) searchParams.favorite = favorite;

  const contactsAll = await Contact.find(
    searchParams,
    { owner: 0 },
    { skip: skipValue < 0 && skipValue, limit: limit < 0 && Number(limit) }
  );

  res.json({
    status: 'success',
    code: 200,
    result: contactsAll,
  });
};

const getContactById = async (req, res, next) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  console.log(owner);

  const desiredContact = await Contact.findById(contactId, { owner: 0 });

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
  const newContactData = { ...req.body, owner: req.user._id };

  const newContact = await Contact.create(newContactData);

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
    status: 'created',
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
