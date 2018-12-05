const express = require('express');
const path = require('path');
const rootDir = require('../libs/path-dir');
const router = express.Router();
const shopController = require('../controllers/shop')


router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/cart', shopController.getCart);
router.post('/cart', shopController.addToCart);
router.post('/delete-cart-item', shopController.deleteCartItem);
router.get('/product-details/:id', shopController.getProduct);
router.get('/orders', shopController.getOrders);
router.post('/order-now', shopController.orderNow);
router.get('/checkout', shopController.getCheckout);


module.exports = router;