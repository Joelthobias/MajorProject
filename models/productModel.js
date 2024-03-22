const mongoose = require("mongoose");
const validator = require('validator');

const Schema = mongoose.Schema
const prodcutSchema = new Schema({
    productID: {
        type: String,
        required: [true, 'A product must have a ID.'],
        trim: true,
    },
    title: {
        type: String,
        required: [true, 'A product must have a title.'],
        trim: true,
        minlength: [5, 'The title must be at least 5 characters long.'],
        maxlength: [50, 'The title cannot exceed 50 characters.']
    },
    img: {
        type: String,
        // required: [true, 'A product must have a image.'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'A product must have Price.'],
    }
}, { timestamps: true })

const Prodcut = mongoose.model('prodcuts', prodcutSchema)
module.exports = Prodcut;