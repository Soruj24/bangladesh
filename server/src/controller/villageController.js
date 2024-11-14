const Union = require("../model/Union");
const Village = require("../model/Village");


// Create a Village
const createVillage = async (req, res) => {
    try {
        const { name, unionId } = req.body;

        const nameExists = await Village.findOne({ name })
        if (nameExists) {
            return res.status(409).json({ message: 'Village already exists' });
        }

        // Validate input
        if (!name || !unionId) {
            return res.status(400).json({ message: 'Village name and Union ID are required' });
        }

        // Create the Village
        const village = await Village.create({ name, union: unionId });

        // Update the Union with the new Village ID
        await Union.findByIdAndUpdate(unionId, { $push: { villages: village._id } });

        return res.status(201).json({
            message: 'Village created successfully',
            village,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Get all Villages in a Union
const getVillagesInUnion = async (req, res) => {
    try {
        const unionId = req.params.id;

        const union = await Union.findById(unionId).populate('villages');
        if (!union) {
            return res.status(404).json({ message: 'Union not found' });
        }

        return res.status(200).json({
            success: true,
            message: 'Villages fetched successfully',
            villages: union.villages,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            success: false,
            message: 'Server error'

        });
    }
};





module.exports = { createVillage, getVillagesInUnion };
