import Chat from '../models/Chat.js';
import User from '../models/User.js';

export default function initializeSocket(io) {
	io.on('connection', (socket) => {
		console.log(`A user connected: ${socket.id}`);

		// --- Join a chat room ---
		// A user joins a room, typically identified by a product ID or a chat ID
		socket.on('joinRoom', async (chatId) => {
			socket.join(chatId);
			console.log(`User ${socket.id} joined room ${chatId}`);

			// Optionally, fetch and emit previous messages
			const chat = await Chat.findById(chatId).populate('messages.sender', 'username profilePicture');
			if (chat) {
				socket.emit('previousMessages', chat.messages);
			}
		});

		// --- Handle sending a message ---
		socket.on('sendMessage', async ({ chatId, senderId, content }) => {
			if (!content || !chatId || !senderId) return;

			try {
				const message = {
					sender: senderId,
					content: content,
					timestamp: new Date(),
				};

				// Find the chat and push the new message
				const chat = await Chat.findByIdAndUpdate(
					chatId,
					{ $push: { messages: message } },
					{ new: true }
				).populate('messages.sender', 'username profilePicture');

				if (chat) {
					// Get the last message to emit (which is the one we just added)
					const newMessage = chat.messages[chat.messages.length - 1];

					// Broadcast the new message to everyone in the room
					io.to(chatId).emit('newMessage', newMessage);
				}
			} catch (error) {
				console.error('Error sending message:', error);
				socket.emit('chatError', 'Failed to send message.');
			}
		});

		// --- Handle user disconnection ---
		socket.on('disconnect', () => {
			console.log(`User disconnected: ${socket.id}`);
		});
	});
}