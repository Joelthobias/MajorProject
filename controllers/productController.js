const Cart = require('../models/CartModel');
const Product = require('../models/productModel');
const Order = require('../models/OrderSchema');

exports.viewCart = async (req, res) => {
    try {
        const userId = req.query.userId; // Assuming userId is passed as a route parameter

        const carts = await Cart.findOne({ user: userId }).populate({
                path: 'products.product', // Populate the 'product' field of each product in the 'products' array
                model: Product, // Model to use for population
                select: 'title img price' // Specify which fields to include in the populated result
            });
        console.log(carts); // Check the fetched carts
        res.status(200).json({ success: true, carts });
    } catch (error) {
        console.error('Error fetching carts:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch carts' });
    }
}

// Function to add product to cart
exports.addProductToCart = async (userId, productId, quantity) => {
    try {
        console.log(userId, productId, quantity);
        const product = await Product.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }
        console.log(product);
        const totalPrice = product.price * quantity;
        const cartItem = {
            id: product.productID,
            product: product._id,
            quantity,
            totalPrice
        };

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({
                user: userId,
                products: [cartItem],
                totalQuantity: quantity,
                totalPrice
            });
        } else {
            // Check if the product already exists in the cart
            const existingProduct = cart.products.find(item => item.product.toString() === productId);
            if (existingProduct) {
                // If product already exists, update its quantity and total price
                existingProduct.quantity += quantity;
                existingProduct.totalPrice += totalPrice;
                cart.totalQuantity += quantity;
                cart.totalPrice += totalPrice;
            } else {
                // If product does not exist, add it to the cart
                cart.products.push(cartItem);
                cart.totalQuantity += quantity;
                cart.totalPrice += totalPrice;
            }
        }

        await cart.save();
        return cart;
    } catch (error) {
        throw new Error(`Failed to add product to cart: ${error.message}`);
    }
};



// Function to remove product from cart
exports.removeProductFromCart = async (userID, productID) => {
    try {
        let cart = await Cart.findOne({'user': userID });
        console.log(cart);
        if (!cart) {
            throw new Error('Cart not found');
        }

        const productIndex = cart.products.findIndex(item => item.product.toString() === productID);
        if (productIndex === -1) {
            throw new Error('Product not found in cart');
        }

        const product = cart.products[productIndex];
        cart.products.splice(productIndex, 1);
        cart.totalQuantity -= product.quantity;
        cart.totalPrice -= product.totalPrice;

        await cart.save();
        return cart;
    } catch (error) {
        throw new Error(`Failed to remove product from cart: ${error.message}`);
    }
};


// Function to create order from cart
exports.createOrder = async (userId) => {
    try {
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            throw new Error('Cart not found');
        }

        const order = new Order({
            user: userId,
            products: cart.products,
            totalQuantity: cart.totalQuantity,
            totalPrice: cart.totalPrice
        });

        await order.save();

        // Clear cart after order creation
        await Cart.findByIdAndDelete(cart._id);

        return order;
    } catch (error) {
        throw new Error(`Failed to create order: ${error.message}`);
    }
};

// Controller function to add product to cart
exports.addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        const cart = await this.addProductToCart(userId, productId, quantity);
        res.status(201).json({ success: true, cart });
    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(400).json({ success: false, message: error.message });
    }
};

// Controller function to remove product from cart
exports.removeFromCart = async (req, res) => {
    try {
        const { userId, productId } = req.query;
        const cart = await this.removeProductFromCart(userId, productId);
        res.status(200).json({ success: true, cart });
    } catch (error) {
        console.error('Error removing product from cart:', error);
        res.status(400).json({ success: false, message: error.message });
    }
};

// Controller function to place order
exports.placeOrder = async (req, res) => {
    try {
        const { userId } = req.body;
        const order = await this.createOrder(userId);
        res.status(201).json({ success: true, order });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const { userId } = req.query;
        console.log(userId);
        const order = await Order.find({ user: userId })
            .populate({
                path: 'products.product', // Populate the 'product' field of each product in the 'products' array
                model: Product, // Model to use for population
                select: 'title img price' // Specify which fields to include in the populated result
            })
            .exec();
        res.status(201).json({ success: true, order });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(400).json({ success: false, message: error.message });
    }
};


