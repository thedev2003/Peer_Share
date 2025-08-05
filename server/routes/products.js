import express from 'express';
import passport from 'passport';
import {
	getAllProducts,
	getProductById,
	createProduct,
	updateProduct,
	deleteProduct,
	joinBuyerQueue,
	leaveBuyerQueue,
	sellProductToBuyer,
	removeProduct
} from '../controllers/productController.js';
import { parser } from '../config/cloudinary.js'; // Import the multer parser
import noCache from '../middleware/cacheControl.js'; // Import the cache control middleware

const router = express.Router();
const authRequired = passport.authenticate('jwt', { session: false });

// --- Protected Routes ---
// Apply no-cache middleware and authentication to all protected routes
router.get('/', authRequired, noCache, getAllProducts);
router.get('/:id', authRequired, noCache, getProductById);
router.post('/', authRequired, noCache, parser.single('image'), createProduct);

// Buyer queue routes
router.post('/:id/join-queue', authRequired, noCache, joinBuyerQueue);
router.post('/:id/leave-queue', authRequired, noCache, leaveBuyerQueue);

// Seller marks item as sold
router.post('/:id/sell', authRequired, noCache, sellProductToBuyer);

// Remove product from sale
router.delete('/:id', authRequired, noCache, removeProduct);

// Update product
router.put('/:id', authRequired, noCache, updateProduct);

export default router;