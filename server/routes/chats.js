import express from 'express';
import passport from 'passport';
import { getOrCreateChat, getUserChats, sendMessage } from '../controllers/chatController.js';

const router = express.Router();
const authRequired = passport.authenticate('jwt', { session: false });

// Get or create chat for a product between seller and a participant (buyer/seller)
router.get('/product/:productId/:participantId', authRequired, getOrCreateChat);

// Send message in a chat between seller and a participant
router.post('/product/:productId/:participantId/message', authRequired, sendMessage);

// Get all chats for the logged-in user (shows all active chats for user)
router.get('/', authRequired, getUserChats);

export default router;