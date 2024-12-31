const { default: mongoose } = require("mongoose")
const Union = require("../model/Union")
const Upazila = require("../model/Upazila")
const createError = require('http-errors')
const Division = require("../model/Division")
const District = require("../model/District")

const createUnion = async (name, upazilaId) => {
    try {
        const nameExists = await Union.findOne({ name })
        if (nameExists) {
            return createError(400, 'Union already exists')
        }
        const union = await Union.create({ name, upazila: upazilaId })
        if (!union) {
            return createError(400, 'Union not found')
        }
        await Upazila.findByIdAndUpdate(upazilaId, { $push: { unions: union._id } })
        return union
    } catch (error) {
        if (!mongoose.Types.ObjectId.isValid(upazilaId)) {
            return createError(400, 'Invalid Upazila ID')
        }
        return createError(400, 'Union not found')
    }
}

const getUnionsInUpazila = async (upazilaId) => {
    try {
        const upazila = await Upazila.findById(upazilaId).populate('unions');
        if (!upazila) {
            return res.status(404).json({ message: 'Upazila not found' });
        }

        return upazila
    } catch (error) {
        if (!mongoose.Types.ObjectId.isValid(upazilaId)) {
            return createError(400, 'Invalid Upazila ID')
        }
        return createError(400, 'Upazila not found')
    }
}

const getUnions = async (unionId, upazilaId) => {
    try {

        const union = await Union.findOne({ _id: unionId, upazila: upazilaId });

        if (!union) {
            return createError(404, 'Union not found')
        }

        return union

    } catch (error) {
        console.log(error)
        if (!mongoose.Types.ObjectId.isValid(unionId)) {
            return createError(400, 'Invalid Union ID')
        }
        return createError(400, 'Union not found')
    }
}

const unionFindById = async (res, divisionId, districtId, upazilaId, unionId) => {
    try {
        // Validate ObjectId format
        if (
            !mongoose.Types.ObjectId.isValid(divisionId) ||
            !mongoose.Types.ObjectId.isValid(districtId) ||
            !mongoose.Types.ObjectId.isValid(upazilaId) ||
            !mongoose.Types.ObjectId.isValid(unionId)
        ) {
            throw createError(400, "Invalid ID format.")
        }

        // Check if Division exists
        const division = await Division.findById(divisionId);
        if (!division) {
            throw createError(400, "Division not found.")
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
        return union

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message });
    }
}

module.exports = { unionFindById, createUnion, getUnionsInUpazila, getUnions }