import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { SocketContext } from '../context/SocketContext';
import { FaBullhorn, FaPoll, FaVoteYea } from 'react-icons/fa';

const Announcements = () => {
    const { user } = useContext(AuthContext);
    const socket = useContext(SocketContext);
    const [announcements, setAnnouncements] = useState([]);
    const [polls, setPolls] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [priority, setPriority] = useState('NORMAL');
    const [pollQuestion, setPollQuestion] = useState('');
    const [pollOptions, setPollOptions] = useState(['', '']);

    useEffect(() => {
        fetchData();
        if (socket) {
            socket.on('newAnnouncement', (announcement) => setAnnouncements(prev => [announcement, ...prev]));
            socket.on('newPoll', (poll) => setPolls(prev => [poll, ...prev]));
            socket.on('pollUpdate', (updatedPoll) => setPolls(prev => prev.map(p => p.id === updatedPoll.id ? updatedPoll : p)));
        }
        return () => {
            if (socket) {
                socket.off('newAnnouncement');
                socket.off('newPoll');
                socket.off('pollUpdate');
            }
        };
    }, [socket]);

    const fetchData = async () => {
        try {
            const [annRes, pollRes] = await Promise.all([
                api.get('/announcements'),
                api.get('/announcements/polls')
            ]);
            setAnnouncements(annRes.data);
            setPolls(pollRes.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handlePostAnnouncement = async (e) => {
        e.preventDefault();
        try {
            await api.post('/announcements', { title, content, priority });
            setTitle('');
            setContent('');
        } catch (error) {
            alert('Error posting announcement');
        }
    };

    const handleCreatePoll = async (e) => {
        e.preventDefault();
        try {
            await api.post('/announcements/polls', { question: pollQuestion, options: pollOptions });
            setPollQuestion('');
            setPollOptions(['', '']);
        } catch (error) {
            alert('Error creating poll');
        }
    };

    const handleVote = async (pollId, optionIndex) => {
        try {
            await api.post(`/announcements/polls/${pollId}/vote`, { optionIndex });
        } catch (error) {
            alert(error.response?.data?.message || 'Error voting');
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Announcements Feed */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-indigo-100 p-3 rounded-full text-indigo-600">
                        <FaBullhorn size={20} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Announcements</h2>
                        <p className="text-slate-500 text-sm">Latest updates from management</p>
                    </div>
                </div>

                {user.role === 'ADMIN' && (
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
                        <h3 className="font-bold text-slate-700 mb-4">Post New Announcement</h3>
                        <form onSubmit={handlePostAnnouncement} className="space-y-4">
                            <input
                                placeholder="Headline"
                                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                required
                            />
                            <textarea
                                placeholder="Details..."
                                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 min-h-[100px]"
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                required
                            />
                            <div className="flex gap-4">
                                <select
                                    className="bg-slate-50 border border-slate-200 p-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100"
                                    value={priority}
                                    onChange={e => setPriority(e.target.value)}
                                >
                                    <option value="NORMAL">Normal</option>
                                    <option value="High">High</option>
                                    <option value="Urgent">Urgent</option>
                                </select>
                                <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium p-3 rounded-lg transition shadow-md">
                                    Post Update
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="space-y-4">
                    {announcements.map(ann => (
                        <div key={ann.id} className="bg-white p-6 rounded-xl shadow-md border border-slate-100 hover:shadow-lg transition">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-bold text-slate-800">{ann.title}</h3>
                                <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase
                                    ${ann.priority === 'Urgent' ? 'bg-rose-100 text-rose-700' :
                                        ann.priority === 'High' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {ann.priority}
                                </span>
                            </div>
                            <p className="text-slate-600 leading-relaxed">{ann.content}</p>
                            <p className="text-xs text-slate-400 mt-4 text-right">{new Date(ann.date).toLocaleDateString()}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Polls Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-emerald-100 p-3 rounded-full text-emerald-600">
                        <FaPoll size={20} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Community Polls</h2>
                        <p className="text-slate-500 text-sm">Voice your opinion</p>
                    </div>
                </div>

                {user.role === 'ADMIN' && (
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
                        <h3 className="font-bold text-slate-700 mb-4">Create New Poll</h3>
                        <form onSubmit={handleCreatePoll} className="space-y-4">
                            <input
                                placeholder="Question?"
                                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg outline-none focus:ring-2 focus:ring-emerald-100"
                                value={pollQuestion}
                                onChange={e => setPollQuestion(e.target.value)}
                                required
                            />
                            {pollOptions.map((opt, idx) => (
                                <input
                                    key={idx}
                                    placeholder={`Option ${idx + 1}`}
                                    className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-emerald-100"
                                    value={opt}
                                    onChange={e => {
                                        const newOpts = [...pollOptions];
                                        newOpts[idx] = e.target.value;
                                        setPollOptions(newOpts);
                                    }}
                                    required
                                />
                            ))}
                            <button
                                type="button"
                                onClick={() => setPollOptions([...pollOptions, ''])}
                                className="text-sm text-emerald-600 font-medium hover:underline"
                            >
                                + Add Option
                            </button>
                            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium p-3 rounded-lg transition shadow-md">
                                Launch Poll
                            </button>
                        </form>
                    </div>
                )}

                <div className="space-y-4">
                    {polls.map(poll => (
                        <div key={poll.id} className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="font-bold text-slate-800 text-lg">{poll.question}</h3>
                                <div className={`text-xs px-2 py-1 rounded-full ${poll.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                                    {poll.isActive ? 'Active' : 'Ended'}
                                </div>
                            </div>

                            <div className="space-y-3">
                                {poll.options.map((opt, idx) => {
                                    const totalVotes = poll.votes ? poll.votes.length : 0;
                                    const voteCount = poll.votes ? poll.votes.filter(v => v.optionIndex === idx).length : 0;
                                    const percentage = totalVotes === 0 ? 0 : Math.round((voteCount / totalVotes) * 100);

                                    return (
                                        <div key={idx} className="relative">
                                            <div className="flex justify-between text-sm mb-1 px-1">
                                                <span className="font-medium text-slate-700">{opt}</span>
                                                <span className="text-slate-500">{percentage}% ({voteCount} votes)</span>
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden cursor-pointer" onClick={() => handleVote(poll.id, idx)}>
                                                <div
                                                    className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full rounded-full transition-all duration-500 ease-out"
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            {user.role === 'RESIDENT' && poll.isActive && (
                                <p className="text-xs text-center text-slate-400 mt-4">Click on a bar to vote</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Announcements;
