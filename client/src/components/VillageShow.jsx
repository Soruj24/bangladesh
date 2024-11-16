import { useDeleteVillageMutation, useHandelGetVillagesQuery, useUpdateVillageMutation } from "../services/villageApi"



import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const DivisionShow = () => {
    const { data, isLoading, error, refetch } = useHandelGetVillagesQuery();
    const [deleteVillage] = useDeleteVillageMutation();
    const [updateVillage] = useUpdateVillageMutation();
    const [editingDivisionId, setEditingDivisionId] = useState(null);
    const [updatedName, setUpdatedName] = useState('');

    // Handle delete action
    const handleDelete = async (id) => {
        try {
            console.log(id)
            await deleteVillage(id).unwrap();
            toast.success("village deleted successfully!");
            refetch(); // Refetch village after delete
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete village. Please try again.");
        }
    };

    // Handle edit action
    const handleEditClick = (village) => {
        setEditingDivisionId(village._id);
        setUpdatedName(village.name);
    };

    // Handle update action
    const handleUpdate = async (id) => {
        try {
            console.log(updatedName)
            await updateVillage({ id, name: updatedName }).unwrap();
            toast.success("village updated successfully!");
            setEditingDivisionId(null); // Exit edit mode
            refetch(); // Refetch divisions after update
        } catch (err) {
            console.error(err);
            toast.error("Failed to update village. Please try again.");
        }
    };

    if (isLoading) return <p className="text-center text-gray-500">Loading...</p>;
    if (error) return <p className="text-center text-red-500">Error loading divisions.</p>;

    return (
        <div className="w-full h-96  overflow-auto touch-auto ">
            <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-lg">
                <ToastContainer position="top-center" autoClose={3000} />
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Village</h1>
                {data?.villages ? (
                    data?.villages.map((village, index) => (
                        <div
                            key={village._id}
                            className="p-4 mb-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-200 flex justify-between items-center"
                        >
                            {editingDivisionId === village._id ? (
                                <input
                                    type="text"
                                    value={updatedName}
                                    onChange={(e) => setUpdatedName(e.target.value)}
                                    className="p-2 border border-gray-300 rounded-md"
                                />
                            ) : (
                                <p className="text-gray-700 font-medium">{index + 1}. {village.name}</p>
                            )}
                            <div className="flex gap-2">
                                {editingDivisionId === village._id ? (
                                    <button
                                        onClick={() => handleUpdate(village._id)}
                                        className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        Save
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleEditClick(village)}
                                        className="px-2 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                                    >
                                        Edit
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(village._id)}
                                    className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No divisions available.</p>
                )}
            </div>
        </div>
    )
}

export default DivisionShow