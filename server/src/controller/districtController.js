const District = require("../model/District");
const Division = require("../model/Division");
const {
    districtCreated,
    getAllDivisionsInDistrict,
    getSingleDistrict,
    districtDelete,
    districtUpdated
} = require("../services/districtServices");


// Create a District
const createDistrict = async (req, res) => {
    try {
        const { name, divisionId } = req.body;

        const nameExists = await District.findOne({ name })
        if (nameExists) {
            return res.status(400).json({
                message: 'District already exists'
            })
        }
        const division = await Division.findById(divisionId);
        if (!division) {
            return res.status(400).json({
                message: 'Division not found'
            })
        }
        const district = await District.create({ name, division: divisionId });
        // Update Division with new District ID
        await Division.findByIdAndUpdate(divisionId, { $push: { districts: district._id } });

        return res.status(201).json({
            message: 'District created successfully',
            district,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Get Districts in a Division
const getDistrictsInDivision = async (req, res) => {
    try {
        const divisionId = req.params.divisionId;
        const division = await getAllDivisionsInDistrict(divisionId)

        return res.status(200).json({
            message: 'Districts fetched successfully',
            districts: division,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

const singalDistrict = async (req, res) => {
    try {
        const { districtId } = req.params;

        const district = await getSingleDistrict(districtId)

        return res.status(200).json({
            message: 'District fetched successfully',
            district,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

const handelGetDistrict = async (req, res) => {
    try {

        const districts = await District.find();
        if (!districts) {
            return res.status(404).json({ message: 'District not found' });
        }

        return res.status(200).json({
            message: 'District fetched successfully',
            districts,
        });

    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
}

const handelDistrictDelete = async (req, res) => {
    try {
        const { districtId } = req.params;
        const district = await districtDelete(districtId)
        console.log(district)

        return res.status(200).json({
            message: 'District deleted successfully',
            district,
        });

    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
}

const handelDistrictUpdate = async (req, res) => {
    try {
        const { districtId } = req.params;
        const { name } = req.body;

        const district = await districtUpdated(districtId, name)


        return res.status(200).json({
            message: 'District updated successfully',
            district,
        })
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
}



module.exports = {
    createDistrict,
    getDistrictsInDivision,
    singalDistrict,
    handelDistrictDelete,
    handelDistrictUpdate,
    handelGetDistrict
};
