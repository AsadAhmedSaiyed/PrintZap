import React from 'react';
import { Home, Settings, History, LogOut, Printer } from 'lucide-react';

const Sidebar = ({ shopName }) => {
    return (
        <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 hidden md:flex flex-col z-10 transition-all duration-300">
            <div className="p-6 border-b border-dashed border-gray-200 flex items-center gap-3">
                <div className="bg-indigo-600 p-2 rounded-lg shadow-indigo-200 shadow-lg">
                    <Printer className="text-white w-6 h-6" />
                </div>
                <span className="text-xl font-bold text-gray-900 tracking-tight">PrintZap</span>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                <a href="#" className="flex items-center gap-3 px-4 py-3 text-indigo-600 bg-indigo-50 rounded-xl font-medium transition-colors">
                    <Home className="w-5 h-5" />
                    Live Queue
                </a>
                <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium transition-all">
                    <History className="w-5 h-5" />
                    Order History
                </a>
                <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium transition-all">
                    <Settings className="w-5 h-5" />
                    Shop Settings
                </a>
            </nav>

            <div className="p-4 border-t border-gray-100">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                        {shopName ? shopName.substring(0, 2).toUpperCase() : 'SH'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{shopName || 'Loading...'}</p>
                        <p className="text-xs text-green-600 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                            Online
                        </p>
                    </div>
                    <LogOut className="w-4 h-4 text-gray-400 hover:text-red-500 cursor-pointer" />
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
