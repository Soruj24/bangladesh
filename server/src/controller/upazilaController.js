const { default: mongoose } = require("mongoose");
const District = require("../model/District");
const Upazila = require("../model/Upazila");
const { upazilaFindById } = require("../services/serviceUpazila");



const handelCreateUpazila = async (req, res) => {
    try {
        const { name, districtId } = req.body;

        const nameExists = await Upazila.findOne({ name, district: districtId });
        if (nameExists) {
            return res.status(400).json({ message: 'Upazila already exists' });
        }
        const district = await District.findById(districtId);
        if (!district) {
            return res.status(400).json({ message: 'District not found' });
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
        const upazila = await upazilaFindById(res, divisionId, districtId, upazilaId);
        if (!upazila) {
            return res.status(404).json({ message: 'Upazila not found' });
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
        await upazilaFindById(res, divisionId, districtId, upazilaId);


        // Validate if name is provided
        if (!name || name.trim() === "") {
            return res.status(400).json({ message: "Upazila name is required." });
        }

        // Update the upazila by ID
        const upazila = await Upazila.findByIdAndUpdate(
            upazilaId,
            { name },
            { new: true }
        );

        // Check if the upazila exists
        if (!upazila) {
            return res.status(404).json({ message: "Upazila not found." });
        }

        // Return success response
        return res.status(200).json({
            message: "Upazila updated successfully.",
            upazila,
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Server error." });
    }
};


const handelDeleteUpazila = async (req, res) => {
    try {

        const { divisionId, districtId, upazilaId } = req.params;
        const re = await upazilaFindById(res, divisionId, districtId, upazilaId);
        console.log('re--------------', re)
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
