const { default: mongoose } = require("mongoose");
const Union = require("../model/Union");
const Upazila = require("../model/Upazila");
const { createUnion, getUnionsInUpazila } = require("../services/unionServices");


const handelCreateUnion = async (req, res) => {
    try {
        const { name, upazilaId } = req.body;

        const union = await createUnion(name, upazilaId);

        return res.status(201).json({
            message: 'Union created successfully',
            union,
        });

    } catch (error) {
        console.error('Error creating union:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};


// Get all Unions in an Upazila
const handelGetUnionsInUpazila = async (req, res) => {
    try {
        const upazilaId = req.params.upazilaId;

        const upazila = await getUnionsInUpazila(upazilaId);

        return res.status(200).json({
            message: 'Unions fetched successfully',
            unions: upazila.unions,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};


const handelGetUnions = async (req, res) => {
    try {
        const { upazilaId, unionId } = req.params;
        const union = await Union.findOne({ _id: unionId, upazila: upazilaId });
        console.log(union)
        if (!union) {
            return res.status(404).json({ message: 'Union not found' });
        }

        return res.status(200).json({ message: 'Union fetched successfully', union });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};


const handelUnionDelete = async (req, res) => {
    try {
        const { upazilaId, unionId } = req.params;
        const union = await Union.findByIdAndDelete(unionId);
        if (!union) {
            return res.status(404).json({ message: 'Union not found' });
        }
        await Upazila.findByIdAndUpdate(upazilaId, { $pull: { unions: union._id } });
        return res.status(200).json({ message: 'Union deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { handelCreateUnion, handelGetUnionsInUpazila, handelUnionDelete, handelGetUnions };
