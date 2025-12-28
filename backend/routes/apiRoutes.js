const express = require('express');
const shopController = require('../controllers/shopController');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.route('/shops')
    .get(shopController.getAllShops)
    .post(shopController.createShop);

router.get('/shops/:shopId/orders', shopController.getShopOrders);

router.post('/orders/:orderId/complete', orderController.completeOrder);

module.exports = router;
