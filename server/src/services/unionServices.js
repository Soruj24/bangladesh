const { default: mongoose } = require("mongoose")
const Union = require("../model/Union")
const Upazila = require("../model/Upazila")
const createError = require('http-errors')

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

module.exports = { createUnion, getUnionsInUpazila, getUnions }