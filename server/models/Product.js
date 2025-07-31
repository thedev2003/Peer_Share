import mongoose from 'mongoose';
const productSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Product name is required"],
		trim: true,
	},
	description: {
		type: String,
		required: [true, "Product description is required"],
		trim: true,
	},
	price: {
		type: Number,
		required: [true, "Price is required"],
		min: 0,
	},
	category: {
		type: String,
		required: [true, "Category is required"],
		enum: ['Electronics', 'Furniture', 'Vehicles', 'Books', 'Gadgets', 'Sports', 'Other'],
	},
	imageUrl: {
		type: String,
		required: [true, "An image URL is required"],
	},
	seller: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User', // This creates a reference to the User model
		required: true,
	},
	status: {
		type: String,
		enum: ['Available', 'Sold'],
		default: 'Available',
	},
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;