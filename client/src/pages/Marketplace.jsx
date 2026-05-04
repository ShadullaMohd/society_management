import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { FaStore, FaTag, FaPhoneAlt, FaCamera, FaTrash } from 'react-icons/fa';

const Marketplace = () => {
    const { user } = useContext(AuthContext);
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState({ title: '', description: '', price: '', contact: '' });
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const res = await api.get('/marketplace');
            setItems(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        try {
            await api.post('/marketplace', newItem);
            setNewItem({ title: '', description: '', price: '', contact: '' });
            setShowForm(false);
            fetchItems();
        } catch (error) {
            alert('Error adding item');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to remove this item?')) return;
        try {
            await api.delete(`/marketplace/${id}`);
            fetchItems();
        } catch (error) {
            alert('Error deleting item');
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Community Marketplace</h2>
                    <p className="text-slate-500">Buy and sell items within your society.</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition shadow-lg flex items-center gap-2"
                >
                    <FaCamera /> {showForm ? 'Cancel Listing' : 'Sell Item'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-8 rounded-xl shadow-xl border border-indigo-100 animate-fade-in-down">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Create New Listing</h3>
                    <form onSubmit={handleAddItem} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Item Title</label>
                            <input
                                placeholder="e.g., Mountain Bike, Sofa, Books..."
                                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100"
                                value={newItem.title}
                                onChange={e => setNewItem({ ...newItem, title: e.target.value })}
                                required
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                            <textarea
                                placeholder="Describe the condition, age, etc."
                                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 min-h-[100px]"
                                value={newItem.description}
                                onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Price ($)</label>
                            <input
                                type="number"
                                placeholder="50"
                                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100"
                                value={newItem.price}
                                onChange={e => setNewItem({ ...newItem, price: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Contact Number</label>
                            <input
                                placeholder="9876543210"
                                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100"
                                value={newItem.contact}
                                onChange={e => setNewItem({ ...newItem, contact: e.target.value })}
                                required
                            />
                        </div>
                        <div className="md:col-span-2 flex justify-end">
                            <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-lg transition shadow-md">
                                Post Listing
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {items.length > 0 ? items.map(item => (
                    <div key={item.id} className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden group hover:-translate-y-1 transition duration-300">
                        <div className="h-48 bg-slate-200 flex items-center justify-center relative overflow-hidden">
                            {item.image ? (
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                            ) : (
                                <FaStore className="text-slate-300 text-6xl group-hover:scale-110 transition duration-500" />
                            )}
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-indigo-600 font-bold shadow-sm">
                                ${item.price}
                            </div>
                        </div>

                        <div className="p-6">
                            <h3 className="text-xl font-bold text-slate-800 mb-2">{item.title}</h3>
                            <p className="text-slate-600 text-sm mb-4 line-clamp-2">{item.description}</p>

                            <div className="flex items-center gap-2 text-slate-500 text-sm mb-6 bg-slate-50 p-3 rounded-lg">
                                <FaPhoneAlt className="text-indigo-400" />
                                <span>Contact: <span className="font-medium text-slate-700">{item.contact}</span></span>
                            </div>

                            <div className="flex justify-between items-center border-t border-slate-100 pt-4">
                                <div className="text-xs text-slate-400">
                                    Posted by <span className="font-medium text-slate-600">{item.user?.name}</span>
                                </div>
                                {(user.id === item.userId || user.role === 'ADMIN') && (
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-2 rounded-full transition"
                                        title="Delete Listing"
                                    >
                                        <FaTrash />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                        <FaTag className="mx-auto text-slate-300 text-5xl mb-4" />
                        <h3 className="text-lg font-medium text-slate-600">No items listed yet</h3>
                        <p className="text-slate-400">Be the first to list something for sale!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Marketplace;
