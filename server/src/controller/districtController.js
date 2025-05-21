const { default: mongoose } = require("mongoose");
const District = require("../model/District");
const Division = require("../model/Division");
const { singleDivision } = require("../services/divisonServices");
const { successResponse } = require("./responesController");
const {
  districtCreated,
  SingalDistrictWithOutDivision,
  deleteDistrictWithOutDivision,
  updateDistrictWithOutDivision,
} = require("../services/districtServices");
const createError = require("http-errors");

// Create a District
const handelCreateDistrict = async (req, res, next) => {
  try {
    const { name } = req.body;

    const divisionId = req.params.divisionId;

    await singleDivision(divisionId);

    const district = await districtCreated(name, divisionId);

    return successResponse(res, {
      statusCode: 200,
      message: "District created successfully",
      payload: {
        district,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get Districts in a Division
const handelGetAllDistricts = async (req, res, next) => {
  try {
    const { divisionId } = req.params;

    await singleDivision(divisionId).populate("districts");

    // Check if Division exists
    // const division = await Division.findById(divisionId).populate("districts");

    // if (!division) {
    //   return res.status(404).json({ message: "Division not found" });
    // }

    return successResponse(res, {
      statusCode: 200,
      message: "Districts fetched successfully",
      payload: {
        district,
      },
    });
  } catch (error) {
    next(error);
  }
};

const handelDistrictWithOutDivision = async (req, res, next) => {
  try {
    const district = await District.find();

    if (!district || district.length === 0) {
      return res.status(404).json({ message: "District not found" });
    }

    return successResponse(res, {
      statusCode: 200,
      message: "Districts fetched1 successfully",
      payload: {
        district,
      },
    });
  } catch (error) {
    next(error);
  }
};

const handelSingalDistrictInDivision = async (req, res, next) => {
  try {
    const { divisionId, districtId } = req.params;

    const division = await Division.findById(divisionId).populate("districts");
    if (!division) {
      throw createError(404, "Division not found");
    }

    const isDistrictInDivision = division.districts.some(
      (district) => district._id.toString() === districtId
    );
    if (!isDistrictInDivision) {
      throw createError(404, "District not found in this division");
    }

    const district = await District.findById(districtId).select("-division");
    if (!district) {
      throw createError(404, "District not found");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "District retrieved successfully",
      payload: { district },
    });
  } catch (error) {
    next(error); 
  }
};
const handelDeleteDistrictWithOutDivision = async (req, res, next) => {
  try {
    const { districtId } = req.params;

    await SingalDistrictWithOutDivision(districtId);

    const districtDelete = await deleteDistrictWithOutDivision(districtId);

    return successResponse(res, {
      statusCode: 200,
      message: "District deleted successfully",
      payload: {
        district: districtDelete,
      },
    });
  } catch (error) {
    next(error);
  }
};

const handelUpdateDistrictWithOutDivision = async (req, res, next) => {
  try {
    const { name } = req.body;

    const { districtId } = req.params;
    await SingalDistrictWithOutDivision(districtId);

    const districtUpdated = await updateDistrictWithOutDivision(
      districtId,
      name
    );

    return successResponse(res, {
      statusCode: 200,
      message: "District updated successfully",
      payload: {
        district: districtUpdated,
      },
    });
  } catch (error) {
    next(error);
  }
};

const handelSingalDistrictWithOutDivision = async (req, res, next) => {
  try {
    const districtId = req.params.districtId;

    const district = await SingalDistrictWithOutDivision(districtId);

    return successResponse(res, {
      statusCode: 200,
      message: "District fetched successfully",
      payload: {
        district,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handelCreateDistrict,
  handelGetAllDistricts,
  handelSingalDistrictInDivision,
  handelDeleteDistrictWithOutDivision,
  handelUpdateDistrictWithOutDivision,
  handelDistrictWithOutDivision,
  handelSingalDistrictWithOutDivision,
};
