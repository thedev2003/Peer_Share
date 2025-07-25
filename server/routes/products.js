import express from 'express';
const router = express.Router();

// @route   GET /api/products
// @desc    A test route to get mock products
router.get('/', (req, res) => {
	// This mock data will eventually come from your MongoDB database
	const mockProducts = [
		{ id: 1, name: 'Hercules Roadeo Bicycle', price: 4500 },
		{ id: 2, name: 'Usha Air Cooler', price: 3200 },
	];
	res.json(mockProducts);
});

export default router;