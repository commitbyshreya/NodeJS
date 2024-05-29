const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

//@desc Getall contacts
//@route GET/api/contact
//@access private
const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({ user_id: req.user.id });
  res.status(200).json(contacts);
  console.log("Contacts returned");
});

//@desc Get single contact
//@route GET/api/contact/:id
//@access private
const getContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found!");
  }
  res.status(200).json(contact);
});

//@desc Create Contact
//@route POST/api/contact/:id
//@access private
const createContact = asyncHandler(async (req, res) => {
  console.log("Body: ", req.body);
  const { name, phone } = req.body;
  if (!name || !phone) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  
  const contact = await Contact.create({
    name,
    phone,
    user_id: req.user.id,
  });

  res.json(contact);
  console.log("Contact Created");
});

//@desc Update Contact
//@route PUT/api/contact/:id
//@access private
const updateContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found!");
  }

  if (contact.user_id.toString() !== req.user.id){
    res.status(403)
    throw new Error("User don't have permission to acess other contacts")
  }
  const updateContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true } // to get the updated version, return new document
  );
  res.status(200).json(updateContact);
  console.log("Contact Updated");
});

//@desc Delete Contact
//@route DELETE/api/contact/:id
//@access private
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact Not found");
  }
  if (contact.user_id.toString() !== req.user.id){
    res.status(403)
    throw new Error("User don't have permission to acess other contacts")
  }
  const deleteContact = await Contact.findByIdAndDelete({ _id: req.params.id });
  res.json(deleteContact);
  console.log("Contact deleted")
});

module.exports = {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
};
