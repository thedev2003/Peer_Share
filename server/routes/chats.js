import express from 'express';
import passport from 'passport';
import { getOrCreateChat, getUserChats } from '../controllers/chatController.js';

const router = express.Router();
const authRequired = passport.authenticate('jwt', { session: false });

// Get or create chat for a product between seller and interested buyer
router.get('/product/:productId', authRequired, getOrCreateChat);

// Get all chats for the logged-in user
router.get('/', authRequired, getUserChats);

export default router;
