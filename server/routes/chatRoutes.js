import express from 'express';
import { getOrCreateChat, sendMessage } from '../controllers/chatController.js';
import { authRequired } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:productId/:participantId', authRequired, getOrCreateChat);
router.post('/:productId/:participantId/message', authRequired, sendMessage);

export default router;