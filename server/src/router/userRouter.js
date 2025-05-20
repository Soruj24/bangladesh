const {
  handelAdminUpdateUser,
  handelUserCreate,
  handelGetAllUsers,
  handelGetSingalUser,
  handelUpdateUser,
  handelUserDelete,
} = require("../controller/userController");
const { isLoggedOut, isAdmin, isLoggedIn } = require("../middleware/auth");
const { runValidation } = require("../validators");
const {
  validateUserRegister,
  validateUserLogin,
} = require("../validators/userValidators");

const userRouter = require("express").Router();

userRouter.post(
  "/register",
  isLoggedOut,
  validateUserRegister,
  runValidation,
  handelUserCreate
);
userRouter.get(
  "/",
  isLoggedIn,
  validateUserLogin,
  runValidation,
  isAdmin,
  handelGetAllUsers
);
userRouter.get("/:id", isLoggedIn, handelGetSingalUser);
userRouter.put("/:id", isLoggedIn, isAdmin, handelUpdateUser);
userRouter.delete("/:id", isLoggedIn, isAdmin, handelUserDelete);
userRouter.put("/manage-state/:id", isLoggedIn, handelAdminUpdateUser);

module.exports = userRouter;
