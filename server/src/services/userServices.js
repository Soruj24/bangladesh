const { default: mongoose } = require("mongoose");
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

const getAllUsers = async (search, page, limit) => {
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  const searchQuery = search
    ? {
        $or: [
          { name: new RegExp(search, "i") },
          { email: new RegExp(search, "i") },
        ],
      }
    : {};

  const users = await User.find(searchQuery)
    .skip((pageNumber - 1) * limitNumber)
    .limit(limitNumber);

  const totalUsers = await User.countDocuments(searchQuery);
  const totalPages = Math.ceil(totalUsers / limitNumber);

  return {
    users,
    pagination: {
      totalUsers,
      totalPages,
      currentPage: pageNumber,
      limit: limitNumber,
    },
  };
};

const getSingleUser = async (userId) => {
  if (!mongoose.isValidObjectId(userId)) {
    throw new Error("Invalid user ID");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

const updateUser = async (userId, updateData) => {
  try {
    const allowedUpdates = ["name"];
    const updates = {};

    for (let key in updateData) {
      if (allowedUpdates.includes(key)) {
        updates[key] = updateData[key];
      } else if (key === "email") {
        throw new Error("You can't update the email");
      }
    }

    // If no valid updates found
    if (Object.keys(updates).length === 0) {
      throw new Error("No valid fields to update");
    }

    // Update user with validation
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      {
        new: true,
        runValidators: true,  
      }
    );

    if (!updatedUser) {
      throw new Error("User not found");
    }

    return updatedUser;
  } catch (error) {
    if (error.name === "ValidationError") {
      throw new Error(`Validation error: ${error.message}`);
    }
    throw error;
  }
};

const userDelete = async (userId) => {
  const deletedUser = await User.findByIdAndDelete(userId);
  if (!deletedUser) {
    throw new Error("User not found");
  }

  return deletedUser;
};

module.exports = {
  userCreate,
  getAllUsers,
  getSingleUser,
  updateUser,
  userDelete,
};
