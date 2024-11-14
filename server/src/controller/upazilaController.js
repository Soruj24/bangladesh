const District = require("../model/District");
const Upazila = require("../model/Upazila");
const { createUpazila, getAllUpazila, getSingleUpazila, updateUpazila, deleteUpazila } = require("../services/serviceUpazila");


const handelCreateUpazila = async (req, res) => {
    try {
        const { name, districtId } = req.body;

        const upazila = await createUpazila(name, districtId);
        console.log(upazila);

        return res.status(201).json({
            message: 'Upazila created successfully',
            upazila,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};
const handelGetAllUpazila = async (req, res) => {
    try {
        const upazilas = await getAllUpazila()
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
        const upazilaId = req.params.id;
        const upazila = await getSingleUpazila(upazilaId)
        return res.status(200).json({
            message: 'Upazila fetched successfully',
            upazila,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

const handelUpdateUpazila = async (req, res) => {
    try {
        const upazilaId = req.params.id;
        const { name } = req.body;
        const upazila = await updateUpazila(upazilaId, name);
        return res.status(200).json({
            message: 'Upazila updated successfully',
            upazila,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

const handelDeleteUpazila = async (req, res) => {
    try {
        const upazilaId = req.params.id;
        const upazila = await deleteUpazila(upazilaId)
        return res.status(200).json({
            message: 'Upazila deleted successfully',
            upazila,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};


module.exports = { handelCreateUpazila, handelGetAllUpazila, handelGetSingleUpazila, handelUpdateUpazila, handelDeleteUpazila };
