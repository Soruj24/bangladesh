import { useState } from 'react';
import { z } from 'zod';
import { useGetAllUpazilasQuery } from '../../services/UpazilaApi';
import { useAddUnionMutation } from '../../services/unionApi';
import { toast } from 'react-toastify';

// Define Zod schema for form validation
const unionSchema = z.object({
    name: z.string().min(1, 'Union Name is required').max(50, 'Union Name must not exceed 50 characters'),
    upazilaId: z.string().min(1, 'Please select an Upazila'),
});

const AddUnion = () => {
    const [unionName, setUnionName] = useState('');
    const [upazilaId, setUpazilaId] = useState('');

    const { data, isLoading, error } = useGetAllUpazilasQuery();
    const [addUnion, { isLoading: isAdding }] = useAddUnionMutation();

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form data with Zod
        const formData = { name: unionName, upazilaId };
        const validation = unionSchema.safeParse(formData);

        if (!validation.success) {
            const errorMessage = validation.error.errors[0].message;
            toast.error(errorMessage);
            return;
        }

        try {
            await addUnion(formData).unwrap();
            toast.success('Union added successfully!');
            setUnionName('');
            setUpazilaId('');
        } catch (error) {
            toast.error(error?.data?.message);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-200">
            {/* Dropdown for selecting Upazila */}
            <div className="mb-4">
                <label htmlFor="upazila" className="block text-gray-700 font-medium mb-2">
                    Select Upazila
                </label>
                <select
                    id="upazila"
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={upazilaId}
                    onChange={(e) => setUpazilaId(e.target.value)}
                >
                    <option value="">Select Upazila</option>
                    {isLoading ? (
                        <option disabled>Loading Upazilas...</option>
                    ) : error ? (
                        <option disabled>Error loading Upazilas</option>
                    ) : (
                        data?.upazilas?.map((upazila) => (
                            <option key={upazila._id} value={upazila._id}>
                                {upazila.name}
                            </option>
                        ))
                    )}
                </select>
                {error && <p className="text-red-500 text-sm mt-2">Failed to load Upazilas.</p>}
            </div>

            {/* Form for adding Union */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="unionName" className="block text-gray-700 font-medium mb-2">
                        Union Name
                    </label>
                    <input
                        type="text"
                        id="unionName"
                        placeholder="Enter Union Name"
                        value={unionName}
                        onChange={(e) => setUnionName(e.target.value)}
                        className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isAdding}
                    className={`w-full p-3 text-white rounded-md focus:outline-none focus:ring-2 font-medium ${isAdding
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
                        }`}
                >
                    {isAdding ? 'Adding...' : 'Add Union'}
                </button>
            </form>
        </div>
    );
};

export default AddUnion;
