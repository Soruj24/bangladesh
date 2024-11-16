import { useState } from 'react';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { useHandelGetUnionsQuery } from '../../services/unionApi';
import { useAddVillageMutation } from '../../services/villageApi';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define Zod schema for validation
const villageSchema = z.object({
    name: z.string().min(1, 'Village Name is required').max(50, 'Village Name must not exceed 50 characters'),
    unionId: z.string().min(3, 'Please select a union'),
});

const AddVillage = () => {
    const [villageName, setVillageName] = useState('');
    const [unionId, setUnionId] = useState('');

    const { data, isLoading, error } = useHandelGetUnionsQuery();
    const [addVillage, { isLoading: isAdding }] = useAddVillageMutation();

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form data using Zod
        const formData = { name: villageName, unionId };
        const validation = villageSchema.safeParse(formData);

        if (!validation.success) {
            const errorMessage = validation.error.errors[0].message;
            toast.error(errorMessage);
            return;
        }

        try {
            await addVillage(formData).unwrap();
            setVillageName('');
            setUnionId('');
            toast.success('Village added successfully!');
        } catch (error) {
            console.log(error)
            toast.error(error?.data?.message);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
            <ToastContainer />
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Dropdown for selecting a union */}
                <div>
                    <label
                        htmlFor="unionSelect"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Select Union
                    </label>
                    <select
                        id="unionSelect"
                        value={unionId}
                        onChange={(e) => setUnionId(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">Select Union</option>
                        {isLoading ? (
                            <option disabled>Loading unions...</option>
                        ) : error ? (
                            <option disabled>Error loading unions</option>
                        ) : (
                            data?.union?.map((union) => (
                                <option key={union._id} value={union._id}>
                                    {union.name}
                                </option>
                            ))
                        )}
                    </select>
                    {error && <p className="text-red-500 text-sm mt-2">Failed to load unions.</p>}
                </div>

                {/* Input for village name */}
                <div>
                    <label
                        htmlFor="villageName"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Village Name
                    </label>
                    <input
                        id="villageName"
                        type="text"
                        placeholder="Enter Village Name"
                        value={villageName}
                        onChange={(e) => setVillageName(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {/* Submit button */}
                <button
                    type="submit"
                    disabled={isAdding}
                    className={`w-full py-3 text-white font-semibold rounded-md focus:outline-none focus:ring-2 ${isAdding
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-indigo-500 hover:bg-indigo-600 focus:ring-indigo-500'
                        }`}
                >
                    {isAdding ? 'Adding...' : 'Add Village'}
                </button>
            </form>
        </div>
    );
};

export default AddVillage;
