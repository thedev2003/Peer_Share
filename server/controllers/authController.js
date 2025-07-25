import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// --- Generate JWT Token ---
const generateToken = (user) => {
	const payload = { id: user.id, username: user.username };
	return jwt.sign(
		payload,
		process.env.JWT_SECRET,
		{ expiresIn: '5h' }
	);
};

// --- Register User with Email/Password ---
export const registerUser = async (req, res) => {
	const { username, email, password } = req.body;
	try {
		let user = await User.findOne({ email });
		if (user) {
			return res.status(400).json({ message: 'User already exists' });
		}
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);
		user = new User({ username, email, password: hashedPassword });
		await user.save();
		const token = generateToken(user);
		res.status(201).json({ token });
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
};

// --- Login User with Email/Password ---
export const loginUser = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user || !user.password) { // Check for user and if they have a password (not a Google user)
			return res.status(400).json({ message: 'Invalid credentials or sign in with Google' });
		}
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({ message: 'Invalid credentials' });
		}
		const token = generateToken(user);
		res.json({ token });
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
};

// --- Logout User ---
export const logoutUser = (req, res) => {
	res.status(200).json({ message: 'Logout successful' });
};
