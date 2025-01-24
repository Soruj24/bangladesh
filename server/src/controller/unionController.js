const { default: mongoose } = require("mongoose");
const Union = require("../model/Union");
const Upazila = require("../model/Upazila");
const { createUnion, getUnionsInUpazila, unionFindById } = require("../services/unionServices");
const Division = require("../model/Division");
const District = require("../model/District");

const handelCreateUnionInUpazila = async (req, res) => {
    try {
        const { name } = req.body;
        const { divisionId, districtId, upazilaId } = req.params;

        // Validate required parameters
        if (!divisionId || !districtId || !upazilaId) {
            return res.status(400).json({ message: "Missing required parameters." });
        }

        const ids = [divisionId, districtId, upazilaId];
        if (!ids.every(mongoose.Types.ObjectId.isValid)) {
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

        // Check for duplicate union name within the same upazila
        const nameExists = await Union.findOne({ name, upazila: upazilaId });
        if (nameExists) {
            return res.status(400).json({ message: 'Union with this name already exists in this Upazila.' });
        }

        // Create the Union
        const union = await Union.create({ name, upazila: upazilaId });
        if (!union) {
            return res.status(400).json({ message: 'Failed to create union. Please try again.' });
        }

        // Add the Union to the Upazila's unions array
        await Upazila.findByIdAndUpdate(upazilaId, { $push: { unions: union._id } });

        return res.status(201).json({
            message: 'Union created successfully',
            union,
        });

    } catch (error) {
        console.error('Error creating union:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
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

        if (!mongoose.Types.ObjectId.isValid(divisionId) ||
            !mongoose.Types.ObjectId.isValid(districtId) ||
            !mongoose.Types.ObjectId.isValid(upazilaId) ||
            !mongoose.Types.ObjectId.isValid(unionId)) {
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

const handelGetAllUnions = async (req, res) => {
    try {
        
        const  union = await Union.find({}).populate('upazila');

        if (!union || union.length === 0) {
            return res.status(404).json({ message: 'Unions not found' });
        }

        return res.status(200).json({
            message: 'Unions fetched successfully',
            union,
        });

    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
}

const handelUnionDelete = async (req, res) => {
    try {
        const {   unionId } = req.params;

        // Check if all required parameters are present
        if (  !unionId) {
            return res.status(400).json({ message: "Missing required parameters." });
        }

        if ( 
            !mongoose.Types.ObjectId.isValid(unionId)
        ) {
            return res.status(400).json({ message: "Invalid ID format." });
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
        const { unionId } = req.params;
        const { name } = req.body;

        // Check if all required parameters are present
        if (!unionId || !name) {
            return res.status(400).json({ message: "Missing required parameters." });
        }

        // Validate the ID format
        if (!mongoose.Types.ObjectId.isValid(unionId)) {
            return res.status(400).json({ message: "Invalid ID format." });
        }

        // Find and update the union by ID
        const union = await Union.findByIdAndUpdate(
            unionId,
            { name },
            { new: true } 
        );

        // If the union is not found, respond with a not found message
        if (!union) {
            return res.status(404).json({ message: "Union not found" });
        }

        // If the union is found and updated, return the updated union data
        return res.status(200).json({
            message: "Union updated successfully",
            union,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};






module.exports = {
    handelCreateUnionInUpazila,
    handleUpdateUnion,
    handelGetSingleUnion,
    handelUnionDelete,
    handelGetUnions,
    handelGetAllUnions
};
