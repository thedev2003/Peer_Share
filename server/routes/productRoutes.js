import express from 'express';
import {
	getAllProducts,
	getProductById,
	createProduct,
	updateProduct,
	joinBuyerQueue,
	leaveBuyerQueue,
	removeProduct,
	sellProductToBuyer
} from '../controllers/productController.js';
import { authRequired } from '../middleware/authMiddleware.js';
import { parser } from '../config/cloudinary.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', authRequired, parser.single('image'), createProduct);
router.put('/:id', authRequired, updateProduct);

router.post('/:id/join-queue', authRequired, joinBuyerQueue);
router.post('/:id/leave-queue', authRequired, leaveBuyerQueue);
router.delete('/:id', authRequired, removeProduct);
router.post('/:id/sell', authRequired, sellProductToBuyer);

export default router;