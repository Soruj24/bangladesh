import { useState } from 'react';
import { useGetDivisionsQuery } from '../../services/divisionApi';
import { useAddDistrictMutation } from '../../services/districtApi';
import { ToastContainer, toast } from 'react-toastify';
import { z } from 'zod';
import 'react-toastify/dist/ReactToastify.css';

// Define the Zod schema
const districtSchema = z.object({
    name: z.string()
        .min(3, 'District name must be at least 3 characters long')
        .max(50, 'District name must not exceed 50 characters'),
    divisionId: z.string().nonempty('You must select a division'),
});

const AddDistrict = () => {
    const [districtName, setDistrictName] = useState('');
    const [divisionId, setDivisionId] = useState('');
    const [addDistrict] = useAddDistrictMutation();

    // Fetch divisions using RTK Query hook
    const res = useGetDivisionsQuery();

    const handleChange = (e) => {
        setDistrictName(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate input using Zod
        const validationResult = districtSchema.safeParse({ name: districtName, divisionId });

        if (!validationResult.success) {
            const errorMessage = validationResult.error.errors[0]?.message;
            toast.error(errorMessage || 'Invalid input');
            return;
        }

        try {
            const response = await addDistrict({ name: districtName, divisionId }).unwrap();
            if (response) {
                toast.success('District added successfully!');
                setDistrictName('');
                setDivisionId('');
            }
        } catch (error) {
            toast.error(error?.data?.message);
            console.error('Error adding district:', error);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <ToastContainer />
            <label htmlFor="division" className="block text-gray-700 font-medium mb-2">Select Division</label>
            <select
                id="division"
                value={divisionId}
                onChange={(e) => setDivisionId(e.target.value)}
                className="w-full p-3 mb-4 bg-gray-50 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
                <option value="">Select a division</option>
                {res?.data?.divisions?.map((division) => (
                    <option key={division._id} value={division._id}>
                        {division.name}
                    </option>
                ))}
            </select>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="districtName" className="block text-gray-700 font-medium mb-2">District Name</label>
                    <input
                        type="text"
                        id="districtName"
                        placeholder="Enter district name"
                        value={districtName}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full p-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                >
                    Add District
                </button>
            </form>
        </div>
    );
};

export default AddDistrict;
