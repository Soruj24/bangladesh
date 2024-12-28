import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLoginMutation } from '../services/userApi';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../features/userSlice';
import { toast } from 'react-toastify';

// Define the Zod schema
const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const dispatch = useDispatch();
    const [login, { isLoading }] = useLoginMutation();

    const onSubmit = async (data) => {
        try {
            // Passing the data object directly to the login mutation
            const response = await login(data).unwrap();
            console.log(response)
            dispatch(setUser({
                user: response.user,
                accessToken: response.accessToken
            }));

            // Navigate to the home page
            navigate('/');

            // Show success toast
            toast.success('Login successful');
        } catch (error) {
            // Show error toast with message
            toast.error(error?.data?.message || 'Login failed');
            console.log('Login failed:', error?.data?.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Login</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            id="email"
                            type="email"
                            {...register('email')}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            id="password"
                            type="password"
                            {...register('password')}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <div>
                    <p className="text-gray-600">Don't have an account? <a href="/register" className="text-blue-500 hover:underline">Register</a></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
