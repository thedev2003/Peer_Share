import { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
// FIX: Import Heart icon from react-icons
import { FaHeart } from 'react-icons/fa';
// If you also use MessageCircle, import from react-icons
import { FiMessageCircle } from 'react-icons/fi';

// ProductCard component renders a single product with seller actions
export default function ProductCard({ product, onProductRemoved }) {
	// Local state for favorite, queue, chat, and error
	const [isFavorited, setIsFavorited] = useState(false);
	const [joining, setJoining] = useState(false);
	const [joined, setJoined] = useState(false);
	const [error, setError] = useState(null);
	const [showChat, setShowChat] = useState(false);

	// User and token from Redux store
	const { user, token } = useSelector(state => state.auth);

	// Destructure product fields (with defaults for robustness)
	const {
		_id,
		name = 'No Name',
		price = 0,
		category = 'Uncategorized',
		seller = 'Unknown',
		imageUrl = 'https://placehold.co/600x400/cccccc/ffffff?text=No+Image',
		interestedBuyers = []
	} = product;

	// Logic: check if current user is in queue or is the seller
	const isInQueue = user && interestedBuyers.some(buyer => buyer === user._id);
	const isSeller = user && user._id === (seller._id || seller);
	const canChat = isSeller || isInQueue;

	// Handler: Join buyer queue
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

	// Handler: Open chat box for product
	const handleOpenChat = async () => {
		setShowChat(true);
	};

	// Handler: Remove product from sale (seller only)
	const handleRemove = async () => {
		// Confirm action
		if (!window.confirm('Are you sure you want to remove this item from sale?')) return;
		try {
			await axios.delete(`/api/products/${_id}`, {
				headers: { Authorization: `Bearer ${token}` }
			});
			// Notify parent that product was removed
			if (onProductRemoved) onProductRemoved(_id);
		} catch (err) {
			alert(err.response?.data?.message || 'Failed to remove product');
		}
	};

	return (
		<div className="w-full rounded-2xl overflow-hidden group transition-all duration-300 ease-in-out transform hover:scale-105 hover:-translate-y-1">
			{/* Card visual wrapper */}
			<div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-1 shadow-2xl shadow-black/40 h-full flex flex-col">

				{/* Product image at top */}
				<div className="relative rounded-xl overflow-hidden">
					<img
						src={imageUrl}
						alt={name}
						onError={e => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/ef4444/ffffff?text=Image+Error'; }}
						className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
					/>
					{/* Visuals: gradient overlay and favorite button */}
					<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10"></div>
					<button
						onClick={() => setIsFavorited(!isFavorited)}
						className="absolute top-3 right-3 p-2 rounded-full bg-white/20 backdrop-blur-lg transition-colors duration-300 hover:bg-white/30"
						aria-label="Favorite"
					>
						{/* Heart icon from react-icons */}
						<FaHeart className={`w-5 h-5 transition-all ${isFavorited ? 'text-red-500' : 'text-white'}`} />
					</button>
				</div>

				{/* Product info and actions */}
				<div className="p-4 flex-grow flex flex-col">
					{/* Name, price, category */}
					<h3 className="text-lg font-bold text-white mb-1">{name}</h3>
					<div className="text-indigo-300 font-semibold mb-2">₹{price}</div>
					<div className="text-xs text-gray-300 mb-3">{category}</div>

					{/* Error display if any */}
					{error && <div className="text-red-500 text-sm mb-2">{error}</div>}

					{/* Buyer/Seller actions */}
					{!isSeller && !isInQueue && (
						<button
							className="w-full px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
							onClick={handleJoinQueue}
							disabled={joining}
						>
							{joining ? 'Joining...' : 'Join Buyer Queue'}
						</button>
					)}
					{isSeller && (
						<button
							className="mt-2 w-full px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition"
							onClick={handleRemove}
						>
							Remove from Sale
						</button>
					)}
					{canChat && (
						<button
							className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
							onClick={handleOpenChat}
						>
							{/* MessageCircle icon from react-icons */}
							<FiMessageCircle size={18} />
							<span>Open Chat</span>
						</button>
					)}

					{/* Chat modal if open */}
					{showChat && (
						<ChatBox
							chatId={_id}
							product={product}
							onClose={() => setShowChat(false)}
						/>
					)}
				</div>
			</div>
		</div>
	);
}