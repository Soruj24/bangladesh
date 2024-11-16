import { useState } from "react";
import { useDeleteUserMutation, useGetUsersQuery, useHandleSuperAdminMutation } from "../services/userApi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const AllUsersShow = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 9;

    const user = useSelector((state) => state?.user?.user);

    // Fetch users with search and pagination
    const { data, isLoading, isError, error, refetch } = useGetUsersQuery({
        search: searchTerm,
        page: currentPage,
        limit: usersPerPage,
    });
    console.log(data)
    const [deleteUser] = useDeleteUserMutation();
    const [handleSuperAdmin] = useHandleSuperAdminMutation();

    const handleDeleteUser = async (id) => {
        try {
            await deleteUser(id);
            toast.success("User deleted successfully");
            refetch(); // Re-fetch users to update the list
        } catch (err) {
            console.log(err);
            toast.error("Failed to delete user");
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            console.log(userId, newRole);
            // Make sure to pass the data as an object
            await handleSuperAdmin({ userId, role: newRole });
            toast.success("User role updated successfully");
            refetch(); // Re-fetch users after role update
        } catch (error) {
            console.log(error);
            toast.error("Failed to update user role");
        }
    };

    // Pagination handlers
    const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, data?.pagination?.totalPages || 1));

    if (isLoading) return <div className="text-center py-4">Loading...</div>;
    if (isError) return <div className="text-center py-4 text-red-500">Error: {error.message}</div>;

    return (
        <div>
            {/* Search Input */}
            <div className="mb-6 flex justify-between items-center">
                {
                    user?.isAdmin && (<button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300">
                        <Link to="/login">Add User</Link>
                    </button>)
                }

                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                    placeholder="Search by name, email, or phone"
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
            </div>

            {/* Display Users in Table */}
            {data?.users?.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">ID</th>
                                <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Name</th>
                                <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Email</th>
                                <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Phone</th>
                                <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Role</th>
                                <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Division</th>
                                <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">District</th>
                                <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Upazila</th>
                                <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Union</th>
                                <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Village</th>
                                <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.users.map((user, index) => (
                                <tr key={user.id} className="hover:bg-gray-100 transition">
                                    <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{index + 1}</td>
                                    <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{user.name}</td>
                                    <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{user.email}</td>
                                    <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{user.phone}</td>
                                    <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                            disabled={user.role === "superadmin"} // Disable if the role is superadmin
                                            className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:border-blue-500"
                                        >
                                            <option value="">Select Role</option>
                                            <option value="superadmin">Super Admin</option>
                                            <option value="admin">Admin</option>
                                            <option value="user">User</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{user.division}</td>
                                    <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{user.district}</td>
                                    <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{user.upazila}</td>
                                    <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{user.union}</td>
                                    <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{user.village}</td>
                                    <td className="px-6 py-4 border-b border-gray-200 text-sm space-x-2">
                                        <button className="text-blue-500 hover:underline">View</button>
                                        {!user.isSuperAdmin && (
                                            <button onClick={() => handleDeleteUser(user._id)} className="text-red-500 hover:underline">
                                                Remove
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-center text-gray-500">No users found</p>
            )}

            {/* Pagination Controls */}
            <div className="flex justify-center items-center mt-6 space-x-4">
                <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400 transition"
                >
                    Previous
                </button>
                <span className="text-gray-700">
                    Page {currentPage} of {data?.pagination?.totalPages || 1}
                </span>
                <button
                    onClick={goToNextPage}
                    disabled={currentPage === data?.pagination?.totalPages}
                    className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400 transition"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default AllUsersShow;
