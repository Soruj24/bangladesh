import { useState } from "react";
import AddDivision from "../item/AddDivision";

const ModalDivision = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleModal = () => setIsOpen(!isOpen);
    return (
        <div>
            <div className="flex items-center justify-center   bg-gray-100">
                <button
                    onClick={toggleModal}
                    className="px-6 py-2 text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    Add Division
                </button>

                {isOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
                            {/* Close button */}
                            <button
                                onClick={toggleModal}
                                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>

                            <AddDivision />


                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ModalDivision