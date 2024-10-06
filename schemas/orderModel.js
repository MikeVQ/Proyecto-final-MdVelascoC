const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
        {
            productName: String,
            quantity: Number,
            price: Number,
        }
    ],
    total: { type: Number, required: true },
    deliveryDate: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
