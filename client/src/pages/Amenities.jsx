import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { FaSwimmingPool, FaDumbbell, FaTableTennis, FaCalendarCheck, FaClock } from 'react-icons/fa';

const Amenities = () => {
    const { user } = useContext(AuthContext);
    const [amenities, setAmenities] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');

    useEffect(() => {
        fetchAmenities();
        fetchBookings();
    }, []);

    const fetchAmenities = async () => {
        try {
            const res = await api.get('/amenities');
            setAmenities(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchBookings = async () => {
        try {
            const res = await api.get('/amenities/bookings');
            setBookings(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleBook = async (amenityId) => {
        try {
            await api.post('/amenities/book', { amenityId, date: selectedDate, time: selectedTime });
            alert('Booking successful');
            fetchBookings();
        } catch (error) {
            alert(error.response?.data?.message || 'Booking failed');
        }
    };

    const getIcon = (name) => {
        if (name.toLowerCase().includes('pool')) return <FaSwimmingPool size={40} className="text-cyan-500" />;
        if (name.toLowerCase().includes('gym')) return <FaDumbbell size={40} className="text-rose-500" />;
        if (name.toLowerCase().includes('tennis')) return <FaTableTennis size={40} className="text-emerald-500" />;
        return <FaCalendarCheck size={40} className="text-indigo-500" />;
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Amenities & Booking</h2>
                    <p className="text-slate-500">Reserve facilities for your leisure.</p>
                </div>
            </div>

            {/* Amenities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {amenities.map(amenity => (
                    <div key={amenity.id} className="bg-white rounded-xl shadow-lg border border-slate-100 p-6 hover:shadow-xl transition duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-slate-50 p-4 rounded-full">
                                {getIcon(amenity.name)}
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase
                                ${amenity.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                {amenity.status}
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">{amenity.name}</h3>
                        <p className="text-slate-500 text-sm mb-6">Enjoy our premium {amenity.name.toLowerCase()} facility. Book your slot now to avoid waiting.</p>

                        <div className="space-y-3">
                            <div className="flex gap-2">
                                <input
                                    type="date"
                                    className="flex-1 bg-slate-50 border border-slate-200 p-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 outline-none"
                                    onChange={e => setSelectedDate(e.target.value)}
                                />
                                <input
                                    type="time"
                                    className="flex-1 bg-slate-50 border border-slate-200 p-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 outline-none"
                                    onChange={e => setSelectedTime(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={() => handleBook(amenity.id)}
                                disabled={amenity.status !== 'AVAILABLE'}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium py-2 rounded-lg transition shadow-md"
                            >
                                Book Slot
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* My Bookings */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50">
                    <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                        <FaClock className="text-indigo-500" /> Your Upcoming Bookings
                    </h3>
                </div>
                {bookings.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                        {bookings.map(booking => (
                            <div key={booking.id} className="p-4 flex justify-between items-center hover:bg-slate-50 transition">
                                <div className="flex items-center gap-4">
                                    <div className="bg-indigo-50 p-3 rounded-lg text-indigo-600">
                                        <FaCalendarCheck />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800">{booking.amenity?.name}</h4>
                                        <div className="text-xs text-slate-500">
                                            {new Date(booking.date).toLocaleDateString()} at {booking.time}
                                        </div>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold
                                    ${booking.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-700' :
                                        booking.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                                    {booking.status}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-8 text-center text-slate-400">
                        No bookings found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Amenities;
