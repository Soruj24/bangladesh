const { default: mongoose } = require("mongoose");
const District = require("../model/District");
const Upazila = require("../model/Upazila");
const { upazilaFindById } = require("../services/serviceUpazila");
const Division = require("../model/Division");



const handelCreateUpazila = async (req, res) => {
    try {
        const { name } = req.body;
        const { divisionId, districtId, upazilaId } = req.params;

        if (!divisionId || !districtId) {
            return res.status(400).json({ message: "Missing required parameters." });
        }

        if (!mongoose.Types.ObjectId.isValid(divisionId) ||
            !mongoose.Types.ObjectId.isValid(districtId)) {
            return res.status(400).json({ message: "Invalid ID format." });
        }

        // Check if Division exists
        const division = await Division.findById(divisionId);
        if (!division) {
            return res.status(404).json({ message: "Division not found" });
        }

        // Check if District exists
        const districtExists = await District.findById(districtId);
        if (!districtExists) {
            return res.status(404).json({ message: "District not found" });
        }





        const nameExists = await Upazila.findOne({ name, district: districtId });
        if (nameExists) {
            return res.status(400).json({ message: 'Upazila already exists' });
        }


        const upazila = await Upazila.create({ name, district: districtId });
        await District.findByIdAndUpdate(districtId, { $push: { upazilas: upazila._id } });

        return res.status(201).json({
            message: 'Upazila created successfully',
            upazila

        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }

};
const handelGetAllUpazila = async (req, res) => {
    try {
        const upazilas = await Upazila.find({})

        if (!upazilas) {
            return res.status(404).json({ message: 'Upazilas not found' });
        }

        return res.status(200).json({
            message: 'Upazilas fetched successfully',
            upazilas,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

const handelGetSingleUpazila = async (req, res) => {
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
        const upazila = await Upazila.findById(upazilaId)
        if (!upazila) {
            return res.status(404).json({ message: "Upazila not found" });
        }


        return res.status(200).json({
            message: "Upazila fetched successfully",
            upazila,
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Server error" });
    }
};


const handelUpdateUpazila = async (req, res) => {
    try {
        const { divisionId, districtId, upazilaId } = req.params;
        const { name } = req.body;
        // Validate if name is provided
        if (!name || name.trim() === "") {
            return res.status(400).json({ message: "Upazila name is required." });
        }
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
        const upazila = await Upazila.findById(upazilaId)
        if (!upazila) {
            return res.status(404).json({ message: "Upazila not found" });
        }



        // Update the upazila by ID
        const upazilaUpdate = await Upazila.findByIdAndUpdate(
            upazilaId,
            { name },
            { new: true }
        );

        // Check if the upazila exists
        if (!upazilaUpdate) {
            return res.status(404).json({ message: "Upazila not Updated." });
        }

        // Return success response
        return res.status(200).json({
            message: "Upazila updated successfully.",
            upazilaUpdate,
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Server error." });
    }
};


const handelDeleteUpazila = async (req, res) => {
    try {

        const { divisionId, districtId, upazilaId } = req.params;
        console.log("divisionId", districtId, divisionId, upazilaId)
        await upazilaFindById(res, divisionId, districtId, upazilaId);
        const upazila = await Upazila.findByIdAndDelete(upazilaId);

        if (!upazila) {
            return res.status(404).json({ message: 'Upazila not deleted' });
        }

        return res.status(200).json({
            message: 'Upazila deleted successfully',
            upazila,
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Server error' });
    }
};


module.exports = {

    handelCreateUpazila,
    handelGetAllUpazila,
    handelGetSingleUpazila,
    handelUpdateUpazila,
    handelDeleteUpazila
};
