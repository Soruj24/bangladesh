const { default: mongoose } = require("mongoose");
const District = require("../model/District");
const Upazila = require("../model/Upazila");
const createError = require("http-errors")


const upazilaFindById = async ( upazilaId) => {

    try {
        // Validate if all required params are provided
        if (!upazilaId) {
            throw createError(400, "Missing required parameters.");
        }

        if ( !mongoose.Types.ObjectId.isValid(upazilaId)) {
            throw createError(400, "Invalid ID format")
        }

       

        // Find the specific upazila
        const upazila = District.upazilas.find((up) => up._id.toString() === upazilaId);

        if (!upazila) {
            throw createError(404, "Upazila not found.")
        }

        return upazila;
    } catch (error) {
        console.log(error)

    }
}



module.exports = { upazilaFindById };