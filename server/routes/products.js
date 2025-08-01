import express from 'express';
import passport from 'passport';
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { parser } from '../config/cloudinary.js'; // Import the multer parser

import noCache from '../middleware/cacheControl.js'; // Import the cache control middleware

const router = express.Router();
const authRequired = passport.authenticate('jwt', { session: false });

// --- Public Routes ---
// Apply no-cache middleware to prevent caching of product data
router.get('/', noCache, getAllProducts);
router.get('/:id', noCache, getProductById); 

// --- Protected Routes ---
router.post('/', authRequired, parser.single('image'), createProduct);
router.put('/:id', authRequired, updateProduct);
router.delete('/:id', authRequired, deleteProduct);

export default router;