import Chat from '../models/Chat.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

// Create or get chat for a product between seller and interested buyer
export const getOrCreateChat = async (req, res) => {
    const { productId } = req.params;
    const userId = req.user.id;
    try {
        const product = await Product.findById(productId).populate('seller');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        // Only seller or interested buyer can access
        const isSeller = product.seller._id.toString() === userId;
        const isBuyer = product.interestedBuyers.map(id => id.toString()).includes(userId);
        if (!isSeller && !isBuyer) {
            return res.status(403).json({ message: 'Not authorized for chat' });
        }
        // Find existing chat
        let chat = await Chat.findOne({
            participants: { $all: [userId, product.seller._id], $size: 2 },
            product: productId
        });
        if (!chat) {
            chat = new Chat({
                participants: [userId, product.seller._id],
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

// Get all chats for a user (for sidebar/chat list)
export const getUserChats = async (req, res) => {
    try {
        const chats = await Chat.find({ participants: req.user.id }).populate('product').populate('participants', 'username profilePicture');
        res.json(chats);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
