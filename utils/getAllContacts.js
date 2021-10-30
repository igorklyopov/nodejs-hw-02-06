const fs = require('fs/promises');

const contactsPath = require('../model/contactsPath');

const getAllContacts = async () => {
  const contactsData = await fs.readFile(contactsPath, 'utf8');
  return JSON.parse(contactsData);
};

module.exports = getAllContacts;
