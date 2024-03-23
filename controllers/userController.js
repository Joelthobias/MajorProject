const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token from cookie
exports.authenticateUser = (req, res, next) => {
    // Check if the 'token' cookie exists
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }
    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Attach user ID to request object for further processing
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(403).json({ error: 'Unauthorized: Invalid token' });
    }
};

// Controller function to handle user login
exports.login = async (req, res) => {
    const { mobile, password } = req.body;
    try {
        const user = await User.findOne({ mobile });
        if (!user) {
            return res.status(400).json({ error: 'Invalid mobile number or password' });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ error: 'Invalid mobile number or password' });
        }
        // Save user data in local storage
        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Controller function to handle user signup
exports.signup = async (req, res) => {
    const { name, email, mobile, prno, semester, department, password } = req.body;
    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ mobile });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            mobile,
            prno,
            semester,
            department,
            password: hashedPassword
        });
        await newUser.save();
        // Save user data in local storage
        res.status(201).json({ success: true, user: newUser });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
