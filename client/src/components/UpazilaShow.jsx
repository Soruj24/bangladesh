import { useDeleteUpazilaMutation, useGetAllUpazilasQuery, useUpdateUpazilaMutation } from "../services/UpazilaApi"



import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const DivisionShow = () => {
  const { data, isLoading, error, refetch } = useGetAllUpazilasQuery();
  const [deleteUpazila] = useDeleteUpazilaMutation();
  const [updateUpazila] = useUpdateUpazilaMutation();
  const [editingDivisionId, setEditingDivisionId] = useState(null);
  const [updatedName, setUpdatedName] = useState('');
  // Handle delete action
  const handleDelete = async (id) => {
    try {
      await deleteUpazila(id).unwrap();
      toast.success("Division deleted successfully!");
      refetch(); // Refetch divisions after delete
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete division. Please try again.");
    }
  };

  // Handle edit action
  const handleEditClick = (upazila) => {
    setEditingDivisionId(upazila._id);
    setUpdatedName(upazila.name);
  };

  // Handle update action
  const handleUpdate = async (id) => {
    try {
      await updateUpazila({ id, name: updatedName }).unwrap();
      toast.success("Upazila updated successfully!");
      setEditingDivisionId(null); // Exit edit mode
      refetch(); // Refetch divisions after update
    } catch (err) {
      console.error(err);
      toast.error("Failed to update division. Please try again.");
    }
  };

  if (isLoading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error loading divisions.</p>;

  return (
    <div className="w-full h-96  overflow-auto touch-auto ">
      <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-lg">
        <ToastContainer position="top-center" autoClose={3000} />
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Upazila</h1>
        {data?.upazilas ? (
          data?.upazilas?.map((upazila, index) => (
            <div
              key={upazila._id}
              className="p-4 mb-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-200 flex justify-between items-center"
            >
              {editingDivisionId === upazila._id ? (
                <input
                  type="text"
                  value={updatedName}
                  onChange={(e) => setUpdatedName(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md"
                />
              ) : (
                <p className="text-gray-700 font-medium">{index + 1}. {upazila.name}</p>
              )}
              <div className="flex gap-2">
                {editingDivisionId === upazila._id ? (
                  <button
                    onClick={() => handleUpdate(upazila._id)}
                    className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => handleEditClick(upazila)}
                    className="px-2 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => handleDelete(upazila._id)}
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