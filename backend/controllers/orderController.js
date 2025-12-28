const Order = require('../models/Order');
const Shop = require('../models/Shop');
const zohoService = require('../services/ZohoService');
const AppError = require('../utils/AppError');

const catchAsync = fn => (req, res, next) => {
    fn(req, res, next).catch(next);
};

exports.completeOrder = catchAsync(async (req, res, next) => {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
        return next(new AppError('No order found with that ID', 404));
    }

    if (order.status === 'completed') {
        return next(new AppError('Order is already completed', 400));
    }

    // 1. Update Status
    order.status = 'completed';
    await order.save();

    // 2. Decrement Queue
    const shop = await Shop.findById(order.shopId);
    if (shop && shop.queueSize > 0) {
        shop.queueSize -= 1;
        await shop.save();
    }

    // 3. Delete File from WorkDrive (Async, don't block response)
    if (order.workDriveFileId) {
        zohoService.deleteFile(order.workDriveFileId)
            .then(success => {
                if (!success) console.warn(`Failed to delete file for order ${order.orderId}`);
            })
            .catch(err => console.error(err));
    }

    // 4. Update Frontend via Socket
    const io = req.app.get('io');
    if (io) {
        io.to(order.shopId.toString()).emit('order_completed', { orderId: order._id });
    }

    res.status(200).json({
        status: 'success',
        message: 'Order completed successfully'
    });
});
