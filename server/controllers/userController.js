import User from '../models/User.js';
import Product from '../models/Product.js';

// --- Get current user's profile ---
export const getMyProfile = async (req, res) => {
	try {
		// req.user.id is attached by the authRequired middleware
		const user = await User.findById(req.user.id).select('-password');
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}
		res.json(user);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
};

// --- Get all products listed by the current user ---
export const getMyProducts = async (req, res) => {
	try {
		const products = await Product.find({ seller: req.user.id }).sort({ createdAt: -1 });
		res.json(products);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
};