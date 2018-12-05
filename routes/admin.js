const express = require('express');

const app = express();
const path = require('path');
const rootDir = require('../libs/path-dir');
const adminController = require('../controllers/admin');
const router = express.Router();




router.get('/add-product', adminController.getAddProductPage);
router.get('/products', adminController.getProducts);
router.get('/edit-product/:id', adminController.editProducts);
router.post('/edit-product/', adminController.updateProduct);
router.post('/add-product', adminController.postAddProduct)
router.post('/delete-product', adminController.deleteProduct)

module.exports = router;
