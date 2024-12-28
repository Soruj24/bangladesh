const { default: mongoose } = require("mongoose");
const Division = require("../model/Division");
const createError = require('http-errors');

const getDivision = async (name) => {
    try {
        const nameExists = await Division.findOne({ name })
        
        if (nameExists) {
            return createError(409, 'Division already exists')
        }

        const divisions = await Division.find()
            .populate({
                path: 'districts',
                model: 'District',
                populate: {
                    path: 'upazilas',
                    model: 'Upazila',
                    populate: {
                        path: 'unions',
                        model: 'Union',
                        populate: {
                            path: 'villages',
                            model: 'Village',
                        },
                    },
                },
            })

        return divisions

    } catch (error) {
        return createError(400, 'division not found')
    }
}

const divisionCreated = async (name) => {
    try {
        const nameExists = await Division.findOne({ name })
        if (nameExists) {
            return createError(400, 'Division already exists')
        }
        const division = await Division.create({ name })
        return division
    } catch (error) {
        return createError(400, 'division not found')
    }
}

const singleDivision = async (id) => {
    try {
        const division = await Division.findById(id)
        return division
    } catch (error) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return createError(400, 'Invalid division ID')
        }
        return createError(400, 'division not found')
    }
}
const divisionDeleted = async (id) => {
    try {
        const division = await Division.findById(id);
        if (!division) {
            return createError(400, 'division not found')
        }
        const divisionDeleted = await Division.findByIdAndDelete(id);
        return divisionDeleted

    } catch (error) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return createError(400, 'Invalid division ID')
        }
        return createError(400, 'division not found')
    }
}


const divisionUpdated = async (id, name) => {
    try {
        // Check if the id is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw createError(400, 'Invalid division ID');
        }

        const division = await Division.findById(id);
        if (!division) {
            throw createError(404, 'Division not found');
        }

        const divisionUpdated = await Division.findByIdAndUpdate(id, { name }, { new: true });
        return divisionUpdated;
    } catch (error) {
        throw error; // Throw error to be handled by the calling function
    }
};


module.exports = {
    getDivision,
    divisionCreated,
    singleDivision,
    divisionDeleted,
    divisionUpdated
}