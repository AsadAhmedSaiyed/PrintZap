import React from 'react';
import { FileText, Printer, CheckCircle, Clock } from 'lucide-react';
import printJS from 'print-js';

const OrderCard = ({ order, onComplete }) => {

    const handlePrint = () => {
        if (order.fileUrl.endsWith('.pdf')) {
            printJS({ printable: order.fileUrl, type: 'pdf', showModal: true });
        } else {
            window.open(order.fileUrl, '_blank');
        }
    };

    const timeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        if (seconds < 60) return 'Just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        return `${Math.floor(minutes / 60)}h ago`;
    };

    return (
        <div className="group bg-white rounded-2xl shadow-sm border border-gray-200 p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in relative overflow-hidden">
            {/* Left accent border */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-l-2xl"></div>

            <div className="flex justify-between items-start mb-4 pl-2">
                <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                        <FileText size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-1" title={order.fileName}>
                            {order.fileName || 'Untitled Doc'}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                            <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-semibold text-gray-600">
                                {order.settings.pages} pgs
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                <Clock size={12} />
                                {timeAgo(order.createdAt)}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <span className="block text-xl font-bold text-gray-900">₹{order.price}</span>
                    <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                        #{order.orderId.split('-')[1]}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5 pl-2">
                <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                    <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Copies</div>
                    <div className="text-lg font-bold text-gray-800">{order.settings.copies}</div>
                </div>
                <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                    <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Settings</div>
                    <div className="text-sm font-semibold text-gray-700 flex items-center gap-1 h-7">
                        {order.settings.color ?
                            <span className="flex items-center gap-1 text-pink-600"><span className="w-2 h-2 rounded-full bg-pink-500"></span>Color</span> :
                            <span className="flex items-center gap-1 text-gray-600"><span className="w-2 h-2 rounded-full bg-gray-400"></span>B&W</span>
                        }
                    </div>
                </div>
            </div>

            <div className="flex gap-3 pl-2">
                <button
                    onClick={handlePrint}
                    className="flex-1 py-2.5 px-4 bg-gray-900 text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-gray-800 active:scale-95 transition-all shadow-lg shadow-gray-200"
                >
                    <Printer size={16} />
                    Print File
                </button>
                <button
                    onClick={() => onComplete(order._id)}
                    className="flex-1 py-2.5 px-4 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-emerald-100 hover:text-emerald-700 active:scale-95 transition-all"
                >
                    <CheckCircle size={16} />
                    Complete
                </button>
            </div>
        </div>
    );
};

export default OrderCard;
