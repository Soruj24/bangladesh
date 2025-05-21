const { default: mongoose } = require("mongoose");
const District = require("../model/District");
const Division = require("../model/Division");
const createError = require("http-errors");

const districtCreated = async (name, divisionId) => {
  const nameExists = await District.findOne({ name });
  if (nameExists) {
    throw createError(400, "District already exists");
  }

  const district = await District.create({ name, division: divisionId });
  await Division.findByIdAndUpdate(divisionId, {
    $push: { districts: district._id },
  });

  return district;
};

const getAllDivisionsInDistrict = async (divisionId) => {
  try {
    const allDistrict = await Division.findById(divisionId).populate(
      "districts"
    );

    if (!allDistrict) {
      return res.status(404).json({ message: "Division not found" });
    }

    return allDistrict;
  } catch (error) {
    if (!mongoose.Types.ObjectId.isValid(divisionId)) {
      return createError(400, "Invalid division ID");
    }
    return createError(400, "division not found");
  }
};
const getSingleDistrict = async (divisionId, districtId) => {
  try {
    // Find the district by ID and ensure it matches the division
    const district = await District.findOne({ _id: districtId }).populate(
      "upazilas"
    );

    if (!district) {
      return res.status(404).json({ message: "District not found" });
    }

    return district;
  } catch (error) {
    if (!mongoose.Types.ObjectId.isValid(districtId)) {
      return createError(400, "Invalid division ID");
    }
    return createError(400, "division not found");
  }
};

const deleteDistrictWithOutDivision = async (districtId) => {
  try {
    const district = await District.findByIdAndDelete({ _id: districtId });
    if (!district) {
      throw createError(404, "District not found");
    }
    return district;
  } catch (error) {
    if (!mongoose.Types.ObjectId.isValid(districtId)) {
      throw createError(400, "Invalid division ID");
    }
    throw createError(400, "division not found");
  }
};

const districtUpdated = async (districtId, name) => {
  try {
    const district = await District.findByIdAndUpdate(
      { _id: districtId },
      { name },
      { new: true }
    );
    if (!district) {
      return res.status(404).json({ message: "District not found" });
    }
    return district;
  } catch (error) {
    if (!mongoose.Types.ObjectId.isValid(districtId)) {
      return createError(400, "Invalid division ID");
    }
    return createError(400, "division not found");
  }
};

const SingalDistrictWithOutDivision = async (districtId) => {
  if (!mongoose.Types.ObjectId.isValid(districtId)) {
    throw createError(400, "Invalid division ID");
  }
  const district = await District.findById(districtId).populate("upazilas");

  if (!district) {
    throw createError(404, "District not found");
  }

  return district;
};

const updateDistrictWithOutDivision = async (districtId, name) => {
  const district = await District.findByIdAndUpdate(
    { _id: districtId },
    {
      name,
      value: name,
      label: name,
    },
    { new: true }
  );

  if (!district) {
    throw createError(404, "District not found");
  }

  return district;
};

module.exports = {
  districtCreated,
  getAllDivisionsInDistrict,
  getSingleDistrict,
  deleteDistrictWithOutDivision,
  districtUpdated,
  SingalDistrictWithOutDivision,
  updateDistrictWithOutDivision,
};
