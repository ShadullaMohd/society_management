import React, { useEffect, useState, useContext, useRef } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { SocketContext } from '../context/SocketContext';
import { FaPaperPlane, FaComments, FaSearch, FaStar } from 'react-icons/fa';

const Complaints = () => {
    const { user } = useContext(AuthContext);
    const socket = useContext(SocketContext);
    const [complaints, setComplaints] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('PLUMBING');
    const [priority, setPriority] = useState('MEDIUM');
    const [activeComplaint, setActiveComplaint] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [rating, setRating] = useState(0);
    const [feedbackText, setFeedbackText] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchComplaints();
    }, []);

    useEffect(() => {
        setRating(0);
        setFeedbackText('');
    }, [activeComplaint]);

    useEffect(() => {
        if (socket && activeComplaint) {
            socket.emit('joinComplaint', activeComplaint.id);
        }
    }, [socket, activeComplaint]);

    useEffect(() => {
        if (socket) {
            socket.on('complaintStatusUpdate', (updatedComplaint) => {
                setComplaints(prev => prev.map(c => c.id === updatedComplaint.id ? updatedComplaint : c));
                if (activeComplaint && activeComplaint.id === updatedComplaint.id) {
                    setActiveComplaint(prev => ({ ...prev, status: updatedComplaint.status }));
                }
            });
            socket.on('newComplaintMessage', (message) => {
                // Prevent duplicate addition if we already added it via API response
                if (activeComplaint && message.complaintId === activeComplaint.id) {
                    setMessages(prev => {
                        if (prev.some(m => m.id === message.id)) return prev;
                        return [...prev, message];
                    });
                    scrollToBottom();
                }
            });
        }
        return () => {
            if (socket) {
                socket.off('complaintStatusUpdate');
                socket.off('newComplaintMessage');
            }
        };
    }, [socket, activeComplaint]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchComplaints = async () => {
        try {
            const res = await api.get('/complaints');
            setComplaints(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreateComplaint = async (e) => {
        e.preventDefault();
        try {
            await api.post('/complaints', { title, description, category, priority });
            setTitle('');
            setDescription('');
            setCategory('PLUMBING');
            setPriority('MEDIUM');
            fetchComplaints();
        } catch (error) {
            alert('Error creating complaint');
        }
    };

    const openChat = async (complaint) => {
        setActiveComplaint(complaint);
        try {
            const res = await api.get(`/complaints/${complaint.id}/messages`);
            setMessages(res.data);
            scrollToBottom();
            if (user.role === 'ADMIN' && complaint.status === 'OPEN') {
                updateStatus(complaint.id, 'IN_PROGRESS');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        try {
            await api.post(`/complaints/${activeComplaint.id}/messages`, { message: newMessage });
            setNewMessage('');
            // Status update happens via socket
        } catch (error) {
            console.error(error);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/complaints/${id}/status`, { status });
            // Optimistic update
            const updated = { ...activeComplaint, status };
            setActiveComplaint(updated);
            setComplaints(prev => prev.map(c => c.id === id ? { ...c, status } : c));
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmitFeedback = async () => {
        try {
            const res = await api.post(`/complaints/${activeComplaint.id}/feedback`, { rating, feedback: feedbackText });
            setActiveComplaint(prev => ({ ...prev, rating, feedback: feedbackText }));
            setComplaints(prev => prev.map(c => c.id === activeComplaint.id ? { ...c, rating, feedback: feedbackText } : c));
        } catch (error) {
            console.error(error);
            alert('Error submitting feedback');
        }
    };

    return (
        <div className="flex h-[calc(100vh-8rem)] gap-6">
            {/* Left Side - List */}
            <div className="w-1/3 bg-white rounded-xl shadow-lg border border-slate-100 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <FaComments className="text-indigo-600" /> Complaints
                    </h2>
                </div>

                {user.role === 'RESIDENT' && (
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                        <form onSubmit={handleCreateComplaint} className="space-y-3">
                            <input
                                placeholder="Issue Title"
                                className="w-full bg-white border border-slate-200 p-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 outline-none"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                required
                            />
                            <div className="flex gap-2">
                                <select
                                    className="w-1/2 bg-white border border-slate-200 p-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 outline-none"
                                    value={category}
                                    onChange={e => setCategory(e.target.value)}
                                >
                                    <option value="PLUMBING">Plumbing</option>
                                    <option value="ELECTRICAL">Electrical</option>
                                    <option value="SECURITY">Security</option>
                                    <option value="OTHER">Other</option>
                                </select>
                                <select
                                    className="w-1/2 bg-white border border-slate-200 p-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 outline-none"
                                    value={priority}
                                    onChange={e => setPriority(e.target.value)}
                                >
                                    <option value="LOW">Low Priority</option>
                                    <option value="MEDIUM">Medium Priority</option>
                                    <option value="HIGH">High Priority</option>
                                </select>
                            </div>
                            <textarea
                                placeholder="Describe the issue..."
                                className="w-full bg-white border border-slate-200 p-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 outline-none resize-none"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                required
                            />
                            <button type="submit" className="w-full bg-indigo-600 text-white text-sm font-medium py-2 rounded-lg hover:bg-indigo-700 transition">
                                Submit Complaint
                            </button>
                        </form>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {complaints.map(c => (
                        <div
                            key={c.id}
                            onClick={() => openChat(c)}
                            className={`p-4 rounded-lg cursor-pointer border transition-all duration-200
                                ${activeComplaint?.id === c.id
                                    ? 'bg-indigo-50 border-indigo-200 shadow-sm'
                                    : 'bg-white border-slate-100 hover:bg-slate-50 hover:border-slate-200'}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="font-semibold text-slate-800 line-clamp-1">{c.title}</h4>
                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full
                                    ${c.status === 'OPEN' ? 'bg-rose-100 text-rose-700' :
                                        c.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-700' :
                                            'bg-emerald-100 text-emerald-700'}`}>
                                    {c.status}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-2">{c.description}</p>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-[10px] text-slate-400">
                                    {new Date(c.createdAt).toLocaleDateString()}
                                </span>
                                {user.role === 'ADMIN' && (
                                    <span className="text-[10px] text-indigo-500 font-medium">
                                        {c.user?.name} ({c.user?.apartmentNumber})
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Side - Chat */}
            <div className="w-2/3 bg-white rounded-xl shadow-lg border border-slate-100 flex flex-col overflow-hidden relative">
                {activeComplaint ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-slate-800">{activeComplaint.title}</h3>
                                <p className="text-xs text-slate-500">Ticket ID: #{activeComplaint?.id?.slice(0, 8)}</p>
                            </div>
                            {((user.role === 'ADMIN' && activeComplaint.status !== 'RESOLVED' && activeComplaint.status !== 'CLOSED') || (user.role === 'RESIDENT' && activeComplaint.status !== 'CLOSED')) && (
                                <div className="flex gap-2">
                                    {user.role === 'ADMIN' && activeComplaint.status !== 'RESOLVED' && (
                                        <button
                                            onClick={() => updateStatus(activeComplaint.id, 'RESOLVED')}
                                            className="bg-emerald-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition shadow-sm"
                                        >
                                            Mark Resolved
                                        </button>
                                    )}
                                    <button
                                        onClick={() => updateStatus(activeComplaint.id, 'CLOSED')}
                                        className="bg-slate-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-slate-700 transition shadow-sm"
                                    >
                                        Close Complaint
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Feedback Section for Resident */}
                        {/* Feedback Section */}
                        {activeComplaint.status === 'CLOSED' && (user.role === 'RESIDENT' || activeComplaint.rating) && (
                            <div className="p-4 bg-yellow-50 border-b border-yellow-100">
                                {activeComplaint.rating ? (
                                    <div className="text-center">
                                        <p className="text-sm font-bold text-slate-700">
                                            {user.role === 'RESIDENT' ? "Thank you for your feedback!" : "Resident Feedback"}
                                        </p>
                                        <div className="flex justify-center gap-1 mt-1 text-yellow-500">
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar key={i} className={i < activeComplaint.rating ? "text-yellow-500" : "text-slate-300"} />
                                            ))}
                                        </div>
                                        {activeComplaint.feedback && (
                                            <p className="text-xs text-slate-500 mt-1 italic">"{activeComplaint.feedback}"</p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <p className="text-sm font-bold text-slate-700 text-center">Rate the resolution</p>
                                        <div className="flex justify-center gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => submitFeedback(star)}
                                                    className={`text-2xl transition hover:scale-110 ${rating >= star ? 'text-yellow-500' : 'text-slate-300'}`}
                                                    onMouseEnter={() => setRating(star)}
                                                >
                                                    <FaStar />
                                                </button>
                                            ))}
                                        </div>
                                        <textarea
                                            placeholder="Any feedback? (Optional)"
                                            className="w-full text-xs p-2 rounded border border-yellow-200 focus:outline-none focus:border-yellow-400 bg-white"
                                            rows="2"
                                            value={feedbackText}
                                            onChange={(e) => setFeedbackText(e.target.value)}
                                        />
                                        <button
                                            onClick={handleSubmitFeedback}
                                            disabled={rating === 0}
                                            className="w-full bg-yellow-500 text-white text-xs font-bold py-2 rounded hover:bg-yellow-600 transition disabled:opacity-50"
                                        >
                                            Submit Feedback
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 space-y-4">
                            {messages.map((msg, index) => {
                                const isMe = (msg.isAdmin && user.role === 'ADMIN') || (!msg.isAdmin && user.role === 'RESIDENT');
                                return (
                                    <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] p-3 rounded-2xl text-sm shadow-sm
                                            ${isMe
                                                ? 'bg-indigo-600 text-white rounded-br-none'
                                                : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'}`}>
                                            <p>{msg.message}</p>
                                            <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-indigo-200' : 'text-slate-400'}`}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        {activeComplaint.status !== 'CLOSED' && activeComplaint.status !== 'RESOLVED' ? (
                            <form onSubmit={sendMessage} className="p-4 bg-white border-t border-slate-100 flex gap-3">
                                <input
                                    placeholder="Type your message..."
                                    className="flex-1 bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-100 outline-none"
                                    value={newMessage}
                                    onChange={e => setNewMessage(e.target.value)}
                                />
                                <button type="submit" className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition shadow-md">
                                    <FaPaperPlane />
                                </button>
                            </form>
                        ) : (
                            <div className="p-4 bg-slate-50 text-center text-slate-500 text-sm border-t border-slate-200">
                                This ticket has been closed.
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                        <FaComments size={48} className="mb-4 text-slate-200" />
                        <p>Select a complaint to view details</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Complaints;
