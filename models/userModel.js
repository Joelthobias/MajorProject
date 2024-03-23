const mongoose = require('mongoose');
const validator = require('validator');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: validator.isEmail,
            message: 'Please enter a valid email address'
        }
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
            validator: validator.isMobilePhone,
            message: 'Please enter a valid mobile number'
        }
    },
    prno: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    semester: {
        type: Number,
        required: true,
        min: 1,
        max: 6 // Update the maximum value to 6
    },
    department: {
        type: String,
        required: true,
        enum: ['Computer Engineering (CT)', 'Electronics and Communication Engineering (EC)', 'Tool and Die (TD)']
    },
    password: {
        type: String,
        required: true,
        minlength: 6 // You can set your desired minimum password length
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
