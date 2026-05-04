import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <div className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex justify-between items-center px-8 z-10 sticky top-0">
            <h2 className="text-lg font-semibold text-slate-700">
                Welcome back, <span className="text-indigo-600">{user?.name}</span>
            </h2>

            <div className="flex items-center gap-4">
                <div className="flex flex-col text-right">
                    <span className="text-sm font-medium text-slate-900">{user?.name}</span>
                    <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">{user?.role}</span>
                </div>
                <div className="bg-indigo-100 p-2 rounded-full text-indigo-600">
                    <FaUserCircle size={24} />
                </div>
            </div>
        </div>
    );
};

export default Navbar;
