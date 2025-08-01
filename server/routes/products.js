import express from 'express';
import passport from 'passport';
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, joinBuyerQueue } from '../controllers/productController.js';
import { parser } from '../config/cloudinary.js'; // Import the multer parser

import noCache from '../middleware/cacheControl.js'; // Import the cache control middleware

const router = express.Router();
const authRequired = passport.authenticate('jwt', { session: false });

// --- Public Routes ---
// No public routes for products, all require authentication.

// --- Protected Routes ---
// Apply no-cache middleware and authentication to all protected routes
router.get('/', authRequired, noCache, getAllProducts);
router.get('/:id', authRequired, noCache, getProductById);
router.post('/', authRequired, noCache, parser.single('image'), createProduct);

// Buyer queue route
router.post('/:id/interested', authRequired, noCache, joinBuyerQueue);

router.put('/:id', authRequired, noCache, updateProduct);
router.delete('/:id', authRequired, noCache, deleteProduct);

export default router;