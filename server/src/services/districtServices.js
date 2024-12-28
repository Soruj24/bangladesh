const { default: mongoose } = require("mongoose");
const District = require("../model/District");
const Division = require("../model/Division");
const createError = require('http-errors');

const districtCreated = async (name, divisionId) => {
    try {
        const nameExists = await District.findOne({ name })
        if (nameExists) {
            return createError(400, 'District already exists')
        }
        const division = await Division.findById(divisionId);
        if (!division) {
            return createError(400, 'Division not found')
        }
        const district = await District.create({ name, division: divisionId });
        // Update Division with new District ID
        await Division.findByIdAndUpdate(divisionId, { $push: { districts: district._id } });

        return district

    } catch (error) {
        return createError(400, 'division not found')
    }
}

const getAllDivisionsInDistrict = async (divisionId) => {
    try {

        const allDistrict = await Division.findById(divisionId).populate('districts');

        if (!allDistrict) {
            return res.status(404).json({ message: 'Division not found' });
        }

        return allDistrict
        
    } catch (error) {
        if (!mongoose.Types.ObjectId.isValid(divisionId)) {
            return createError(400, 'Invalid division ID')
        }
        return createError(400, 'division not found')
    }
}
const getSingleDistrict = async (divisionId, districtId) => {
    try {

        // Find the district by ID and ensure it matches the division
        const district = await District.findOne({ _id: districtId })
            .populate('upazilas');

        if (!district) {
            return res.status(404).json({ message: 'District not found' });
        }

        return district


    } catch (error) {
        if (!mongoose.Types.ObjectId.isValid(districtId)) {
            return createError(400, 'Invalid division ID')
        }
        return createError(400, 'division not found')
    }
}

const districtDelete = async ( districtId) => {
    try {
        const district = await District.findByIdAndDelete({ _id: districtId });
        if (!district) {
            return res.status(404).json({ message: 'District not found' });
        }
        return district
    } catch (error) {
        if (!mongoose.Types.ObjectId.isValid(districtId)) {
            return createError(400, 'Invalid division ID')
        }
        return createError(400, 'division not found')
    }
}

const districtUpdated = async ( districtId, name) => {
    try {
        const district = await District.findByIdAndUpdate({ _id: districtId }, { name }, { new: true });
        if (!district) {
            return res.status(404).json({ message: 'District not found' });
        }
        return district
    } catch (error) {
        if (!mongoose.Types.ObjectId.isValid(districtId)) {
            return createError(400, 'Invalid division ID')
        }
        return createError(400, 'division not found')
    }
}


module.exports = {
    districtCreated,
    getAllDivisionsInDistrict,
    getSingleDistrict,
    districtDelete,
    districtUpdated
}