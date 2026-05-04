import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { FaFileInvoiceDollar, FaCreditCard, FaHistory, FaCheckCircle } from 'react-icons/fa';

const Maintenance = () => {
    const { user } = useContext(AuthContext);
    const [dues, setDues] = useState([]);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        fetchDues();
    }, []);

    const fetchDues = async () => {
        try {
            const res = await api.get('/maintenance');
            setDues(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleGenerateBill = async (e) => {
        e.preventDefault();
        try {
            await api.post('/maintenance/generate', { amount, description });
            alert('Bills generated successfully for all residents');
            setAmount('');
            setDescription('');
            fetchDues();
        } catch (error) {
            alert('Error generating bills');
        }
    };

    const handlePay = async (id) => {
        try {
            await api.post(`/maintenance/pay/${id}`);
            alert('Payment Successful');
            fetchDues();
        } catch (error) {
            alert('Payment failed');
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Maintenance & Bills</h2>
                    <p className="text-slate-500">Manage payments and track history.</p>
                </div>
            </div>

            {user.role === 'ADMIN' && (
                <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl shadow-lg p-8 text-white">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <FaFileInvoiceDollar /> Generate Monthly Maintenance
                    </h3>
                    <form onSubmit={handleGenerateBill} className="flex gap-4 items-end">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-indigo-100 mb-1">Amount ($)</label>
                            <input
                                type="number"
                                className="w-full bg-white/10 border border-white/20 p-3 rounded-lg text-white placeholder-indigo-200 focus:outline-none focus:bg-white/20 focus:border-white/40 transition"
                                placeholder="150"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex-[2]">
                            <label className="block text-sm font-medium text-indigo-100 mb-1">Description</label>
                            <input
                                type="text"
                                className="w-full bg-white/10 border border-white/20 p-3 rounded-lg text-white placeholder-indigo-200 focus:outline-none focus:bg-white/20 focus:border-white/40 transition"
                                placeholder="Maintenance for March 2026"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="bg-white text-indigo-600 font-bold py-3 px-6 rounded-lg hover:bg-indigo-50 transition shadow-lg">
                            Generate Bills
                        </button>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center gap-2 bg-slate-50">
                    <FaHistory className="text-slate-400" />
                    <h3 className="font-semibold text-slate-700">Transaction History</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 uppercase text-xs font-bold tracking-wider">
                                <th className="p-4 border-b border-slate-200">Description</th>
                                <th className="p-4 border-b border-slate-200">Amount</th>
                                <th className="p-4 border-b border-slate-200">Date Issued</th>
                                <th className="p-4 border-b border-slate-200">Status</th>
                                <th className="p-4 border-b border-slate-200 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {dues.map(due => (
                                <tr key={due.id} className="hover:bg-slate-50 transition">
                                    <td className="p-4">
                                        <div className="font-medium text-slate-800">{due.month}</div>
                                        {user.role === 'ADMIN' && (
                                            <div className="text-xs text-slate-400">User: {due.user?.name}</div>
                                        )}
                                    </td>
                                    <td className="p-4 font-bold text-slate-700">${due.amount}</td>
                                    <td className="p-4 text-slate-500 text-sm">{new Date(due.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit
                                            ${due.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                            {due.status === 'PAID' ? <FaCheckCircle size={10} /> : <FaHistory size={10} />}
                                            {due.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        {due.status === 'PENDING' && user.id === due.userId && (
                                            <button
                                                onClick={() => handlePay(due.id)}
                                                className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-md flex items-center gap-2 ml-auto"
                                            >
                                                <FaCreditCard /> Pay Now
                                            </button>
                                        )}
                                        {due.status === 'PAID' && (
                                            <span className="text-xs text-emerald-600 font-medium">Paid on {new Date(due.updatedAt).toLocaleDateString()}</span>
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

export default Maintenance;
