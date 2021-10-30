const fs = require('fs/promises');
const crypto = require('crypto');

const contactsPath = require('./contactsPath');
const getAllContacts = require('../utils/getAllContacts');

const listContacts = async () => await getAllContacts(contactsPath);

const getContactById = async (contactId) => {
  const allContacts = await getAllContacts();

  const desiredContact = allContacts.find(
    ({ id }) => id.toString() === contactId.toString()
  );

  if (desiredContact) {
    return desiredContact;
  } else {
    return null;
  }
};

const removeContact = async (contactId) => {
  const prevContacts = await getAllContacts();
  const deletedContact = prevContacts.find(
    ({ id }) => id.toString() === contactId.toString()
  );

  if (!deletedContact) {
    return null;
  }

  const newContacts = prevContacts.filter(
    ({ id }) => id.toString() !== contactId.toString()
  );

  await fs.writeFile(contactsPath, JSON.stringify(newContacts, null, 2));

  return newContacts;
};

const addContact = async ({ name, email, phone }) => {
  const prevContacts = await getAllContacts();
  const newContact = { id: crypto.randomUUID(), name, email, phone };
  const updatedContacts = [...prevContacts, newContact];

  await fs.writeFile(contactsPath, JSON.stringify(updatedContacts, null, 2));

  return newContact;
};

const updateContact = async (contactId, body) => {
  const allContacts = await getAllContacts();

  const updatedContactIdx = allContacts.findIndex(
    (contact) => contact.id.toString() === contactId.toString()
  );

  if (updatedContactIdx === -1) {
    return null;
  }

  allContacts[updatedContactIdx] = { id: contactId, ...body };

  await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2));

  return allContacts[updatedContactIdx];
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
