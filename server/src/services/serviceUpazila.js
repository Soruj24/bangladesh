const { default: mongoose } = require("mongoose");
const District = require("../model/District");
const Upazila = require("../model/Upazila");
const createError = require('http-errors');



const createUpazila = async (name, districtId) => {
    try {
        const nameExists = await Upazila.findOne({ name });
        if (nameExists) {
            return createError(400, 'Upazila already exists');
        }

        const upazila = await Upazila.create({ name, district: districtId });

        // Update District with new Upazila ID
        await District.findByIdAndUpdate(districtId, { $push: { upazilas: upazila._id } });

        console.log(upazila);
        return upazila;
    } catch (error) {
        console.error(error);
        return createError(500, 'Server error');
    }
};

const getAllUpazila = async () => {
    try {
        const upazilas = await Upazila.find({}).populate('district');

        if (!upazilas) {
            return createError(404, 'Upazilas not found');
        }

        return upazilas;
    } catch (error) {
        console.error(error);
        return createError(500, 'Server error');
    }
};

const getSingleUpazila = async (id) => {
    try {
        const upazila = await District.findById(id).populate('upazilas');
        console.log("upazila---------------", upazila)
        if (!upazila) {
            return createError(404, 'Upazila not found');
        }
        return upazila;
    } catch (error) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Upazila ID' });
        }
        console.error(error);
        return createError(500, 'Server error');
    }
};

const updateUpazila = async (id, name) => {
    try {
        const upazila = await Upazila.findByIdAndUpdate(id, { name }, { new: true });
        if (!upazila) {
            return createError(404, 'Upazila not found');
        }
        return upazila;
    } catch (error) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Upazila ID' });
        }
        console.error(error);
        return createError(500, 'Server error');
    }
};

const deleteUpazila = async (upazilaId) => {
    try {
        const upazila = await Upazila.findByIdAndDelete(upazilaId);
        if (!upazila) {
            return res.status(404).json({ message: 'Upazila not found' });
        }
        return upazila;
    } catch (error) {
        if (!mongoose.Types.ObjectId.isValid(upazilaId)) {
            return res.status(400).json({ message: 'Invalid Upazila ID' });
        }
        console.error(error);
        return createError(500, 'Server error');
    }
};

module.exports = { createUpazila, getAllUpazila, getSingleUpazila, updateUpazila, deleteUpazila };