const { default: mongoose } = require("mongoose");
const District = require("../model/District");
const Upazila = require("../model/Upazila");


const upazilaFindById = async (res, divisionId, districtId, upazilaId) => {

    // Validate if all required params are provided
    if (!divisionId || !districtId || !upazilaId) {
        return res.status(400).json({ message: "Missing required parameters." });
    }

    if (!mongoose.Types.ObjectId.isValid(divisionId) ||
        !mongoose.Types.ObjectId.isValid(districtId) ||
        !mongoose.Types.ObjectId.isValid(upazilaId)) {
        return res.status(400).json({ message: "Invalid ID format" });
    }

    // Find the division and district to ensure data consistency
    const district = await District.findOne({
        _id: districtId,
        division: divisionId,
    }).populate("upazilas");

    if (!district) {
        return res.status(404).json({ message: "District not found." });
    }

    // Find the specific upazila
    const upazila = district.upazilas.find((up) => up._id.toString() === upazilaId);
    console.log('upazila', upazila)

    if (!upazila) {
        return res.status(404).json({ message: "Upazila not found." });
    }

    return upazila;
}



module.exports = { upazilaFindById };