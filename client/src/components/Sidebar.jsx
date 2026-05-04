import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
    FaUser, FaUsers, FaWrench, FaComments, FaSwimmingPool,
    FaBullhorn, FaStore, FaChartLine, FaSignOutAlt
} from 'react-icons/fa';

const Sidebar = () => {
    const { user, logout } = useContext(AuthContext);

    const getLinks = () => {
        const links = [];
        if (user.role === 'ADMIN') {
            links.push({ name: 'Dashboard', path: '/', icon: <FaChartLine /> });
            links.push({ name: 'Visitors', path: '/visitors', icon: <FaUsers /> });
            links.push({ name: 'Maintenance', path: '/maintenance', icon: <FaWrench /> });
            links.push({ name: 'Complaints', path: '/complaints', icon: <FaComments /> });
            links.push({ name: 'Amenities', path: '/amenities', icon: <FaSwimmingPool /> });
            links.push({ name: 'Announcements', path: '/announcements', icon: <FaBullhorn /> });
            links.push({ name: 'Marketplace', path: '/marketplace', icon: <FaStore /> });
        } else if (user.role === 'RESIDENT') {
            links.push({ name: 'Dashboard', path: '/', icon: <FaUser /> });
            links.push({ name: 'Visitors', path: '/visitors', icon: <FaUsers /> });
            links.push({ name: 'Maintenance', path: '/maintenance', icon: <FaWrench /> });
            links.push({ name: 'Complaints', path: '/complaints', icon: <FaComments /> });
            links.push({ name: 'Amenities', path: '/amenities', icon: <FaSwimmingPool /> });
            links.push({ name: 'Announcements', path: '/announcements', icon: <FaBullhorn /> });
            links.push({ name: 'Marketplace', path: '/marketplace', icon: <FaStore /> });
        } else if (user.role === 'SECURITY') {
            links.push({ name: 'Visitors', path: '/visitors', icon: <FaUsers /> });
            links.push({ name: 'Announcements', path: '/announcements', icon: <FaBullhorn /> });
        }
        return links;
    };

    return (
        <div className="w-64 bg-slate-900 text-white flex flex-col h-full shadow-2xl">
            <div className="h-16 flex items-center justify-center border-b border-slate-800 bg-slate-900">
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                    Society Manager
                </h1>
            </div>

            <nav className="flex-1 overflow-y-auto py-4 space-y-1">
                {getLinks().map(link => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) => `
                            flex items-center px-6 py-3 text-sm font-medium transition-all duration-200
                            ${isActive
                                ? 'bg-indigo-600/20 border-r-4 border-indigo-500 text-indigo-400'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }
                        `}
                    >
                        <span className="text-lg mr-3">{link.icon}</span>
                        {link.name}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={logout}
                    className="flex items-center w-full px-4 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <FaSignOutAlt className="mr-3" />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
