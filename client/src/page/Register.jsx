import { useForm } from 'react-hook-form';
import { useAddUserMutation } from '../services/userApi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useGetDivisionsQuery } from '../services/divisionApi';
import { useGetDistrictsQuery } from '../services/districtApi';
import { useState } from 'react';
import { useGetUpazilasQuery } from '../services/upazilaApi';
import { useGetUnionsQuery } from '../services/unionApi';
import { useGetVillagesQuery } from '../services/villageApi';

const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [addUser] = useAddUserMutation();
    const navigate = useNavigate();
    const [divisionId, setDivisionId] = useState('')
    const [districtId, setDistrictId] = useState('')
    const [upazilaId, setUpazilaId] = useState('')
    const [unionId, setUnionId] = useState('')
    const [villageId, setVillageId] = useState('')

    // Fetch data using the respective queries
    const { data: villages, isLoading: villagesLoading } = useGetVillagesQuery(unionId, { skip: !unionId });
    const { data: unions, isLoading: unionsLoading } = useGetUnionsQuery(upazilaId, { skip: !upazilaId });
    const { data: upazilas, isLoading: upazilasLoading } = useGetUpazilasQuery(districtId, { skip: !districtId });
    const { data: districts, isLoading: districtsLoading, } = useGetDistrictsQuery(divisionId, {
        skip: !divisionId, // Only fetch districts if divisionId is set
    });
    const { data: divisions, isLoading: divisionsLoading } = useGetDivisionsQuery();


    const onSubmit = async (data) => {
        try {
            const formData = {...data, village:villageId}
            console.log(formData);
            await addUser(formData);
            toast.success('User added successfully');
            navigate('/login');
        } catch (error) {
            console.log(error);
            toast.error('Failed to add user');
        }
    };


    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Add User</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Name Field */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            id="name"
                            type="text"
                            {...register('name', { required: "Name is required", minLength: { value: 2, message: "Name must be at least 2 characters" } })}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                    </div>

                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            id="email"
                            type="email"
                            {...register('email', { required: "Email is required", pattern: { value: /^\S+@\S+$/, message: "Invalid email address" } })}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            id="password"
                            type="password"
                            {...register('password', { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                    </div>

                    {/* Phone Field */}
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                        <input
                            id="phone"
                            type="text"
                            {...register('phone', { required: "Phone is required", pattern: { value: /^\d{11}$/, message: "Phone must be 11 digits" } })}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
                    </div>

                    {/* Tag Field */}
                    <div>
                        <label htmlFor="tag" className="block text-sm font-medium text-gray-700">Tag</label>
                        <input
                            id="tag"
                            type="text"
                            {...register('tag', { required: "Tag is required" })}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.tag && <p className="text-red-500 text-sm">{errors.tag.message}</p>}
                    </div>




                    {/* Division Field */}
                    <div>
                        <label htmlFor="division" className="block text-sm font-medium text-gray-700">Division</label>
                        <select
                            id="division"
                            {...register('division', { required: "Division is required" })}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            disabled={divisionsLoading}
                            onChange={(e) => setDivisionId(e.target?.value)}
                        >
                            <option value="">Select Division</option>
                            {divisionsLoading ? (
                                <option>Loading divisions...</option>
                            ) : (
                                divisions?.divisions?.map((division) => (
                                    <option key={division._id} value={division._id}>
                                        {division.name}
                                    </option>
                                ))
                            )}
                        </select>
                        {errors.division && <p className="text-red-500 text-sm">{errors.division.message}</p>}
                    </div>
                    {/* District Field */}

                    <div>
                        <label htmlFor="districts" className="block text-sm font-medium text-gray-700">District</label>
                        <select
                            id="districts"
                            {...register('district', { required: "District is required" })}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            onChange={(e) => setDistrictId(e.target?.value)} // Update the districtId state
                        >
                            <option value="">Select Districts</option>
                            {districtsLoading ? (
                                <option>Loading districts...</option>
                            ) : (
                                districts?.districts?.districts?.map((district) => (
                                    <option key={district._id} value={district._id}>
                                        {
                                            district.name
                                        }
                                    </option>
                                ))
                            )}
                        </select>
                        {errors.district && <p className="text-red-500 text-sm">{errors.district.message}</p>}
                    </div>
                    {/* Upazila Field */}
                    <div>
                        <label htmlFor="upazila" className="block text-sm font-medium text-gray-700">Upazila</label>
                        <select
                            id="upazila"
                            {...register('upazila', { required: "Upazila is required" })}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            disabled={upazilasLoading}
                            onChange={(e) => setUpazilaId(e.target?.value)}
                        >
                            <option value="">Select Upazilas</option>
                            {upazilasLoading ? (
                                <option>Loading...</option>
                            ) : (
                                upazilas?.upazila?.upazilas?.map((upazila) => (
                                    <option key={upazila._id} value={upazila._id}>
                                        {upazila?.name}
                                    </option>
                                ))
                            )}
                        </select>
                        {errors.upazila && <p className="text-red-500 text-sm">{errors.upazila.message}</p>}
                    </div>

                    {/* Union Field */}
                    <div>
                        <label htmlFor="union" className="block text-sm font-medium text-gray-700">Union</label>
                        <select
                            id="union"
                            {...register('union', { required: "Union is required" })}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            disabled={unionsLoading}
                            onChange={(e) => setUnionId(e.target?.value)}
                        >
                            <option value="">Select Union</option>

                            {unionsLoading ? (
                                <option>Loading...</option>
                            ) : (
                                unions?.unions?.map((union) => (
                                    <option key={union._id} value={union._id}>
                                        {union.name}
                                    </option>
                                ))
                            )}
                        </select>
                        {errors.union && <p className="text-red-500 text-sm">{errors.union.message}</p>}
                    </div>
                    {/* Village Field */}
                    <div>
                        <label htmlFor="village" className="block text-sm font-medium text-gray-700">Village</label>
                        <select
                            id="village"
                            {...register('village', { required: "Village is required" })}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            disabled={villagesLoading}
                            onChange={(e) => setVillageId(e.target?.value)}
                        >
                            <option value="">Select Village</option>

                            {villagesLoading ? (
                                <option>Loading...</option>
                            ) : (
                                villages?.villages?.map((village) => (
                                    <option key={village._id} value={village._id}>
                                        {village.name}
                                    </option>
                                ))
                            )}
                        </select>
                        {errors.village && <p className="text-red-500 text-sm">{errors.village.message}</p>}
                    </div>



                    {/* Submit Button */}
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md focus:outline-none hover:bg-blue-700"
                        >
                            Register
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
