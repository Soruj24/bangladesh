import { useState } from "react";
import { useDeleteUserMutation, useGetUsersQuery, useHandleSuperAdminMutation } from "../services/userApi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const AllUsersShow = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 9;

    const loggedInUser = useSelector((state) => state?.user?.user);
console.log(loggedInUser)
    // Fetch users with search and pagination
    const { data, isLoading, isError, error, refetch } = useGetUsersQuery({
        search: searchTerm,
        page: currentPage,
        limit: usersPerPage,
    });

    const [deleteUser] = useDeleteUserMutation();
    const [handleSuperAdmin] = useHandleSuperAdminMutation();

    const handleDeleteUser = async (id) => {
        try {
            await deleteUser(id).unwrap();
            toast.success("User deleted successfully");
            refetch(); // Re-fetch users to update the list
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete user");
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            console.log(userId, newRole);
            await handleSuperAdmin({ userId, role: newRole }).unwrap();
            toast.success("User role updated successfully");
            refetch(); // Re-fetch users after role update
        } catch (error) {
            console.error(error);
            toast.error("Failed to update user role");
        }
    };

    // Pagination handlers
    const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, data?.pagination?.totalPages || 1));

    if (isLoading) return <div className="text-center py-4">Loading...</div>;
    if (isError) return <div className="text-center py-4 text-red-500">Error: {error?.data?.message || "Something went wrong"}</div>;

    return (
        <div className="p-6">
            {/* Search Input */}
            <div className="mb-6 flex justify-between items-center">
                {loggedInUser?.isAdmin && (
                    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300">
                        <Link to="/add-user">Add User</Link>
                    </button>
                )}

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
                                {[
                                    "ID",
                                    "Name",
                                    "Email",
                                    "Phone",
                                    "Role",
                                    "Division",
                                    "District",
                                    "Upazila",
                                    "Union",
                                    "Village",
                                    "Actions",
                                ].map((header) => (
                                    <th
                                        key={header}
                                        className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-700"
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data?.users.map((user, index) => (
                                <tr key={user.id} className="hover:bg-gray-100 transition">
                                    <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">
                                        {user.name}
                                    </td>
                                    <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">
                                        {user.phone}
                                    </td>
                                    <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">
                                        {loggedInUser?.isSuperAdmin && (
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:border-blue-500"
                                            >
                                                <option value="user">User</option>
                                                <option value="admin">Admin</option>
                                                <option value="superadmin">Super Admin</option>
                                            </select>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{user.division}</td>
                                    <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{user.district}</td>
                                    <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{user.upazila}</td>
                                    <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{user.union}</td>
                                    <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{user.village}</td>
                                    <td className="px-6 py-4 border-b border-gray-200 text-sm space-x-2">
                                        <button className="text-blue-500 hover:underline">Edit Profile</button>
                                        {!user.isSuperAdmin && (
                                            <button
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="text-red-500 hover:underline"
                                            >
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
