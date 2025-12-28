const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Shop = require('../models/Shop');
const routingService = require('../services/RoutingService');
const pricingService = require('../services/PricingService');

router.post('/zobot', async (req, res) => {
    try {
        console.log("📥 Webhook Received:", req.body);

        // 1. Parse Input
        // Note: Zobot payload structure depends on how Deluge sends it. 
        // We assume: { file_url, student_id, user_location, file_name, copies, workdrive_resource_id }
        const {
            file_url,
            student_id,
            user_location,
            file_name,
            copies = 1,
            workdrive_resource_id
        } = req.body;

        if (!file_url) {
            return res.status(400).json({ error: "No file provided" });
        }

        // 2. Route to Best Shop
        const bestShop = await routingService.findBestShop({ location: user_location });
        if (!bestShop) {
            return res.json({ text: "❌ No shops available right now." });
        }

        // 3. Calculate Price
        const settings = { copies: parseInt(copies), pages: 0, color: false };
        const priceDetails = await pricingService.calculatePrice(file_url, settings, bestShop.printingRate);

        settings.pages = priceDetails.pages;
        const finalPrice = priceDetails.price;

        // 4. Create Order
        const newOrder = new Order({
            orderId: `PZ-${Math.floor(1000 + Math.random() * 9000)}`, // Random 4 digit ID
            studentId: student_id || "Guest",
            fileUrl: file_url,
            fileName: file_name || "Document",
            settings: settings,
            price: finalPrice,
            shopId: bestShop._id,
            status: 'pending',
            workDriveFileId: workdrive_resource_id
        });

        await newOrder.save();

        // 5. Update Shop Queue
        bestShop.queueSize += 1;
        await bestShop.save();

        // 6. Emit Socket Event (Real-time)
        const io = req.app.get('io');
        if (io) {
            // Emit to specific shop room
            io.to(bestShop._id.toString()).emit('new_order', newOrder);
            // Also emit to global for now for testing
            io.emit('new_order_debug', newOrder);
        }

        // 7. Reply to Zobot
        res.json({
            text: `✅ Sent to *${bestShop.name}*\n📍 ${bestShop.location}\n💰 Cost: ₹${finalPrice} (${settings.pages} pgs)`,
            shop_name: bestShop.name,
            price: finalPrice,
            order_id: newOrder.orderId
        });

    } catch (error) {
        console.error("Webhook Error:", error);
        res.status(500).json({ text: "⚠️ Server Error processing order." });
    }
});

module.exports = router;
