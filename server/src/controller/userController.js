const User = require("../model/userModel");

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if the user already exists by email or phone
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        // Create the new user object with hashed password
        const newUser = new User({
            name,
            email,
            password,

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

            }
        });
    } catch (error) {
        console.log(error)
        console.error("Error during user registration:", error);
        return res.status(500).json({ message: "Failed to register user" });
    }
};


const getAllUsers = async (req, res) => {
    try {
        const { search = '', page = 1, limit = 5 } = req.query;

        // Convert page and limit to integers
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);

        // Build the search query
        const searchQuery = search
            ? {
                $or: [
                    { name: new RegExp(search, 'i') },
                    { email: new RegExp(search, 'i') },
                ]
            }
            : {};

        // Fetch users with search and pagination
        const users = await User.find(searchQuery)
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);

        // Get the total number of users for pagination calculations
        const totalUsers = await User.countDocuments(searchQuery);
        const totalPages = Math.ceil(totalUsers / limitNumber);

        // Return the list of users
        return res.status(200).json({
            message: "Users fetched successfully",
            users,
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

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({
            message: "User fetched successfully", user: {
                id: user._id,
                name: user.name,
                email: user.email,

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

const handelAdminUpdateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const action = req.body.role
        console.log("action userId", userId, action)
        let update;

        if (action === 'super-admin') {
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
        console.log("error", error)
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
