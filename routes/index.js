const express = require("express");
const router = express.Router();
const mainController = require('../controllers/mainController');
router.get('/',mainController.getAllProducts);
router.post('/add-product', mainController.addProduct );
module.exports = router;
