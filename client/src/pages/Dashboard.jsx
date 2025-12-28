import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import OrderCard from '../components/OrderCard';
import Sidebar from '../components/Sidebar';
import { Loader, Menu, Zap } from 'lucide-react';

const Dashboard = () => {
    const [shop, setShop] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const API_URL = 'http://localhost:5000/api';

    useEffect(() => {
        const newSocket = io('http://localhost:5000');
        setSocket(newSocket);

        const initShop = async () => {
            try {
                let res = await axios.get(`${API_URL}/shops`);
                let activeShop = res.data[0];

                if (!activeShop) {
                    const newShopData = {
                        name: "Library Print Shop",
                        location: "Main Library",
                        printingRate: 2
                    };
                    const createRes = await axios.post(`${API_URL}/shops`, newShopData);
                    activeShop = createRes.data;
                }

                setShop(activeShop);
                newSocket.emit('join_shop', activeShop._id);

                const ordersRes = await axios.get(`${API_URL}/shops/${activeShop._id}/orders`);
                setOrders(ordersRes.data);

                setLoading(false);
            } catch (err) {
                console.error("Initialization failed", err);
                setLoading(false);
            }
        };

        initShop();
        return () => newSocket.close();
    }, []);

    useEffect(() => {
        if (!socket) return;
        socket.on('new_order', (newOrder) => {
            new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3').play().catch(e => { });
            setOrders(prev => [newOrder, ...prev]);
        });
        socket.on('order_completed', ({ orderId }) => {
            setOrders(prev => prev.filter(o => o._id !== orderId));
        });
        return () => {
            socket.off('new_order');
            socket.off('order_completed');
        };
    }, [socket]);

    const handleCompleteOrder = async (orderId) => {
        try {
            await axios.post(`${API_URL}/orders/${orderId}/complete`);
            setOrders(prev => prev.filter(o => o._id !== orderId));
        } catch (err) {
            alert("Error completing order");
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center gap-4">
                <Loader className="animate-spin w-10 h-10 text-indigo-600" />
                <p className="text-gray-500 font-medium">Booting PrintZap...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Mobile Sidebar Backdroop */}
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setIsSidebarOpen(false)} />
            )}

            <Sidebar shopName={shop?.name} />

            <main className="flex-1 md:ml-64 p-4 md:p-8 min-h-screen overflow-x-hidden">
                {/* Header */}
                <header className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden p-2 bg-white rounded-lg shadow-sm border border-gray-200">
                            <Menu className="w-6 h-6 text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Active Queue</h1>
                            <p className="text-gray-500 text-sm mt-1">Manage incoming print jobs in real-time</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200 flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${socket?.connected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                {socket?.connected ? 'Live' : 'Offline'}
                            </span>
                        </div>
                    </div>
                </header>

                {/* Content */}
                {orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg shadow-indigo-100 mb-6 relative">
                            <Zap className="w-10 h-10 text-indigo-500" />
                            <div className="absolute inset-0 border-4 border-indigo-50 rounded-full animate-ping opacity-20"></div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">All Caught Up!</h3>
                        <p className="text-gray-500 max-w-sm">
                            The queue is empty. Ready for the next student to zap a print.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {orders.map(order => (
                            <OrderCard
                                key={order._id}
                                order={order}
                                onComplete={handleCompleteOrder}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
