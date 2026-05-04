import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden relative">
                <Navbar />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-8 scroll-smooth">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
