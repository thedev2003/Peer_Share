import { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { FaHeart } from 'react-icons/fa';
import { FiMessageCircle } from 'react-icons/fi';
import ChatBox from './ChatBox'; // Make sure this path is correct

// Renders a single product card with details and actions
export default function ProductCard({ product, onProductRemoved }) {
	// Local UI state
	const [isFavorited, setIsFavorited] = useState(false);
	const [joining, setJoining] = useState(false);
	const [joined, setJoined] = useState(false);
	const [error, setError] = useState(null);
	const [showChat, setShowChat] = useState(false);

	// Redux state for current user
	const { user, token } = useSelector(state => state.auth);

	// Safely destructure product fields with defaults
	const {
		_id,
		name = 'No Name',
		price = 0,
		category = 'Uncategorized',
		seller = {},
		imageUrl = 'https://placehold.co/300x200/cccccc/ffffff?text=No+Image',
		interestedBuyers = []
	} = product;

	// Check if current user is seller or in buyer queue
	const isInQueue = user && interestedBuyers.some(buyer => buyer === user._id);
	const isSeller = user && user._id === (seller._id || seller);
	const canChat = isSeller || isInQueue;

	// Handle "Join Buyer Queue" action
	const handleJoinQueue = async () => {
		setJoining(true);
		setError(null);
		try {
			await axios.post(`/api/products/${_id}/interested`, {}, {
				headers: { Authorization: `Bearer ${token}` }
			});
			setJoined(true);
		} catch (err) {
			setError(err.response?.data?.message || 'Failed to join queue');
		} finally {
			setJoining(false);
		}
	};

	// Handle "Open Chat" action
	const handleOpenChat = () => {
		setShowChat(true);
	};

	// Handle "Remove from Sale" action
	const handleRemove = async () => {
		if (!window.confirm('Are you sure you want to remove this item from sale?')) return;
		try {
			await axios.delete(`/api/products/${_id}`, {
				headers: { Authorization: `Bearer ${token}` }
			});
			if (onProductRemoved) onProductRemoved(_id);
		} catch (err) {
			alert(err.response?.data?.message || 'Failed to remove product');
		}
	};

	return (
		<div className="w-72 rounded-xl overflow-hidden group shadow-lg bg-gray-800 border border-gray-700 mx-2 my-4">
			{/* Product image */}
			<div className="relative h-40">
				<img
					src={imageUrl}
					alt={name}
					onError={e => { e.target.onerror = null; e.target.src = 'https://placehold.co/300x200/ef4444/ffffff?text=Image+Error'; }}
					className="w-full h-full object-cover"
				/>
				<button
					onClick={() => setIsFavorited(!isFavorited)}
					className="absolute top-2 right-2 p-2 rounded-full bg-black/30 hover:bg-black/50"
					aria-label="Favorite"
				>
					<FaHeart className={`w-5 h-5 ${isFavorited ? 'text-red-500' : 'text-white'}`} />
				</button>
			</div>
			{/* Product info */}
			<div className="p-3">
				{/* Product details in one line: name, price, tag */}
				<div className="flex items-center justify-between gap-2 mb-1">
					<span className="font-semibold text-white truncate">{name}</span>
					<span className="text-indigo-400 font-bold text-sm">₹{price}</span>
					<span className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded">{category}</span>
				</div>
				{/* Seller name on second line */}
				<div className="mb-2 text-xs text-gray-400">
					Seller: {seller.username ? seller.username : typeof seller === 'string' ? seller : 'Unknown'}
				</div>
				{/* Error message if any */}
				{error && <div className="text-red-500 text-xs mb-2">{error}</div>}
				{/* Action buttons spaced horizontally on third row */}
				<div className="flex gap-2 justify-between mt-2">
					{isSeller && (
						<button
							className="flex-1 px-2 py-2 rounded bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
							onClick={handleRemove}
						>
							Remove from Sale
						</button>
					)}
					{!isSeller && !isInQueue && (
						<button
							className="flex-1 px-2 py-2 rounded bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700"
							onClick={handleJoinQueue}
							disabled={joining}
						>
							{joining ? 'Joining...' : 'Join Buyer Queue'}
						</button>
					)}
					{canChat && (
						<button
							className="flex-1 px-2 py-2 rounded bg-violet-700 text-white text-sm font-semibold flex items-center justify-center gap-1 hover:bg-violet-800"
							onClick={handleOpenChat}
						>
							<FiMessageCircle size={16} /> Open Chat
						</button>
					)}
				</div>
				{/* Chat modal */}
				{showChat && (
					<ChatBox
						chatId={_id}
						product={product}
						onClose={() => setShowChat(false)}
					/>
				)}
			</div>
		</div>
	);
}