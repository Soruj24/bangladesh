const {
  handelGetAllDistricts,
  handelDistrictWithOutDivision,
  handelCreateDistrict,
  handelSingalDistrictWithOutDivision,
  handelDeleteDistrictWithOutDivision,
  handelUpdateDistrictWithOutDivision,
  handelSingalDistrictInDivision,
} = require("../controller/districtController");
const { isLoggedIn, isSuperAdmin } = require("../middleware/auth");
const { runValidation } = require("../validators");
const { validateName } = require("../validators/division");

const districtRoutes = require("express").Router();


districtRoutes.get(
  "/:divisionId/:districtId",
  isLoggedIn,
  handelSingalDistrictInDivision
);


districtRoutes.get(
  "/:districtId",
  isLoggedIn,
  handelSingalDistrictWithOutDivision
);

districtRoutes.post(
  "/:divisionId",
  isLoggedIn,
  isSuperAdmin,
  validateName,
  runValidation,
  handelCreateDistrict
);

districtRoutes.get("/:divisionId", isLoggedIn, handelGetAllDistricts);

districtRoutes.delete(
  "/:districtId",
  isLoggedIn,
  isSuperAdmin,
  handelDeleteDistrictWithOutDivision
);

districtRoutes.put(
  "/:districtId",
  isLoggedIn,
  handelUpdateDistrictWithOutDivision
);

districtRoutes.get("/", isLoggedIn, handelDistrictWithOutDivision);

module.exports = districtRoutes;
