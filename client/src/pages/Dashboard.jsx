import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LineChart, Line } from 'recharts';
import { FaUserFriends, FaExclamationCircle, FaDoorOpen, FaMoneyBillWave } from 'react-icons/fa';

const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-between transform hover:scale-105 transition-all duration-300">
        <div>
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">{title}</h3>
            <p className="text-3xl font-bold text-slate-800 mt-2">{value}</p>
        </div>
        <div className={`p-4 rounded-full ${color}`}>
            {icon}
        </div>
    </div>
);

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({ residents: 0, pendingComplaints: 0, todayVisitors: 0, pendingDues: 0 });
    const [chartData, setChartData] = useState([]);
    const [residents, setResidents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Resident Specific State
    const [myDues, setMyDues] = useState(0);
    const [myComplaints, setMyComplaints] = useState(0);
    const [myVisitors, setMyVisitors] = useState(0);
    const [upcomingBookings, setUpcomingBookings] = useState([]);

    useEffect(() => {
        if (user.role === 'ADMIN') {
            fetchStats();
            fetchResidents();
        } else if (user.role === 'RESIDENT') {
            fetchResidentData();
        }
    }, [user.role, user.id]);

    const fetchStats = async () => {
        try {
            const res = await api.get('/admin/stats');
            setStats(res.data);
            // Mock chart data for premium look
            setChartData([
                { name: 'Mon', visitors: 12, complaints: 2 },
                { name: 'Tue', visitors: 19, complaints: 3 },
                { name: 'Wed', visitors: 15, complaints: 1 },
                { name: 'Thu', visitors: 22, complaints: 4 },
                { name: 'Fri', visitors: 30, complaints: 2 },
                { name: 'Sat', visitors: 45, complaints: 5 },
                { name: 'Sun', visitors: 38, complaints: 1 },
            ]);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchResidents = async () => {
        try {
            const res = await api.get('/users/residents');
            setResidents(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchResidentData = async () => {
        try {
            // Fetch Maintenance Dues
            const maintenanceRes = await api.get('/maintenance');
            const unpaid = maintenanceRes.data
                .filter(m => m.status === 'PENDING')
                .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
            setMyDues(unpaid);

            // Fetch Active Complaints
            const complaintRes = await api.get('/complaints');
            const active = complaintRes.data.filter(c => c.status !== 'RESOLVED').length;
            setMyComplaints(active);

            // Fetch Visitors
            const visitorRes = await api.get('/visitors');
            const recent = visitorRes.data.filter(v => v.status === 'PENDING' || v.status === 'APPROVED').length;
            setMyVisitors(recent);

            // Fetch Amenities (Filter for current user)
            const bookingRes = await api.get('/amenities/bookings');
            const myBookings = bookingRes.data.filter(b => b.residentId === user.id && new Date(b.startTime) > new Date());
            setUpcomingBookings(myBookings);

        } catch (error) {
            console.error("Error fetching resident data", error);
        }
    }

    const filteredResidents = residents.filter(r =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.phoneNumber && r.phoneNumber.includes(searchTerm))
    );

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">
                        {user.role === 'ADMIN' ? 'Dashboard Overview' : `Welcome back, ${user.name.split(' ')[0]}!`}
                    </h2>
                    {user.role === 'RESIDENT' && <p className="text-slate-500">Here's what's happening in your home today.</p>}
                </div>
                {user.role === 'ADMIN' && (
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow hover:bg-indigo-700 transition">
                        Download Report
                    </button>
                )}
            </div>

            {user.role === 'ADMIN' ? (
                <>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            title="Total Residents"
                            value={stats.residents}
                            icon={<FaUserFriends size={24} className="text-blue-600" />}
                            color="bg-blue-100"
                        />
                        <StatCard
                            title="Pending Complaints"
                            value={stats.pendingComplaints}
                            icon={<FaExclamationCircle size={24} className="text-rose-600" />}
                            color="bg-rose-100"
                        />
                        <StatCard
                            title="Visitors Today"
                            value={stats.todayVisitors}
                            icon={<FaDoorOpen size={24} className="text-emerald-600" />}
                            color="bg-emerald-100"
                        />
                        <StatCard
                            title="Pending Dues"
                            value={`$${stats.pendingDues}`}
                            icon={<FaMoneyBillWave size={24} className="text-amber-600" />}
                            color="bg-amber-100"
                        />
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Weekly Visitor Trends */}
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
                            <h3 className="text-lg font-bold text-slate-800 mb-6">Weekly Visitor Trends</h3>
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                            cursor={{ fill: '#f1f5f9' }}
                                        />
                                        <Bar dataKey="visitors" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Complaint Resolution */}
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
                            <h3 className="text-lg font-bold text-slate-800 mb-6">Complaint Activity</h3>
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                        />
                                        <Line type="monotone" dataKey="complaints" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4, fill: '#f43f5e' }} activeDot={{ r: 6 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Residents Directory Table */}
                    <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50">
                            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <FaUserFriends className="text-indigo-600" /> Residents Directory
                            </h3>
                            <input
                                type="text"
                                placeholder="Search by Name, Email, or Phone..."
                                className="w-full md:w-1/3 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-200 outline-none text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 text-slate-500 uppercase text-xs font-bold tracking-wider">
                                        <th className="p-4 border-b border-slate-200">Name</th>
                                        <th className="p-4 border-b border-slate-200">Apartment</th>
                                        <th className="p-4 border-b border-slate-200">Email</th>
                                        <th className="p-4 border-b border-slate-200">Phone</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredResidents.length > 0 ? (
                                        filteredResidents.map(resident => (
                                            <tr key={resident.id} className="hover:bg-slate-50 transition">
                                                <td className="p-4 font-medium text-slate-800">{resident.name}</td>
                                                <td className="p-4 text-slate-600">
                                                    <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md text-xs font-bold">
                                                        {resident.apartmentNumber}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-slate-600">{resident.email}</td>
                                                <td className="p-4 text-slate-600">{resident.phoneNumber || 'N/A'}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="p-8 text-center text-slate-400">
                                                No residents found matching "{searchTerm}"
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : (
                <div className="space-y-6">
                    {/* Resident Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard
                            title="Total Payables"
                            value={`$${myDues}`}
                            icon={<FaMoneyBillWave size={24} className="text-indigo-600" />}
                            color="bg-indigo-100"
                        />
                        <StatCard
                            title="Active Complaints"
                            value={myComplaints}
                            icon={<FaExclamationCircle size={24} className="text-amber-600" />}
                            color="bg-amber-100"
                        />
                        <StatCard
                            title="Expected Visitors"
                            value={myVisitors}
                            icon={<FaUserFriends size={24} className="text-emerald-600" />}
                            color="bg-emerald-100"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
