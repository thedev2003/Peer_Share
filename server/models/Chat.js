import mongoose from 'mongoose';
const chatSchema = new mongoose.Schema({
	participants: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	}],
	messages: [{
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		content: {
			type: String,
			trim: true,
		},
		timestamp: {
			type: Date,
			default: Date.now,
		},
	}],
}, { timestamps: true });

const Chat = mongoose.model('Chat', chatSchema);
export default Chat;