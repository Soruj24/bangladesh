// controllers/divisionController.js
const createError = require('http-errors');

const Division = require("../model/Division");
const { getDivision, divisionCreated, singleDivision, divisionDeleted, divisionUpdated } = require("../services/divisonServices");

// Create a Division
const handelCreateDivision = async (req, res) => {
    try {
        const { name } = req.body;

        // Check if division name already exists
        const nameExists = await Division.findOne({ name });
        if (nameExists) {
            return res.status(400).json({ message: 'Division already exists' });
        }

        // Create new division
        const division = await Division.create({ name });

        // Return successful response
        return res.status(201).json({
            message: 'Division created successfully',
            division,
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error' });
    }
};


// Get all Divisions with Districts 

const handelGetAllDivisions = async (req, res) => {

    try {
        const { name } = req.body

        const divisions = await getDivision(name)

        return res.status(200).json({
            message: 'Divisions fetched successfully',
            divisions,
        });

    } catch (error) {
        return createError(400, 'division not found')
    }
};

const handelGetSingleDivision = async (req, res) => {
    try {
        const divisionId = req.params.id;
        const division = await singleDivision(divisionId)

        res.status(200).json({
            message: 'Division fetched successfully',
            division
        })

    } catch (error) {
        return res.status(500).json({ message: 'Server error' });

    }
}

const handelDeleteDivision = async (req, res) => {
    try {
        const divisionId = req.params.id;

        const division = await divisionDeleted(divisionId)

        res.status(200).json({
            message: 'Division deleted successfully',
            division: division
        });

    } catch (error) {
        res.status(500).json({ message: 'Division deletion failed' });
    }
}

const handelUpdateDivision = async (req, res) => {
    try {
        const divisionId = req.params.id;
        const { name } = req.body;

        // Call divisionUpdated with the correct order of arguments
        const division = await divisionUpdated(divisionId, name);

        res.status(200).json({
            message: 'Division updated successfully',
            division: division
        });
    } catch (error) {
        // Check if error has status from createError, otherwise default to 500
        const statusCode = error.status || 500;
        res.status(statusCode).json({ message: error.message || 'Division update failed' });
    }
};

module.exports = { handelCreateDivision, handelGetAllDivisions, handelGetSingleDivision, handelDeleteDivision, handelUpdateDivision };
