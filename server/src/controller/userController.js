const { cloudinary_js_config } = require("../helper/cloudImageUploading");
const User = require("../model/userModel");
const cloudinary = require('../helper/cloudImageUploading');
const { isAdmin } = require("../middleware/auth");

const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone, tag, village, union, upazila, district, division } = req.body;

        // Check if the user already exists by email or phone
        const userExists = await User.findOne({ $or: [{ email }, { phone }] });
        if (userExists) {
            return res.status(400).json({ message: "User already exists with this email or phone number" });
        }

        // Create the new user object with hashed password
        const newUser = new User({
            name,
            email,
            password, // Assume password hashing is handled in a middleware or schema pre-save hook
            phone,
            tag,
            village,
            union,
            upazila,
            district,
            division
        });

        // Save the new user to the database
        const savedUser = await newUser.save();

        // Return a success message
        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                phone: savedUser.phone,
                tag: savedUser.tag,
                village: savedUser.village,
                union: savedUser.union,
                upazila: savedUser.upazila,
                district: savedUser.district,
                division: savedUser.division
            }
        });
    } catch (error) {
        console.error("Error during user registration:", error);
        return res.status(500).json({ message: "Failed to register user" });
    }
};


const getAllUsers = async (req, res) => {
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
        const users = await User.find(searchQuery)
            .populate('division', 'name')
            .populate('district', 'name')
            .populate('upazila', 'name')
            .populate('union', 'name')
            .populate('village', 'name')
            .select('name email phone tag image division district upazila union village')
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);

        // Get the total number of users for pagination calculations
        const totalUsers = await User.countDocuments(searchQuery);
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



const getSingalUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId)
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

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ message: "Failed to update user" });
    }
};

const userDelete = async (req, res) => {
    try {
        // Extract the user ID from the request parameters
        const { id } = req.params;

        // Find and delete the user by ID
        const deletedUser = await User.findByIdAndDelete(id);

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

const handelAdminUpdateUser = async (req, res) => {
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
    registerUser,
    getAllUsers,
    getSingalUser,
    handelAdminUpdateUser,
    updateUser,
    userDelete
};
