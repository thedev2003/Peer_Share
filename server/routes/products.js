import express from 'express';
import passport from 'passport';
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { parser } from '../config/cloudinary.js'; // Import the multer parser

const router = express.Router();
const authRequired = passport.authenticate('jwt', { session: false });

// --- Public Routes ---
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// --- Protected Routes ---
router.post('/', authRequired, parser.single('image'), createProduct);
router.put('/:id', authRequired, updateProduct);
router.delete('/:id', authRequired, deleteProduct);

export default router;