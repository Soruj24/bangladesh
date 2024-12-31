const { default: mongoose } = require("mongoose");
const District = require("../model/District");
const Upazila = require("../model/Upazila");
const createError = require("http-errors")


const upazilaFindById = async (divisionId, districtId, upazilaId) => {

    try {
        // Validate if all required params are provided
        if (!divisionId || !districtId || !upazilaId) {
            throw createError(400, "Missing required parameters.");
        }

        if (!mongoose.Types.ObjectId.isValid(divisionId) ||
            !mongoose.Types.ObjectId.isValid(districtId) ||
            !mongoose.Types.ObjectId.isValid(upazilaId)) {
            throw createError(400, "Invalid ID format")
        }

        // Find the division and district to ensure data consistency
        const district = await District.findOne({
            _id: districtId,
            division: divisionId,
        }).populate("upazilas");

        if (!district) {
            throw createError(404, "District not found. ")
        }

        // Find the specific upazila
        const upazila = district.upazilas.find((up) => up._id.toString() === upazilaId);

        if (!upazila) {
            throw createError(404, "Upazila not found.")
        }

        return upazila;
    } catch (error) {
        console.log(error)

    }
}



module.exports = { upazilaFindById };