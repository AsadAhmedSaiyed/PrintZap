const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Shop = require('../models/Shop');
const zohoService = require('../services/ZohoService');

// Get Orders for a Shop
router.get('/shops/:shopId/orders', async (req, res) => {
    try {
        const { shopId } = req.params;
        // Get active orders (pending/assigned/printed)
        const orders = await Order.find({
            shopId: shopId,
            status: { $in: ['pending', 'assigned', 'printed'] }
        }).sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Complete Order
router.post('/orders/:orderId/complete', async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findOne({ _id: orderId });

        if (!order) return res.status(404).json({ error: "Order not found" });

        // 1. Update Status
        order.status = 'completed';
        await order.save();

        // 2. Decrement Queue
        const shop = await Shop.findById(order.shopId);
        if (shop && shop.queueSize > 0) {
            shop.queueSize -= 1;
            await shop.save();
        }

        // 3. Delete File from WorkDrive
        if (order.workDriveFileId) {
            // Async deletion - don't block response
            zohoService.deleteFile(order.workDriveFileId)
                .then(success => {
                    if (success) console.log(`Deleted file for order ${order.orderId}`);
                });
        }

        // 4. Update Frontend
        const io = req.app.get('io');
        io.to(order.shopId.toString()).emit('order_completed', { orderId });

        res.json({ success: true, message: "Order completed" });

    } catch (error) {
        console.error("Completion Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// Create/Register a Shop (For setup)
router.post('/shops', async (req, res) => {
    try {
        const shop = new Shop(req.body);
        await shop.save();
        res.json(shop);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/shops', async (req, res) => {
    try {
        const shops = await Shop.find();
        res.json(shops);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
