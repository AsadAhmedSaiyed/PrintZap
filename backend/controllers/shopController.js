const Shop = require('../models/Shop');
const AppError = require('../utils/AppError');

// Simple Async Handler to avoid try-catch blocks
const catchAsync = fn => (req, res, next) => {
    fn(req, res, next).catch(next);
};

exports.getAllShops = catchAsync(async (req, res, next) => {
    const shops = await Shop.find();
    res.status(200).json({
        status: 'success',
        results: shops.length,
        data: shops
    });
});

exports.createShop = catchAsync(async (req, res, next) => {
    const newShop = await Shop.create(req.body);
    res.status(201).json({
        status: 'success',
        data: newShop
    });
});

exports.getShopOrders = catchAsync(async (req, res, next) => {
    // Requires Order model, imported lazily or via dependency injection if strictly needed. 
    // For now, let's keep it simple and require Order here.
    const Order = require('../models/Order');

    const orders = await Order.find({
        shopId: req.params.shopId,
        status: { $in: ['pending', 'assigned', 'printed'] }
    }).sort({ createdAt: -1 });

    res.status(200).json({
        status: 'success',
        results: orders.length,
        data: orders
    });
});
