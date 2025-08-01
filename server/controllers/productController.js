import Product from '../models/Product.js';
import mongoose from 'mongoose';

// --- Get All Products ---
export const getAllProducts = async (req, res) => {
	try {
		const products = await Product.find({ status: 'Available' })
			.populate('seller', 'username profilePicture')
			.sort({ createdAt: -1 });
		res.json(products);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
};

// --- Get a Single Product by ID ---
export const getProductById = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id).populate('seller', 'username email profilePicture');
		if (!product) {
			return res.status(404).json({ message: 'Product not found' });
		}
		res.json(product);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
};

// --- Create a new Product ---
export const createProduct = async (req, res) => {
	const { name, description, price, category } = req.body;

	if (!req.file) {
		return res.status(400).json({ message: 'Product image is required.' });
	}

	try {
		const newProduct = new Product({
			name,
			description,
			price,
			category,
			imageUrl: req.file.path, // URL from Cloudinary
			seller: req.user.id
		});
		const product = await newProduct.save();
		res.status(201).json(product);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
};

// --- Update a Product ---
export const updateProduct = async (req, res) => {
	const { name, description, price, category, status } = req.body;
	try {
		let product = await Product.findById(req.params.id);
		if (!product) {
			return res.status(404).json({ message: 'Product not found' });
		}
		// Check if the logged-in user is the seller
		if (product.seller.toString() !== req.user.id) {
			return res.status(401).json({ message: 'User not authorized' });
		}
		// Build product object
		const productFields = { name, description, price, category, status };
		// Remove undefined fields
		Object.keys(productFields).forEach(key => productFields[key] === undefined && delete productFields[key]);
		product = await Product.findByIdAndUpdate(
			req.params.id,
			{ $set: productFields },
			{ new: true }
		);
		res.json(product);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
};

// --- Add user to interestedBuyers queue ---
export const joinBuyerQueue = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (!product) {
			return res.status(404).json({ message: 'Product not found' });
		}
		// Prevent duplicate entries
		if (product.interestedBuyers.map(id => id.toString()).includes(req.user.id)) {
			return res.status(400).json({ message: 'Already in queue' });
		}
		product.interestedBuyers.push(req.user.id);
		await product.save();
		res.json({ message: 'Added to buyer queue', product });
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
};

// --- Delete a Product ---
export const deleteProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (!product) {
			return res.status(404).json({ message: 'Product not found' });
		}

		// Check if the logged-in user is the seller
		if (product.seller.toString() !== req.user.id) {
			return res.status(401).json({ message: 'User not authorized' });
		}

		await product.remove();
		// Here you could also add logic to delete the image from Cloudinary
		res.json({ message: 'Product removed' });
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
};
