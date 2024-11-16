import { useGetAllDistrictsQuery, useUpdateDistrictMutation, useDeleteDistrictMutation } from "../services/districtApi";
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DivisionShow = () => {
  const { data, isLoading, error, refetch } = useGetAllDistrictsQuery();
  const [deleteDistrict] = useDeleteDistrictMutation(); // Correct mutation for delete
  const [updateDistrict] = useUpdateDistrictMutation();

  const [editingDivisionId, setEditingDivisionId] = useState(null);
  const [updatedName, setUpdatedName] = useState('');

  // Handle delete action
  const handleDelete = async (id) => {
    try {
      
      await deleteDistrict(id).unwrap();
      toast.success("Division deleted successfully!");
      refetch(); // Refetch divisions after delete
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete division. Please try again.");
    }
  };

  // Handle edit action
  const handleEditClick = (division) => {
    setEditingDivisionId(division._id);
    setUpdatedName(division.name);
  };

  // Handle update action
  const handleUpdate = async (id) => {
    try {
      await updateDistrict({ id, name: updatedName }).unwrap();
      toast.success("Division updated successfully!");
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
        <h1 className="text-2xl font-bold text-gray-800 mb-4">District</h1>
        {data?.districts && data.districts.length > 0 ? (
          data.districts.map((district, index) => (
            <div
              key={district._id}
              className="p-4 mb-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-200 flex justify-between items-center"
            >
              {editingDivisionId === district._id ? (
                <input
                  type="text"
                  value={updatedName}
                  onChange={(e) => setUpdatedName(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md"
                />
              ) : (
                <p className="text-gray-700 font-medium">{index + 1}. {district.name}</p>
              )}
              <div className="flex gap-2">
                {editingDivisionId === district._id ? (
                  <button
                    onClick={() => handleUpdate(district._id)}
                    className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => handleEditClick(district)}
                    className="px-2 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => handleDelete(district._id)}
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
  );
};

export default DivisionShow;
