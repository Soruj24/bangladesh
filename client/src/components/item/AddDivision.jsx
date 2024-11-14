import { useState } from 'react';
import { useAddDivisionsMutation } from '../../services/divisionApi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddDivision = () => {
    const [divisionName, setDivisionName] = useState('');
    const [addDivision] = useAddDivisionsMutation();

    const handleChange = (e) => {
        setDivisionName(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addDivision({ name: divisionName }).unwrap();
            toast.success('Division added successfully!');
            setDivisionName(''); // Clear the input field after submission
        } catch (error) {
            console.log(error)
            toast.error('Failed to add division. Please try again.');
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
