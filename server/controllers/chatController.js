import Chat from '../models/Chat.js';
import Product from '../models/Product.js';

// Create or get chat between seller and buyer for product
export const getOrCreateChat = async (req, res) => {
	const { productId, participantId } = req.params;
	const userId = req.user.id;
	
	try {
		const product = await Product.findById(productId).populate('seller');
		if (!product) return res.status(404).json({ message: 'Product not found' });
		
		// Only seller or interested buyer can access
		const isSeller = product.seller._id.toString() === userId;
		
		const isBuyer = product.interestedBuyers.map(id => id.toString()).includes(userId) || (product.buyer && product.buyer.toString() === userId);
		
		if (!isSeller && !isBuyer) return res.status(403).json({ message: 'Not authorized for chat' });

		// Find or create chat
		let chat = await Chat.findOne({
			participants: { $all: [userId, participantId], $size: 2 },
			product: productId
		});
		if (!chat) {
			chat = new Chat({
				participants: [userId, participantId],
				product: productId,
				messages: []
			});
			await chat.save();
		}
		res.json(chat);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
};

// Send a chat message
export const sendMessage = async (req, res) => {
    const { chatId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;
    try {
        let chat = await Chat.findById(chatId);
        if (!chat) return res.status(404).json({ message: 'Chat not found' });
        chat.messages.push({ sender: userId, content, timestamp: new Date() });
        await chat.save();
        res.json(chat);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get all messages for a specific chat
export const getMessagesForChat = async (req, res) => {
	const { chatId } = req.params;
	try {
		const chat = await Chat.findById(chatId).populate('messages.sender', 'username profilePicture');
		if (!chat) return res.status(404).json({ message: 'Chat not found' });
		res.json(chat.messages || []);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
};

// Get all chats for the currently logged-in user
export const getUserChats = async (req, res) => {
	const userId = req.user.id;
	try {
		// Find all chats where the user is a participant
		const chats = await Chat.find({
			participants: userId
		}).populate('participants', 'username profilePicture').populate('product');
		res.json(chats);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
};