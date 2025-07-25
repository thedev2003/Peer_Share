import express from 'express';
import passport from 'passport';
import { getMyProfile, getMyProducts } from '../controllers/userController.js';

const router = express.Router();
const authRequired = passport.authenticate('jwt', { session: false });

// @route   GET /api/users/me
// @desc    Get current user's profile
router.get('/me', authRequired, getMyProfile);

// @route   GET /api/users/my-products
// @desc    Get all products listed by current user
router.get('/my-products', authRequired, getMyProducts);

export default router;