const Division = require("../model/Division");
const District = require("../model/District");
const Upazila = require("../model/Upazila");
const Union = require("../model/Union");
const Village = require("../model/Village");
const Population = require("../model/populationModel");

const getPublicStats = async (req, res, next) => {
  try {
    const [divisions, districts, upazilas, unions, villages, population] =
      await Promise.all([
        Division.countDocuments(),
        District.countDocuments(),
        Upazila.countDocuments(),
        Union.countDocuments(),
        Village.countDocuments(),
        Population.countDocuments(),
      ]);

    return res.status(200).json({
      success: true,
      message: "Stats fetched successfully",
      payload: {
        divisions,
        districts,
        upazilas,
        unions,
        villages,
        population,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getPublicDivisions = async (req, res, next) => {
  try {
    const divisions = await Division.find().select("name").lean();
    return res.status(200).json({
      success: true,
      message: "Divisions fetched successfully",
      payload: { divisions },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPublicStats, getPublicDivisions };
