const { default: mongoose } = require("mongoose");
const Division = require("../model/Division");
const createError = require("http-errors");

const getDivision = async () => {
  try {
    const divisions = await Division.find().populate({
      path: "districts",
      model: "District",
      populate: {
        path: "upazilas",
        model: "Upazila",
        populate: {
          path: "unions",
          model: "Union",
          populate: {
            path: "villages",
            model: "Village",
          },
        },
      },
    });

    return divisions;
  } catch (error) {
    throw createError(400, "division not found");
  }
};

const divisionCreated = async (name) => {
  const nameExists = await Division.findOne({ name });
  if (nameExists) {
    throw createError(400, "Division already exists");
  }
  const division = await Division.create({ name });
  return division;
};

const singleDivision = async (divisionId) => {
  try {
    const division = await Division.findById(divisionId);
    if (!division) {
      throw createError(400, "division not found");
    }

    return division;
  } catch (error) {
    if (!mongoose.Types.ObjectId.isValid(divisionId)) {
      throw createError(400, "Invalid division ID");
    }
    throw createError(400, "division not found");
  }
};
const divisionDeleted = async (id) => {
  try {
    const divisionDeleted = await Division.findByIdAndDelete(id);
    return divisionDeleted;
  } catch (error) {
    throw createError(400, "division not found");
  }
};

const divisionUpdated = async (divisionId, updateName) => {
  try {
    const { name } = updateName;

    const divisionUpdated = await Division.findByIdAndUpdate(
      divisionId,
      {
        name,
        value: name,
        label: name,
      },
      { new: true }
    );

    return divisionUpdated;
  } catch (error) {
    throw error;
  }
};
module.exports = {
  getDivision,
  divisionCreated,
  singleDivision,
  divisionDeleted,
  divisionUpdated,
};
