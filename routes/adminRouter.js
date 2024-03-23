const express = require("express");
const router = express.Router();
const mainController = require('../controllers/mainController');

// Get all products
router.get('/', mainController.getAllProducts);

// Add a new product
router.post('/add-product', mainController.addProduct);

// Update a product by ID
router.put('/update-product/:id', mainController.updateProduct);

// Delete a product by ID
router.delete('/delete-product/:id', mainController.deleteProduct);

// Get a single product by ID
router.get('/product/:id', mainController.getProductById);

// Update product quantity by ID
router.put('/update-product-quantity/:id', mainController.updateProductQuantity);

module.exports = router;
