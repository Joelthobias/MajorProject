const Cart = require('../models/CartModel');
const Product = require('../models/productModel');
const Order = require('../models/OrderSchema');

exports.viewCart = async (req, res) => {
    try {
        const userId = req.query.userId; // Assuming userId is passed as a route parameter

        const carts = await Cart.find({ user: userId });
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
        productId = parseInt(productId);
        const product = await Product.findOne({ productID: productId });
        if (!product) {
            throw new Error('Product not found');
        }

        const totalPrice = product.price * quantity;
        const cartItem = {
            product: productId,
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
            const existingProductIndex = cart.products.findIndex(item => item.product === productId);
            if (existingProductIndex !== -1) {
                // If product already exists, update its quantity and total price
                cart.products[existingProductIndex].quantity += quantity;
                cart.products[existingProductIndex].totalPrice += totalPrice;
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
    productID = parseInt(productID)

    try {
        let cart = await Cart.findOne({ userID});
        if (!cart) {
            throw new Error('Cart not found');
        }

        const index = cart.products.findIndex(item => item.product === productID);
        if (index === -1) {
            throw new Error('Product not found in cart');
        }

        const product = cart.products[index];
        cart.products.splice(index, 1);
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
    console.log(req.body);
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
        const { userId, productId } = req.body;
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
