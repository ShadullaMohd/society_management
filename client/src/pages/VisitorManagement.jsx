import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { SocketContext } from '../context/SocketContext';
import { FaCheck, FaTimes, FaSignOutAlt, FaPlus, FaSearch } from 'react-icons/fa';

const VisitorManagement = () => {
    const { user } = useContext(AuthContext);
    const socket = useContext(SocketContext);
    const [visitors, setVisitors] = useState([]);
    const [formData, setFormData] = useState({ name: '', phoneNumber: '', purpose: '', residentId: '' });
    const [residents, setResidents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (user) {
            fetchVisitors();
            if (user.role === 'SECURITY' || user.role === 'ADMIN') {
                fetchResidents();
            }
        }

        if (socket) {
            socket.on('newVisitor', (visitor) => {
                setVisitors(prev => [visitor, ...prev]);
            });
            socket.on('visitorStatusUpdate', (updatedVisitor) => {
                setVisitors(prev => prev.map(v => v.id === updatedVisitor.id ? updatedVisitor : v));
            });
        }
        return () => {
            if (socket) {
                socket.off('newVisitor');
                socket.off('visitorStatusUpdate');
            }
        };
    }, [socket, user]);

    const fetchVisitors = async () => {
        try {
            const res = await api.get('/visitors');
            setVisitors(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchResidents = async () => {
        try {
            const res = await api.get('/users/residents');
            if (Array.isArray(res.data)) {
                setResidents(res.data);
            } else {
                console.error("Residents response is not an array:", res.data);
                setResidents([]);
            }
        } catch (error) {
            console.error("Failed to fetch residents", error);
        }
    };

    if (!user) return <div className="p-8 text-center">Loading...</div>;

    const handleAddVisitor = async (e) => {
        e.preventDefault();
        try {
            await api.post('/visitors', formData);
            setFormData({ name: '', phoneNumber: '', purpose: '', residentId: '' });
            fetchVisitors();
        } catch (error) {
            alert(error.response?.data?.message || 'Error adding visitor');
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/visitors/${id}/status`, { status });
        } catch (error) {
            console.error(error);
        }
    };

    const filteredVisitors = visitors.filter(v =>
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.purpose.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Visitor Management</h2>
                    <p className="text-slate-500">Track and manage visitor entries.</p>
                </div>
            </div>

            {(user.role === 'SECURITY' || user.role === 'ADMIN') ? (
                <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-indigo-600">
                        <FaPlus size={16} /> New Entry
                    </h3>
                    <form onSubmit={handleAddVisitor} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <input
                            placeholder="Visitor Name"
                            className="bg-slate-50 border border-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                        <input
                            placeholder="Phone Number"
                            className="bg-slate-50 border border-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none"
                            value={formData.phoneNumber}
                            onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                            required
                        />
                        <input
                            placeholder="Purpose"
                            className="bg-slate-50 border border-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none"
                            value={formData.purpose}
                            onChange={e => setFormData({ ...formData, purpose: e.target.value })}
                        />
                        <select
                            className="bg-slate-50 border border-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none"
                            value={formData.residentId}
                            onChange={e => setFormData({ ...formData, residentId: e.target.value })}
                            required
                        >
                            <option value="">Select Resident</option>
                            {Array.isArray(residents) && residents.map(r => (
                                <option key={r.id} value={r.id}>{r.name} - {r.apartmentNumber}</option>
                            ))}
                        </select>
                        <button type="submit" className="bg-indigo-600 text-white font-medium p-3 rounded-lg hover:bg-indigo-700 transition shadow-md">
                            Add Visitor
                        </button>
                    </form>
                </div>
            ) : null}

            <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-semibold text-slate-700">Visitor Log</h3>
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-3 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search visitors..."
                            className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-200 outline-none text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 uppercase text-xs font-bold tracking-wider">
                                <th className="p-4 border-b border-slate-200">Name</th>
                                <th className="p-4 border-b border-slate-200">Purpose</th>
                                <th className="p-4 border-b border-slate-200">Resident</th>
                                <th className="p-4 border-b border-slate-200">Time</th>
                                <th className="p-4 border-b border-slate-200">Status</th>
                                <th className="p-4 border-b border-slate-200">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredVisitors.map(visitor => (
                                <tr key={visitor.id} className="hover:bg-slate-50 transition">
                                    <td className="p-4 font-medium text-slate-800">{visitor.name}</td>
                                    <td className="p-4 text-slate-600">{visitor.purpose}</td>
                                    <td className="p-4 text-slate-600">
                                        {visitor.resident?.name}
                                        {visitor.resident?.apartmentNumber && <span className="text-xs text-slate-400 ml-1">({visitor.resident.apartmentNumber})</span>}
                                    </td>
                                    <td className="p-4 text-slate-500 text-sm">{new Date(visitor.entryTime).toLocaleString()}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm
                                            ${visitor.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                                                visitor.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                                                    visitor.status === 'REJECTED' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'}`}>
                                            {visitor.status}
                                        </span>
                                    </td>
                                    <td className="p-4 flex gap-2">
                                        {user.role === 'RESIDENT' && visitor.status === 'PENDING' && (
                                            <>
                                                <button onClick={() => updateStatus(visitor.id, 'APPROVED')} className="bg-emerald-100 hover:bg-emerald-200 text-emerald-600 p-2 rounded-full transition" title="Approve">
                                                    <FaCheck size={14} />
                                                </button>
                                                <button onClick={() => updateStatus(visitor.id, 'REJECTED')} className="bg-rose-100 hover:bg-rose-200 text-rose-600 p-2 rounded-full transition" title="Reject">
                                                    <FaTimes size={14} />
                                                </button>
                                            </>
                                        )}
                                        {user.role === 'SECURITY' && visitor.status === 'APPROVED' && (
                                            <button onClick={() => updateStatus(visitor.id, 'EXITED')} className="bg-blue-100 hover:bg-blue-200 text-blue-600 p-2 rounded-full transition" title="Mark Exit">
                                                <FaSignOutAlt size={14} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default VisitorManagement;
