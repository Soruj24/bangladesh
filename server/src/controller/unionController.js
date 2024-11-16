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
        const union = await Union.find({});
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
        const unionId = req.params.id;

        // Use findByIdAndDelete with the ID directly
        const union = await Union.findByIdAndDelete({ _id: unionId });

        if (!union) {
            return res.status(404).json({ message: 'Union not found' });
        }

        return res.status(200).json({ message: 'Union deleted successfully' });
    } catch (error) {
        console.error('Error while deleting union:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

const handleUpdateUnion = async (req, res) => {
    try {
        const { id } = req.params; // Extract the union ID from the request parameters

        // Find and update the union by ID with the request body data
        const union = await Union.findByIdAndUpdate(id, req.body, { new: true });

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



module.exports = { handelCreateUnion, handleUpdateUnion, handelGetUnionsInUpazila, handelUnionDelete, handelGetUnions };
