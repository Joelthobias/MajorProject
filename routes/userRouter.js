const express = require("express");
const router = express.Router();
const mainController = require('../controllers/mainController');
const ProductController = require('../controllers/productController');
const { login, signup } = require("../controllers/userController");

// Get all products
router.get('/', mainController.getAllProducts);
// Get a single product by ID
router.get('/product/:id', mainController.getProductById);
// Add product to cart
router.post('/add-to-cart/:productId', ProductController.addToCart);
// Create order
router.post('/create-order', ProductController.createOrder);
// removing product from cart
router.delete('/remove-from-cart/:userId/:productId', ProductController.removeFromCart);

router.post('/login', login);
router.post('/signup', signup);
module.exports = router;
