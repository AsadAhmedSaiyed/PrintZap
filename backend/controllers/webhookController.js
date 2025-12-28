const Order = require('../models/Order');
const routingService = require('../services/RoutingService');
const pricingService = require('../services/PricingService');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

const catchAsync = fn => (req, res, next) => {
    fn(req, res, next).catch(next);
};

exports.handleZobotWebhook = catchAsync(async (req, res, next) => {
    logger.info("📥 Webhook Received", { payload: req.body });

    const {
        file_url,
        student_id,
        user_location,
        file_name,
        copies = 1,
        workdrive_resource_id
    } = req.body;

    if (!file_url) {
        return next(new AppError('No file provided', 400));
    }

    // 1. Route to Best Shop
    const bestShop = await routingService.findBestShop({ location: user_location });
    if (!bestShop) {
        return res.status(200).json({ text: "❌ No shops available right now." });
    }

    // 2. Calculate Price
    const settings = { copies: parseInt(copies), pages: 0, color: false };
    const priceDetails = await pricingService.calculatePrice(file_url, settings, bestShop.printingRate);

    // 3. Create Order
    const newOrder = await Order.create({
        orderId: `PZ-${Math.floor(1000 + Math.random() * 9000)}`,
        studentId: student_id || "Guest",
        fileUrl: file_url,
        fileName: file_name || "Document",
        settings: { ...settings, pages: priceDetails.pages },
        price: priceDetails.price,
        shopId: bestShop._id,
        status: 'pending',
        workDriveFileId: workdrive_resource_id
    });

    // 4. Update Shop Queue
    bestShop.queueSize += 1;
    await bestShop.save();

    // 5. Emit Socket Event
    const io = req.app.get('io');
    if (io) {
        io.to(bestShop._id.toString()).emit('new_order', newOrder);
    }

    // 6. Respond to Zobot
    res.status(200).json({
        text: `✅ Sent to *${bestShop.name}*\n📍 ${bestShop.location}\n💰 Cost: ₹${priceDetails.price} (${priceDetails.pages} pgs)`,
        shop_name: bestShop.name,
        price: priceDetails.price,
        order_id: newOrder.orderId
    });
});
