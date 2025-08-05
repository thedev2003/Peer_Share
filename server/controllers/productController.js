import Product from '../models/Product.js';
import User from '../models/User.js';

// Get all products
export const getAllProducts = async (req, res) => {
	try {
		const products = await Product.find().populate('seller', 'username email');
		res.json(products);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
};

// Get a single product
export const getProductById = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id).populate('seller', 'username email');
		if (!product) return res.status(404).json({ message: 'Product not found' });
		res.json(product);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
};

// Create a new product
export const createProduct = async (req, res) => {
	const { name, description, price, category } = req.body;
	if (!req.file) {
		return res.status(400).json({ message: 'Product image is required.' });
	}
	if (!name || !description || !price || !category) {
		return res.status(400).json({ message: 'All fields are required.' });
	}
	try {
		const newProduct = new Product({
			name,
			description,
			price,
			category,
			imageUrl: req.file.path,
			seller: req.user.id,
			status: 'Available'
		});
		const product = await newProduct.save();
		res.status(201).json(product);
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ message: 'Server Error' });
	}
};

// Update product fields
export const updateProduct = async (req, res) => {
	const { name, description, price, category, status } = req.body;
	try {
		let product = await Product.findById(req.params.id);
		if (!product) return res.status(404).json({ message: 'Product not found' });
		if (product.seller.toString() !== req.user.id) {
			return res.status(401).json({ message: 'User not authorized' });
		}
		const productFields = { name, description, price, category, status };
		Object.keys(productFields).forEach(key => productFields[key] === undefined && delete productFields[key]);
		product = await Product.findByIdAndUpdate(req.params.id, { $set: productFields }, { new: true });
		res.json(product);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
};

export const joinBuyerQueue = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (!product) return res.status(404).json({ message: 'Product not found' });
		if (product.interestedBuyers.map(id => String(id)).includes(String(req.user._id))) {
			return res.status(400).json({ message: 'Already in queue' });
		}
		product.interestedBuyers.push(req.user._id);
		await product.save();
		res.json({ product });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Server Error' });
	}
};

// Leave buyer queue
export const leaveBuyerQueue = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (!product) return res.status(404).json({ message: 'Product not found' });
		const before = product.interestedBuyers.length;
		product.interestedBuyers = product.interestedBuyers.filter(
			id => String(id) !== String(req.user._id)
		);
		if (product.interestedBuyers.length === before) {
			return res.status(400).json({ message: 'You are not in queue' });
		}
		await product.save();
		res.json({ product });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Server Error' });
	}
};

// Remove product from sale
export const removeProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (!product) return res.status(404).json({ message: 'Product not found' });
		if (product.seller.toString() !== req.user.id) {
			return res.status(401).json({ message: 'User not authorized' });
		}
		await Product.deleteOne({ _id: req.params.id });
		res.json({ message: 'Product removed from sale' });
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
};

// Mark item as sold to a buyer
export const sellProductToBuyer = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		const { buyerId } = req.body;
		if (!product) return res.status(404).json({ message: 'Product not found' });
		if (product.seller.toString() !== req.user.id) {
			return res.status(401).json({ message: 'User not authorized' });
		}
		if (!product.interestedBuyers.map(id => id.toString()).includes(buyerId)) {
			return res.status(400).json({ message: 'Buyer must be in interested queue' });
		}
		product.status = 'Sold';
		product.buyer = buyerId;
		product.interestedBuyers = [];
		await product.save();
		res.json({ product });
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
};