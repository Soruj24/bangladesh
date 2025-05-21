// controllers/divisionController.js
const createError = require("http-errors");

const Division = require("../model/Division");
const {
  singleDivision,
  divisionDeleted,
  divisionUpdated,
  getDivision,
  divisionCreated,
} = require("../services/divisonServices");
const { successResponse } = require("./responesController");

// Create a Division
const handelCreateDivision = async (req, res, next) => {
  try {
    const { name } = req.body;

    const division = await divisionCreated(name);

    return successResponse(res, {
      statusCode: 200,
      message: "Division created successfully",
      payload: {
        division: {
          id: division._id,
          name: division.name,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const handelGetAllDivisions = async (req, res, next) => {
  try {
    const divisions = await getDivision();

    return successResponse(res, {
      statusCode: 200,
      message: "Division fetched successfully",
      payload: {
        divisions,
      },
    });
  } catch (error) {
    next(error);
  }
};

const handelGetSingleDivision = async (req, res, next) => {
  try {
    const divisionId = req.params.divisionId;
    const division = await singleDivision(divisionId);

    return successResponse(res, {
      statusCode: 200,
      message: "Division fetched successfully",
      payload: {
        division,
      },
    });
  } catch (error) {
    next(error);
  }
};

const handelDeleteDivision = async (req, res, next) => {
  try {
    const divisionId = req.params.divisionId;

    await singleDivision(divisionId);

    const division = await divisionDeleted(divisionId);

    return successResponse(res, {
      statusCode: 200,
      message: "Division deleted successfully",
      payload: {
        division,
      },
    });
  } catch (error) {
    next(error);
  }
};

const handelUpdateDivision = async (req, res, next) => {
  try {
    const divisionId = req.params.divisionId;
    const updateData = req.body; // Get all possible update fields
    await singleDivision(divisionId);

    const division = await divisionUpdated(divisionId, updateData);

    return successResponse(res, {
      statusCode: 200,
      message: "Division updated successfully",
      payload: {
        division,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handelCreateDivision,
  handelGetAllDivisions,
  handelGetSingleDivision,
  handelDeleteDivision,
  handelUpdateDivision,
};
