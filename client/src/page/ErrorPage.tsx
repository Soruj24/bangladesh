import { Button } from '@/components/ui/button'; // Assuming you're using Shadcn Button component
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react'; // You can use any icon from lucide-react or shadcn

const ErrorPage = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1); // Go back to the previous page
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="text-center p-6 max-w-lg w-full bg-white rounded-lg shadow-md">
                <div className="text-red-500 text-5xl mb-4">
                    <AlertTriangle />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h1>
                <p className="text-gray-600 mb-6">
                    We encountered an unexpected error. Please try again later or go back to the previous page.
                </p>
                <Button onClick={handleGoBack} className="bg-blue-500 text-white hover:bg-blue-600">
                    Go Back
                </Button>
            </div>
        </div>
    );
};

export default ErrorPage;
