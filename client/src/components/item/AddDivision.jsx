import { useState } from 'react';
import { useAddDivisionsMutation } from '../../services/divisionApi';
import { toast, ToastContainer } from 'react-toastify';
import { z } from 'zod';
import 'react-toastify/dist/ReactToastify.css';

// Define the Zod schema
const divisionSchema = z.object({
    name: z.string().min(2, "Division name must be at least 2 characters").max(50, "Division name must not exceed 50 characters"),
});

const AddDivision = () => {
    const [divisionName, setDivisionName] = useState('');
    const [addDivision] = useAddDivisionsMutation();

    const handleChange = (e) => {
        setDivisionName(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate input using Zod
        const validationResult = divisionSchema.safeParse({ name: divisionName });

        if (!validationResult.success) {
            const errorMessage = validationResult.error.errors[0]?.message;
            toast.error(errorMessage || 'Invalid input');
            return;
        }

        try {
            await addDivision({ name: divisionName }).unwrap();
            toast.success('Division added successfully!');
            setDivisionName(''); // Clear the input field after submission
        } catch (error) {
            console.error(error.data.message);
            toast.error( error?.data?.message);
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
            <ToastContainer position="top-center" autoClose={3000} />
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <input
                        type="text"
                        placeholder="Division Name"
                        value={divisionName}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full p-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    Add Division
                </button>
            </form>
        </div>
    );
};

export default AddDivision;
