const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true },
    studentId: { type: String, required: true }, // From Zobot context
    fileUrl: { type: String, required: true },
    fileName: { type: String },
    settings: {
        copies: { type: Number, default: 1 },
        pages: { type: Number, required: true },
        color: { type: Boolean, default: false }
    },
    price: { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending', 'assigned', 'printed', 'cancelled', 'completed'],
        default: 'pending'
    },
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
    createdAt: { type: Date, default: Date.now },
    workDriveFileId: { type: String } // To track for deletion
});

module.exports = mongoose.model('Order', orderSchema);
