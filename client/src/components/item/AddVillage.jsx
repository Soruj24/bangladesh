import { useState } from 'react';

const AddVillage = () => {
    // State to handle the input value
    const [divisionName, setDivisionName] = useState('');

    // Handle the change in the input field
    const handleChange = (e) => {
        setDivisionName(e.target.value);
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        // Logic to add the division (you can integrate your API call here)
        console.log('Division added:', divisionName);
    };

    return (
        <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
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
                    Add Village
                </button>
            </form>
        </div>
    );
};

export default AddVillage;
