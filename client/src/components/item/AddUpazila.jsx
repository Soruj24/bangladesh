import { useState } from 'react';
import { useAddUpazilaMutation } from '../../services/UpazilaApi';
import { useGetAllDistrictsQuery } from '../../services/districtApi';
import { z } from 'zod';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Zod schema for validation
const upazilaSchema = z.object({
    name: z
        .string()
        .min(3, 'Upazila name must be at least 3 characters long')
        .max(50, 'Upazila name must not exceed 50 characters'),
    districtId: z.string().nonempty('You must select a district'),
});

const AddUpazila = () => {
    const [upazilaName, setUpazilaName] = useState('');
    const [districtId, setDistrictId] = useState('');

    const [addUpazila, { isLoading: isAdding, error: addError }] = useAddUpazilaMutation();
    const { data: districtsData, isLoading, error } = useGetAllDistrictsQuery();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate using Zod schema
        const validationResult = upazilaSchema.safeParse({ name: upazilaName, districtId });
        if (!validationResult.success) {
            const errorMessage = validationResult.error.errors[0]?.message;
            toast.error(errorMessage || 'Invalid input');
            return;
        }

        try {
            const response = await addUpazila({
                name: upazilaName,
                districtId,
            }).unwrap();
            if (response) {
                toast.success('Upazila added successfully!');
                setUpazilaName('');
                setDistrictId('');
            }
        } catch (error) {
            toast.error(error?.data?.message);
            console.error('Error adding Upazila:', error);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <ToastContainer />
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* District Dropdown */}
                <div>
                    <label htmlFor="district" className="block text-gray-700 font-medium mb-2">
                        Select District
                    </label>
                    <select
                        id="district"
                        value={districtId}
                        onChange={(e) => setDistrictId(e.target.value)}
                        className="w-full p-3 mb-4 bg-gray-50 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">Select a District</option>
                        {isLoading ? (
                            <option disabled>Loading...</option>
                        ) : error ? (
                            <option disabled>Error loading districts</option>
                        ) : (
                            districtsData?.districts?.map((district) => (
                                <option key={district._id} value={district._id}>
                                    {district.name}
                                </option>
                            ))
                        )}
                    </select>
                    {error && <p className="text-red-500 text-sm">Failed to load districts.</p>}
                </div>

                {/* Upazila Name Input */}
                <div>
                    <label htmlFor="upazilaName" className="block text-gray-700 font-medium mb-2">
                        Upazila Name
                    </label>
                    <input
                        type="text"
                        id="upazilaName"
                        placeholder="Enter Upazila name"
                        value={upazilaName}
                        onChange={(e) => setUpazilaName(e.target.value)}
                        className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isAdding}
                    className={`w-full p-3 text-white rounded-md focus:outline-none focus:ring-2 font-medium ${
                        isAdding
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
                    }`}
                >
                    {isAdding ? 'Adding...' : 'Add Upazila'}
                </button>

                {/* Error Message */}
                {addError && <p className="text-red-500 text-sm">Failed to add Upazila. Please try again.</p>}
            </form>
        </div>
    );
};

export default AddUpazila;
