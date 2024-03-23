const Product = require("../models/productModel");
const path = require('path');

exports.addProduct = async (req, res) => {
    try {
        const { title, price, productID } = req.body;

        // Check if image file was uploaded
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ error: 'No image file uploaded' });
        }

        // Get the image file from the request
        let image = req.files.image;

        // Set filename as the productID with appropriate file extension
        const imageExtension = path.extname(image.name);
        const imageName = `${productID}${imageExtension}`;

        // Move the uploaded file to the public folder
        const imagePath = `public/images/${imageName}`;
        const Path = `/images/${imageName}`;
        await image.mv(imagePath);
        // console.log({ title, price, productID, img: imagePath });
        // Create the product in the database with the image path
        const product = await Product.create({ title, price, productID, img: Path });

        // Send response
        res.status(201).json({ product });
    } catch (error) {
        console.error(error);
        if (error.name === 'ValidationError') {
            // Validation error
            console.error('Validation error:', error.message);
            return res.status(400).json({ error: error.message });
        } else if (error.code === 11000) {
            // Duplicate key error (e.g., unique field violation)
            console.error('Duplicate key error:', error.message);
            return res.status(400).json({ error: 'Duplicate product ID' });
        } else {
            // Other errors
            console.error('Internal server error:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        // Find all products in the database
        const products = await Product.find();
        console.log(products);
        // Send response with all products
        res.status(200).json({ products });
    } catch (error) {
        console.error('Database query error:', error.message);
        // Database query error
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update a product by ID
exports.updateProduct = async (req, res) => {
    try {
        const { title, price, productID } = req.body;
        const productId = req.params.id; // Get the product ID from request params

        // Find the product by ID and update its fields
        const product = await Product.findOneAndUpdate({ 'productID': productId }, { title, price, productID }, { new: true });

        // Check if product exists
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Send updated product as response
        res.status(200).json({ product });
    } catch (error) {
        console.error('Update product error:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};
// Delete a product by ID
exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id; // Get the product ID from request params

        // Find the product by ID and delete it
        const product = await Product.findOneAndDelete({ 'productID': productId });

        // Check if product exists
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Send success message as response
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Delete product error:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};
// Get a single product by ID
exports.getProductById = async (req, res) => {
    try {
        const productId = req.params.id; // Get the product ID from request params
        console.log(productId);

        // Find the product by ID
        const product = await Product.findOne({'productID':productId})

        // Check if product exists
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Send product details as response
        res.status(200).json({ product });
    } catch (error) {
        console.error('Get product by ID error:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};
// Update product quantity by ID
exports.updateProductQuantity = async (req, res) => {
    try {
        const { quantity } = req.body;
        const productId = req.params.id; // Get the product ID from request params

        // Find the product by ID and update its quantity
        const product = await Product.findByIdAndUpdate(productId, { quantity }, { new: true });

        // Check if product exists
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Send updated product as response
        res.status(200).json({ product });
    } catch (error) {
        console.error('Update product quantity error:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

