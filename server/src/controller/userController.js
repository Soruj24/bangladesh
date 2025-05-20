const User = require("../model/userModel");
const {
  userCreate,
  getAllUsers,
  getSingleUser,
  updateUser,
  userDelete,
} = require("../services/userServices");
const { successResponse } = require("./responesController");

const handelUserCreate = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const savedUser = await userCreate(name, email, password);

    return successResponse(res, {
      statusCode: 200,
      message: "User registered successfully",
      payload: {
        user: {
          id: savedUser._id,
          name: savedUser.name,
          email: savedUser.email,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const handelGetAllUsers = async (req, res, next) => {
  try {
    const { search = "", page = 1, limit = 5 } = req.query;

    // Convert page and limit to integers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const { users, pagination } = await getAllUsers(
      search,
      pageNumber,
      limitNumber
    );

    return successResponse(res, {
      statusCode: 200,
      message: "Users fetched successfully",
      payload: {
        users: users.map((user) => ({
          id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          isSuperAdmin: user.isSuperAdmin,
        })),
        pagination: {
          totalUsers: pagination.totalUsers,
          totalPages: pagination.totalPages,
          currentPage: pagination.currentPage,
          limit: pagination.limit,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const handelGetSingalUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const user = await getSingleUser(userId);

    return successResponse(res, {
      statusCode: 200,
      message: "User fetched successfully",
      payload: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          isSuperAdmin: user.isSuperAdmin,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const handelUpdateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    await getSingleUser(userId);

    const updateData = await updateUser(userId, req.body);

    return successResponse(res, {
      statusCode: 200,
      message: "User updated successfully",
      payload: {
        user: {
          id: updateData._id,
          name: updateData.name,
          email: updateData.email,
          isAdmin: updateData.isAdmin,
          isSuperAdmin: updateData.isSuperAdmin,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const handelUserDelete = async (req, res, next) => {
  try {
    const userId = req.params.id;
    await getSingleUser(userId);

    const deletedUser = await userDelete(userId);

    return successResponse(res, {
      statusCode: 200,
      message: "User deleted successfully",
      payload: {
        user: {
          id: deletedUser._id,
          name: deletedUser.name,
          email: deletedUser.email,
          isAdmin: deletedUser.isAdmin,
          isSuperAdmin: deletedUser.isSuperAdmin,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const handelAdminUpdateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const action = req.body.role;
    console.log("action userId", userId, action);
    let update;

    if (action === "super-admin") {
      update = { isSuperAdmin: true }; // Set both true for super admin
    } else if (action === "admin") {
      update = { isAdmin: true, isSuperAdmin: false }; // Admin without super admin privileges
    } else {
      update = { isAdmin: false, isSuperAdmin: false }; // Remove both roles
    }

    const updatedUser = await User.findByIdAndUpdate(userId, update, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res
      .status(200)
      .json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    console.log("error", error);
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Failed to update user" });
  }
};

module.exports = {
  handelUserCreate,
  handelGetAllUsers,
  handelGetSingalUser,
  handelAdminUpdateUser,
  handelUpdateUser,
  handelUserDelete,
};
