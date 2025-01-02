const { default: mongoose } = require("mongoose");
const District = require("../model/District");
const Division = require("../model/Division");
const {
    districtCreated,
    getAllDivisionsInDistrict,
    getSingleDistrict,
    districtDelete,
    districtUpdated
} = require("../services/districtServices");


// Create a District
const createDistrict = async (req, res) => {
    try {
        const { name } = req.body;

        const { divisionId } = req.params;

        // Check if all required parameters are present
        if (!divisionId) {
            return res.status(400).json({ message: "Missing required parameters." });
        }

        if (
            !mongoose.Types.ObjectId.isValid(divisionId)

        ) {
            return res.status(400).json({ message: "Invalid ID format." });
        }

        // Check if Division exists
        const division = await Division.findById(divisionId);

        if (!division) {
            return res.status(404).json({ message: "Division not found" });
        }
        const nameExists = await District.findOne({ name })
        if (nameExists) {
            return res.status(400).json({
                message: 'District already exists'
            })
        }

        const district = await District.create({ name, division: divisionId });
        // Update Division with new District ID
        await Division.findByIdAndUpdate(divisionId, { $push: { districts: district._id } });

        return res.status(201).json({
            message: 'District created successfully',
            district,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Get Districts in a Division
const handelGetAllDistricts = async (req, res) => {
    try {

        const { divisionId } = req.params;
        console.log("divisionId", divisionId)

        // Check if all required parameters are present
        if (!divisionId) {
            return res.status(400).json({ message: "Missing required parameters." });
        }


        if (
            !mongoose.Types.ObjectId.isValid(divisionId)

        ) {
            return res.status(400).json({ message: "Invalid ID format." });
        }

        // Check if Division exists
        const division = await Division.findById(divisionId).populate('districts');

        if (!division) {
            return res.status(404).json({ message: "Division not found" });
        }
        console.log("division", division)


        return res.status(200).json({
            message: 'Districts fetched successfully',
            division
        });

        

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

const handelSingalDistrict = async (req, res) => {
    try {
        const { divisionId, districtId } = req.params;

        // Check if all required parameters are present
        if (!divisionId || !districtId) {
            return res.status(400).json({ message: "Missing required parameters." });
        }

        if (
            !mongoose.Types.ObjectId.isValid(divisionId) ||
            !mongoose.Types.ObjectId.isValid(districtId)

        ) {
            return res.status(400).json({ message: "Invalid ID format." });
        }

        // Check if Division exists
        const division = await Division.findById(divisionId);

        if (!division) {
            return res.status(404).json({ message: "Division not found" });
        }

        const district = await District.findOne({ _id: districtId })
            .populate('upazilas');


        return res.status(200).json({
            message: 'District fetched successfully',
            district,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};



const handelDistrictDelete = async (req, res) => {
    try {
        const { divisionId, districtId } = req.params;

        // Check if all required parameters are present
        if (!divisionId || !districtId) {
            return res.status(400).json({ message: "Missing required parameters." });
        }

        if (
            !mongoose.Types.ObjectId.isValid(divisionId) ||
            !mongoose.Types.ObjectId.isValid(districtId)

        ) {
            return res.status(400).json({ message: "Invalid ID format." });
        }

        // Check if Division exists
        const division = await Division.findById(divisionId);

        if (!division) {
            return res.status(404).json({ message: "Division not found" });
        }

        const district = await District.findOne({ _id: districtId })
            .populate('upazilas');

        if (!district) {
            return res.status(404).json({ message: 'District not found' });
        }

        const districtDelete = await District.findByIdAndDelete({ _id: districtId });
        if (!districtDelete) {
            return res.status(404).json({ message: 'District not found' });
        }


        return res.status(200).json({
            message: 'District deleted successfully',
            districtDelete,
        });

    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
}

const handelDistrictUpdate = async (req, res) => {
    try {
        const { name } = req.body;

        const { divisionId, districtId } = req.params;

        // Check if all required parameters are present
        if (!divisionId || !districtId) {
            return res.status(400).json({ message: "Missing required parameters." });
        }

        if (
            !mongoose.Types.ObjectId.isValid(divisionId) ||
            !mongoose.Types.ObjectId.isValid(districtId)

        ) {
            return res.status(400).json({ message: "Invalid ID format." });
        }

        // Check if Division exists
        const division = await Division.findById(divisionId);

        if (!division) {
            return res.status(404).json({ message: "Division not found" });
        }

        const district = await District.findOne({ _id: districtId })
            .populate('upazilas');

        if (!district) {
            return res.status(404).json({ message: 'District not found' });
        }

        const districtUpdated = await District.findByIdAndUpdate({ _id: districtId }, { name }, { new: true });
        if (!districtUpdated) {
            return res.status(404).json({ message: 'District not found' });
        }

        return res.status(200).json({
            message: 'District updated successfully',
            district,
        })
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
}



module.exports = {
    createDistrict,
    handelGetAllDistricts,
    handelSingalDistrict,
    handelDistrictDelete,
    handelDistrictUpdate

};
