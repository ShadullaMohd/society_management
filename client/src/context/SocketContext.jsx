import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { AuthContext } from './AuthContext';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (user) {
            const newSocket = io('http://localhost:5000');
            setSocket(newSocket);

            // Join user specific room if needed
            // newSocket.emit('join', user.role === 'RESIDENT'); 
            if (user.role === 'RESIDENT') {
                newSocket.emit('joinRoom', `resident-${user._id}`);
            } else if (user.role === 'ADMIN') {
                newSocket.emit('joinRoom', 'admin');
            } else if (user.role === 'SECURITY') {
                newSocket.emit('joinRoom', 'security');
            }

            return () => newSocket.close();
        }
    }, [user]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
