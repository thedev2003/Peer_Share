import Product from '../models/Product.js';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

// --- Get All Products ---
// Returns all products in "Available" status, sorted by creation date
export const getAllProducts = async (req, res) => {
	try {
		const products = await Product.find({ status: 'Available' })
			.populate('seller', 'username profilePicture')
			.sort({ createdAt: -1 });
		res.json(products);
	} catch (err) {
		console.error(err.message); // Log server error
		res.status(500).send('Server Error');
	}
};

// --- Get a Single Product by ID ---
// Returns product details for a given product id
export const getProductById = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id).populate('seller', 'username email profilePicture');
		if (!product) {
			return res.status(404).json({ message: 'Product not found' });
		}
		res.json(product);
	} catch (err) {
		console.error(err.message); // Log server error
		res.status(500).send('Server Error');
	}
};

// --- Create a new Product ---
// Adds a new product to the database and Cloudinary
export const createProduct = async (req, res) => {
	const { name, description, price, category } = req.body;

	// Validate image upload
	if (!req.file) {
		return res.status(400).json({ message: 'Product image is required.' });
	}

	// Validate required fields
	if (!name || !description || !price || !category) {
		return res.status(400).json({ message: 'All fields are required.' });
	}

	try {
		// Create new product object with image from Cloudinary
		const newProduct = new Product({
			name,
			description,
			price,
			category,
			imageUrl: req.file.path, // Cloudinary image URL
			seller: req.user.id,
			status: 'Available'
		});
		const product = await newProduct.save();
		res.status(201).json(product);
	} catch (err) {
		console.error(err.message); // Log server error
		res.status(500).json({ message: 'Server Error' });
	}
};

// --- Update a Product ---
// Updates product fields if the user is the seller
export const updateProduct = async (req, res) => {
	const { name, description, price, category, status } = req.body;
	try {
		let product = await Product.findById(req.params.id);
		if (!product) {
			return res.status(404).json({ message: 'Product not found' });
		}
		// Only allow product owner to update
		if (product.seller.toString() !== req.user.id) {
			return res.status(401).json({ message: 'User not authorized' });
		}
		// Build updated fields
		const productFields = { name, description, price, category, status };
		Object.keys(productFields).forEach(key => productFields[key] === undefined && delete productFields[key]);
		product = await Product.findByIdAndUpdate(
			req.params.id,
			{ $set: productFields },
			{ new: true }
		);
		res.json(product);
	} catch (err) {
		console.error(err.message); // Log server error
		res.status(500).send('Server Error');
	}
};

// --- Add user to interestedBuyers queue ---
// Allows authenticated user to join buyer queue for a product
export const joinBuyerQueue = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (!product) {
			return res.status(404).json({ message: 'Product not found' });
		}
		// Prevent duplicate queue join
		if (product.interestedBuyers.map(id => id.toString()).includes(req.user.id)) {
			return res.status(400).json({ message: 'Already in queue' });
		}
		product.interestedBuyers.push(req.user.id);
		await product.save();
		res.json({ message: 'Added to buyer queue', product });
	} catch (err) {
		console.error(err.message); // Log server error
		res.status(500).send('Server Error');
	}
};

// --- Delete a Product ---
// Deletes product from MongoDB and Cloudinary if seller requests
export const deleteProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (!product) {
			return res.status(404).json({ message: 'Product not found' });
		}
		// Only allow product owner to delete
		if (product.seller.toString() !== req.user.id) {
			return res.status(401).json({ message: 'User not authorized' });
		}

		// Extract public_id from Cloudinary URL and delete image
		const imageUrl = product.imageUrl;
		const publicIdMatch = imageUrl.match(/\/([^\/]+)\.[a-z]+$/); // get 'public_id' from Cloudinary URL
		if (publicIdMatch) {
			await cloudinary.uploader.destroy(`HostelMarketplace/${publicIdMatch[1]}`);
		}

		await product.remove();
		res.json({ message: 'Product removed' });
	} catch (err) {
		console.error(err.message); // Log server error
		res.status(500).send('Server Error');
	}
};