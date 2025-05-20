const {
  handelCreateDivision,
  handelGetAllDivisions,
  handelDeleteDivision,
  handelUpdateDivision,
  handelGetSingleDivision,
} = require("../controller/divisionController");
const { isLoggedIn, isSuperAdmin } = require("../middleware/auth");
const { runValidation } = require("../validators");
const { validateName } = require("../validators/division");

const divisionRoutes = require("express").Router();

divisionRoutes.post(
  "/",
  isLoggedIn,
  isSuperAdmin,
  validateName,
  runValidation,
  handelCreateDivision
);
divisionRoutes.get("/", isLoggedIn, handelGetAllDivisions);
divisionRoutes.delete(
  "/:divisionId",
  isLoggedIn,
  isSuperAdmin,
  handelDeleteDivision
);
divisionRoutes.put(
  "/:divisionId",
  isLoggedIn,
  isSuperAdmin,
  handelUpdateDivision
);
divisionRoutes.get(
  "/:divisionId",
  isLoggedIn,
  isSuperAdmin,
  handelGetSingleDivision
);

module.exports = divisionRoutes;
