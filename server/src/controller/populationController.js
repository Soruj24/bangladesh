const User = require("../model/userModel");
const Population = require("../model/populationModel");

const addUser = async (req, res) => {
    try {

        const {
            name,
            email,
            phone,
            tag,
            image,
            bio,
            village,
            union,
            upazila,
            district,
            division
        } = req.body;

        // Check if the user already exists by email or phone
        const userExists = await Population.findOne({ $or: [{ email }, { phone }] });
        if (userExists) {
            return res.status(400).json({ message: "User already exists with this email or phone number" });
        }

        // Create a new population entry
        const newPopulation = new Population({
            name,
            email,
            phone,
            tag,
            image,
            bio,
            division,
            district,
            upazila,
            union,
            village,
        });


        const savedUser = await newPopulation.save();

        // Return a success message
        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                phone: savedUser.phone,
                tag: savedUser.tag,
                image: savedUser.image,
                village: savedUser.village,
                union: savedUser.union,
                upazila: savedUser.upazila,
                district: savedUser.district,
                division: savedUser.division
            }
        });


    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Failed to register user" });
    }
};



const populationGetAllUsers = async (req, res) => {
    try {
        const { search = '', page = 1, limit = 9 } = req.query;

        // Convert page and limit to integers
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);

        // Build the search query
        const searchQuery = search
            ? {
                $or: [
                    { name: new RegExp(search, 'i') },
                    { email: new RegExp(search, 'i') },
                    { phone: new RegExp(search, 'i') },
                ]
            }
            : {};

        // Fetch users with search and pagination
        const users = await Population.find(searchQuery)
            .populate('division', 'name')
            .populate('district', 'name')
            .populate('upazila', 'name')
            .populate('union', 'name')
            .populate('village', 'name')
            .select('name email phone tag image division district upazila union village')
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);

        // Get the total number of users for pagination calculations
        const totalUsers = await Population.countDocuments(searchQuery);
        const totalPages = Math.ceil(totalUsers / limitNumber);

        // Return the list of users
        return res.status(200).json({
            message: "Users fetched successfully",
            users: users.map(user => ({
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                tag: user.tag,
                image: user.image,
                division: user.division?.name,
                district: user.district?.name,
                upazila: user.upazila?.name,
                union: user.union?.name,
                village: user.village?.name
            })),
            pagination: {
                totalUsers,
                currentPage: pageNumber,
                totalPages,
                pageSize: limitNumber,
                hasNextPage: pageNumber < totalPages,
                hasPreviousPage: pageNumber > 1,
                nextPage: pageNumber < totalPages ? pageNumber + 1 : null,
                previousPage: pageNumber > 1 ? pageNumber - 1 : null
            }
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ message: "Failed to fetch users" });
    }
};


const populationGetSingalUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await Population.findById(userId)
            .populate('division', 'name')
            .populate('district', 'name')
            .populate('upazila', 'name')
            .populate('union', 'name')
            .populate('village', 'name')
            .select('name email phone tag image division district upazila union village');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "User fetched successfully", user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                tag: user.tag,
                image: user.image,
                division: user.division?.name,
                district: user.district?.name,
                upazila: user.upazila?.name,
                union: user.union?.name,
                village: user.village?.name
            }
        });


    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch user" });

    }
}


const populationUpdateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const updatedUser = await Population.findByIdAndUpdate(userId, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ message: "Failed to update user" });
    }
};

const populationUserDelete = async (req, res) => {
    try {
        // Extract the user ID from the request parameters
        const { id } = req.params;

        // Find and delete the user by ID
        const deletedUser = await Population.findByIdAndDelete(id);
        console.log(deletedUser)

        // Check if the user was found and deleted
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "User deleted successfully", user: deletedUser });
    } catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

const populationHandelAdminUpdateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const action = req.body.role
        console.log(action)
        let update;

        if (action === 'superadmin') {
            update = { isSuperAdmin: true, }; // Set both true for super admin
        } else if (action === 'admin') {
            update = { isAdmin: true, isSuperAdmin: false }; // Admin without super admin privileges
        } else {
            update = { isAdmin: false, isSuperAdmin: false }; // Remove both roles
        }

        const updatedUser = await User.findByIdAndUpdate(userId, update, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "User updated successfully", updatedUser });
    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ message: "Failed to update user" });
    }
};



module.exports = {
    addUser,
    populationGetAllUsers,
    populationGetSingalUser,
    populationUpdateUser,
    populationUserDelete,
    populationHandelAdminUpdateUser
};
