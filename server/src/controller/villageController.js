const { default: mongoose } = require("mongoose");
const District = require("../model/District");
const Division = require("../model/Division");
const Union = require("../model/Union");
const Upazila = require("../model/Upazila");
const Village = require("../model/Village");


// Create a Village
const createVillage = async (req, res) => {
    try {
        const { name } = req.body;

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



        const nameExists = await Village.findOne({ name })
        console.log("nameExists", nameExists)
        if (nameExists) {
            return res.status(409).json({ message: 'Village already exists' });
        }

        // Validate input
        if (!name || name.trim() === '') {
            return res.status(400).json({ message: 'Village name  are required' });
        }

        // Create the Village
        const village = await Village.create({ name });


        // Update the Union with the new Village ID
        await Union.findByIdAndUpdate(unionId, { $push: { villages: village._id } });

        return res.status(201).json({
            message: 'Village created successfully',
            village,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Get all Villages in a Union
const handelSinglalVillage = async (req, res) => {
    try {
        const { divisionId, districtId, upazilaId, unionId, villageId } = req.params;

        // Check if all required parameters are present
        if (!divisionId || !districtId || !upazilaId || !unionId || !villageId) {
            return res.status(400).json({ message: "Missing required parameters." });
        }

        if (
            !mongoose.Types.ObjectId.isValid(divisionId) ||
            !mongoose.Types.ObjectId.isValid(districtId) ||
            !mongoose.Types.ObjectId.isValid(upazilaId) ||
            !mongoose.Types.ObjectId.isValid(unionId) ||
            !mongoose.Types.ObjectId.isValid(villageId)
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

        const union = await Union.findById(unionId);
        if (!union) {
            return res.status(404).json({ message: "Union not found" });
        }

        const village = await Village.findById(villageId)
        if (!village) {
            return res.status(404).json({ message: "Village not found" });
        }




        return res.status(200).json({
            success: true,
            message: 'Villages fetched successfully',
            village
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

const handelGetAllVillage = async (req, res) => {
    try {
        const { divisionId, districtId, upazilaId, unionId } = req.params;

        // Validate required parameters
        if (!divisionId || !districtId || !upazilaId || !unionId) {
            return res.status(400).json({ message: "Missing required parameters." });
        }

        // Validate ObjectId format
        const ids = [divisionId, districtId, upazilaId, unionId];
        if (!ids.every((id) => mongoose.Types.ObjectId.isValid(id))) {
            return res.status(400).json({ message: "Invalid ID format." });
        }

        // Fetch and validate Division
        const division = await Division.findById(divisionId);
        if (!division) {
            return res.status(404).json({ message: "Division not found" });
        }

        // Fetch and validate District
        const district = await District.findById(districtId);
        if (!district) {
            return res.status(404).json({ message: "District not found" });
        }

        // Fetch and validate Upazila
        const upazila = await Upazila.findById(upazilaId);
        if (!upazila) {
            return res.status(404).json({ message: "Upazila not found" });
        }

        // Fetch and validate Union with populated villages
        const union = await Union.findById(unionId).populate('villages');
        if (!union) {
            return res.status(404).json({ message: "Union not found" });
        }

        // Return the villages
        return res.status(200).json({
            message: 'Villages fetched successfully',
            villages: union.villages,
        });
    } catch (error) {
        console.error("Error in handelGetAllVillage:", error);
        return res.status(500).json({ message: 'Server error' });
    }
};


const handelUpdateVillage = async (req, res) => {
    try {
        const { name } = req.body;
        const { villageId } = req.params;

        // Check if all required parameters are present
        if (!villageId) {
            return res.status(400).json({ message: "Missing required parameters." });
        }

        if (
            !mongoose.Types.ObjectId.isValid(villageId)
        ) {
            return res.status(400).json({ message: "Invalid ID format." });
        }



        const villageE = await Village.findById(villageId)

        if (!villageE) {
            return res.status(404).json({ message: "Village not found" });
        }

        const village = await Village.findByIdAndUpdate(villageId, { name }, { new: true });

        if (!village) {
            return res.status(404).json({ message: 'Village not found' });
        }

        return res.status(200).json({ message: 'Village updated successfully', village });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

const handelDeleteVillage = async (req, res) => {
    try {
        const { villageId } = req.params;

        // Check if all required parameters are present
        if (!villageId) {
            return res.status(400).json({ message: "Missing required parameters." });
        }

        if (!mongoose.Types.ObjectId.isValid(villageId)) {
            return res.status(400).json({ message: "Invalid ID format." });
        }



        const village = await Village.findById(villageId)
        if (!village) {
            return res.status(404).json({ message: "Village not found" });
        }

        // Delete the village by ID
        const villageDelete = await Village.findByIdAndDelete(villageId); // Pass ID directly
        if (!villageDelete) {
            return res.status(404).json({
                message: "Village not deleted",
            });
        }

        return res.status(200).json({
            message: "Village deleted successfully",
            village: villageDelete, // Include the deleted village details
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({
            message: "Server error",
        });
    }
};


const handelGetAllVillageWithOut = async (req, res) => {
    try {
        const villagesWithOutUnion = await Village.find();

        if (!villagesWithOutUnion || villagesWithOutUnion.length === 0) {
            return res.status(404).json({
                message: 'Villages not found',

            });
        }

        return res.status(200).json(
            {
                message: 'Villages fetched successfully',
                villagesWithOutUnion,
            }
        );

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};




module.exports = {
    createVillage,
    handelSinglalVillage,
    handelGetAllVillage,
    handelDeleteVillage,
    handelUpdateVillage,
    handelGetAllVillageWithOut
};
