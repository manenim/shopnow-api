import mongoose from 'mongoose'

const CartSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: false,
        unique: true,
    },
    products: [
        {
            productId: {
                type: String,
                required: true,
            },
            quantity: {
                type: Number,
                default: 1,
            },
        }
    ]
}, {
    timestamps: true,
});

export default mongoose.model('Cart', CartSchema);   