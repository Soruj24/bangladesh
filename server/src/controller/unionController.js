const { default: mongoose } = require("mongoose");
const Union = require("../model/Union");
const Upazila = require("../model/Upazila");
const { createUnion, getUnionsInUpazila, unionFindById } = require("../services/unionServices");
const Division = require("../model/Division");
const District = require("../model/District");
const createError = require('http-errors');


const handelCreateUnion = async (req, res) => {
    try {
        const { name } = req.body;

        const { divisionId, districtId, upazilaId } = req.params;

        // Check if all required parameters are present
        if (!divisionId || !districtId || !upazilaId) {
            return res.status(400).json({ message: "Missing required parameters." });
        }
        
        console.log("divisionId", divisionId)
        console.log("districtId", districtId)
        console.log("upazilaId", upazilaId)

        if (
            !mongoose.Types.ObjectId.isValid(divisionId) ||
            !mongoose.Types.ObjectId.isValid(districtId) ||
            !mongoose.Types.ObjectId.isValid(upazilaId)
        ) {
            return res.status(400).json({ message: "Invalid ID format." });
        }

        // Check if Division exists
        const division = await Division.findById(divisionId);
        if (!division) {
            return res.status(404).json({ message: "Division not found" });
        }

        // Check if District exists
        const district = await District.findById(districtId);
        if (!district) {
            return res.status(404).json({ message: "District not found" });
        }

        // Check if Upazila exists
        const upazila = await Upazila.findById(upazilaId);
        if (!upazila) {
            return res.status(404).json({ message: "Upazila not found" });
        }


        const nameExists = await Union.findOne({ name })
        if (nameExists) {
            return res.status(400).json({ message: 'Union already exists' });
        }
        const union = await Union.create({
            name,
            upazila: upazilaId
        })
        if (!union) {
            return res.status(400).json({ message: 'Union not found' });
        }
        await Upazila.findByIdAndUpdate(upazilaId, { $push: { unions: union._id } })
        return res.status(201).json({
            message: 'Union created successfully',
            union,
        });


    } catch (error) {
        console.log(error)
        console.error('Error creating union:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};


// Get all Unions in an Upazila
const handelGetSingleUnion = async (req, res) => {
    try {
        const { divisionId, districtId, upazilaId, unionId } = req.params;

        // Check if all required parameters are present
        if (!divisionId || !districtId || !upazilaId || !unionId) {
            return res.status(400).json({ message: "Missing required parameters." });
        }

        if (
            !mongoose.Types.ObjectId.isValid(divisionId) ||
            !mongoose.Types.ObjectId.isValid(districtId) ||
            !mongoose.Types.ObjectId.isValid(upazilaId) ||
            !mongoose.Types.ObjectId.isValid(unionId)
        ) {
            return res.status(400).json({ message: "Invalid ID format." });
        }

        // Check if Division exists
        const division = await Division.findById(divisionId);
        if (!division) {
            return res.status(404).json({ message: "Division not found" });
        }

        // Check if District exists
        const district = await District.findById(districtId);
        if (!district) {
            return res.status(404).json({ message: "District not found" });
        }

        // Check if Upazila exists
        const upazila = await Upazila.findById(upazilaId);
        if (!upazila) {
            return res.status(404).json({ message: "Upazila not found" });
        }

        // Check if Union exists
        const union = await Union.findById(unionId);
        if (!union) {
            return res.status(404).json({ message: "Union not found" });
        }
        // Return the found Union
        return res.status(200).json({
            message: "Union fetched successfully.",
            union
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error." });
    }
};


const handelGetUnions = async (req, res) => {
    try {

        const { divisionId, districtId, upazilaId } = req.params;

        // Check if all required parameters are present
        if (!divisionId || !districtId || !upazilaId) {
            return res.status(400).json({ message: "Missing required parameters." });
        }

        if (
            !mongoose.Types.ObjectId.isValid(divisionId) ||
            !mongoose.Types.ObjectId.isValid(districtId) ||
            !mongoose.Types.ObjectId.isValid(upazilaId)
        ) {
            return res.status(400).json({ message: "Invalid ID format." });
        }

        // Check if Division exists
        const division = await Division.findById(divisionId);
        if (!division) {
            return res.status(404).json({ message: "Division not found" });
        }

        // Check if District exists
        const district = await District.findById(districtId);
        if (!district) {
            return res.status(404).json({ message: "District not found" });
        }

        // Check if Upazila exists
        const upazila = await Upazila.findById(upazilaId).populate('unions');
        if (!upazila) {
            return res.status(404).json({ message: "Upazila not found" });
        }




        return res.status(200).json({
            message: 'Union fetched successfully',
            unions: upazila.unions
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};


const handelUnionDelete = async (req, res) => {
    try {
        const { divisionId, districtId, upazilaId, unionId } = req.params;

        // Check if all required parameters are present
        if (!divisionId || !districtId || !upazilaId || !unionId) {
            return res.status(400).json({ message: "Missing required parameters." });
        }

        if (
            !mongoose.Types.ObjectId.isValid(divisionId) ||
            !mongoose.Types.ObjectId.isValid(districtId) ||
            !mongoose.Types.ObjectId.isValid(upazilaId) ||
            !mongoose.Types.ObjectId.isValid(unionId)
        ) {
            return res.status(400).json({ message: "Invalid ID format." });
        }


        // Check if Division exists
        const division = await Division.findById(divisionId);
        if (!division) {
            return res.status(404).json({ message: "Division not found" });
        }

        // Check if District exists
        const district = await District.findById(districtId);
        if (!district) {
            return res.status(404).json({ message: "District not found" });
        }

        // Check if Upazila exists
        const upazila = await Upazila.findById(upazilaId);
        if (!upazila) {
            return res.status(404).json({ message: "Upazila not found" });
        }

        // Check if Union exists
        const union = await Union.findByIdAndDelete(unionId);
        if (!union) {
            return res.status(404).json({ message: "Union not found" });
        }

        return res.status(200).json({
            message: 'Union deleted successfully',
            union
        });

    } catch (error) {
        console.error('Error while deleting union:', error);
        return res.status(500).json({ message: 'Server error' });
    }

};

const handleUpdateUnion = async (req, res) => {
    try {
        const { divisionId, districtId, upazilaId, unionId } = req.params;

        // Check if all required parameters are present
        if (!divisionId || !districtId || !upazilaId || !unionId) {
            return res.status(400).json({ message: "Missing required parameters." });
        }

        if (
            !mongoose.Types.ObjectId.isValid(divisionId) ||
            !mongoose.Types.ObjectId.isValid(districtId) ||
            !mongoose.Types.ObjectId.isValid(upazilaId) ||
            !mongoose.Types.ObjectId.isValid(unionId)
        ) {
            return res.status(400).json({ message: "Invalid ID format." });
        }


        // Check if Division exists
        const division = await Division.findById(divisionId);
        if (!division) {
            return res.status(404).json({ message: "Division not found" });
        }

        // Check if District exists
        const district = await District.findById(districtId);
        if (!district) {
            return res.status(404).json({ message: "District not found" });
        }

        // Check if Upazila exists
        const upazila = await Upazila.findById(upazilaId);
        if (!upazila) {
            return res.status(404).json({ message: "Upazila not found" });
        }
        // Find and update the union by ID with the request body data
        const union = await Union.findByIdAndUpdate(unionId, req.body, { new: true });

        // If the union is not found, respond with a not found message
        if (!union) {
            return res.status(404).json({
                message: "Union not found"
            });
        }

        // If the union is found and updated, return the updated union data
        return res.status(200).json({
            message: "Union updated successfully",
            union
        });

    } catch (error) {
        // Log the error for debugging and return a server error response
        console.error("Error updating union:", error);
        return res.status(500).json({
            message: "Server error"
        });
    }
};



module.exports = {
    handelCreateUnion,
    handleUpdateUnion,
    handelGetSingleUnion,
    handelUnionDelete,
    handelGetUnions
};
