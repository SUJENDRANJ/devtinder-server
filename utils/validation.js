const validator = require("validator");

const validateSignupData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid!");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong Password!");
  }
};

const validateEditData = (req) => {
  const validEditData = [
    "firstName",
    "lastName",
    "emailId",
    "photoUrl",
    "age",
    "about",
    "skills",
    "gender",
  ];

  // console.log(Object.keys(req.body)); //* array

  return Object.keys(req.body).every((field) => validEditData.includes(field));
};

module.exports = { validateSignupData, validateEditData };
