import express from 'express';
import {
	getOrCreateChat,
	sendMessage,
	getUserChats,
	getMessagesForChat
} from '../controllers/chatController.js';
import { authRequired } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all chats for the currently logged-in user
router.get('/', authRequired, getUserChats);

// Get or create a specific chat with another user for a product
router.get('/product/:productId/:participantId', authRequired, getOrCreateChat);

// Get all messages for a specific chat
router.get('/:chatId/messages', authRequired, getMessagesForChat);

// Send a new message in a specific chat
router.post('/:chatId/messages', authRequired, sendMessage);

export default router;