import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'RESIDENT', apartmentNumber: '', phoneNumber: '' });
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex font-sans">
            {/* Left Side - Image/Gradient */}
            <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-emerald-600 to-teal-600 items-center justify-center text-white p-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="z-10 max-w-md">
                    <h1 className="text-5xl font-bold mb-6">Join the Community.</h1>
                    <p className="text-emerald-100 text-lg leading-relaxed">
                        Create your account to start managing your home, visitors, and payments with ease.
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8">
                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-slate-800">Create Account</h2>
                        <p className="text-slate-500 mt-2">Get started with your free account.</p>
                    </div>

                    {error && (
                        <div className="bg-rose-50 border-l-4 border-rose-500 text-rose-700 p-4 mb-6 rounded-r" role="alert">
                            <p className="font-bold">Error</p>
                            <p>{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                            <input
                                className="w-full px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-200 transition outline-none"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                className="w-full px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-200 transition outline-none"
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                            <input
                                type="password"
                                className="w-full px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-200 transition outline-none"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                                <select
                                    className="w-full px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-200 transition outline-none"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="RESIDENT">Resident</option>
                                    <option value="ADMIN">Admin</option>
                                    <option value="SECURITY">Security</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                                <input
                                    className="w-full px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-200 transition outline-none"
                                    placeholder="9876543210"
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {formData.role === 'RESIDENT' && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Apartment Number</label>
                                <input
                                    className="w-full px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-200 transition outline-none"
                                    placeholder="A-101"
                                    value={formData.apartmentNumber}
                                    onChange={(e) => setFormData({ ...formData, apartmentNumber: e.target.value })}
                                    required
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-0.5 mt-4"
                        >
                            Create Account
                        </button>
                    </form>

                    <p className="mt-6 text-center text-slate-500">
                        Already have an account?{' '}
                        <Link to="/" className="text-emerald-600 font-semibold hover:text-emerald-500 transition">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
