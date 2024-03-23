const express = require("express");
const router = express.Router();
const mainController = require('../controllers/mainController');

// Get all products
router.get('/', mainController.getAllProducts);
// Get a single product by ID
router.get('/product/:id', mainController.getProductById);

module.exports = router;
