const User = require("../model/userModel");

const userCreate = async (name, email, password) => {
  const newUser = new User({
    name,
    email,
    password,
  });

  const savedUser = await newUser.save();
  return savedUser;
};

 

module.exports = {
  userCreate,
};
