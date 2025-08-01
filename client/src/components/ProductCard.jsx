import { useState } from 'react';
import { Heart, MessageCircle, Tag, Package, Users } from 'lucide-react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import ChatBox from './ChatBox';

function ProductCard({ product }) {
	const [isFavorited, setIsFavorited] = useState(false);
	const [joining, setJoining] = useState(false);
	const [joined, setJoined] = useState(false);
	const [error, setError] = useState(null);
	const [showChat, setShowChat] = useState(false);
	const { user, token } = useSelector(state => state.auth);
	const {
		_id,
		name = 'No Name',
		price = 0,
		category = 'Uncategorized',
		seller = 'Unknown',
		imageUrl = 'https://placehold.co/600x400/cccccc/ffffff?text=No+Image',
		interestedBuyers = []
	} = product;

	// Check if current user is already in queue
	const isInQueue = user && interestedBuyers.some(buyer => buyer === user._id);
	const isSeller = user && user._id === (seller._id || seller);
	const canChat = isSeller || isInQueue;

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

	const handleOpenChat = async () => {
		setShowChat(true);
	};

	return (
		<div className="w-full rounded-2xl overflow-hidden group transition-all duration-300 ease-in-out transform hover:scale-105 hover:-translate-y-1">
			<div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-1 shadow-2xl shadow-black/40 h-full flex flex-col">
				<div className="relative rounded-xl overflow-hidden">
					<img
						src={imageUrl}
						alt={name}
						onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/ef4444/ffffff?text=Image+Error'; }}
						className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10"></div>
					<button
						onClick={() => setIsFavorited(!isFavorited)}
						className="absolute top-3 right-3 p-2 rounded-full bg-white/20 backdrop-blur-lg transition-colors duration-300 hover:bg-white/30"
						aria-label="Favorite"
					>
						<Heart className={`w-5 h-5 transition-all ${isFavorited ? 'text-red-500 fill-current' : 'text-white'}`} />
					</button>
				</div>
				<div className="p-4 flex-grow flex flex-col">
					<p className="text-xs font-semibold text-indigo-300 uppercase tracking-wider flex items-center gap-1"><Package size={14} /> {category}</p>
					<h3 className="text-xl font-bold truncate mt-1 flex-grow">{name}</h3>
					<div className="mt-2 flex justify-between items-center">
						<p className="text-sm text-gray-400">Seller: <span className="font-semibold text-gray-200">{seller.username || seller}</span></p>
						<p className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-400">
							<Tag size={16} className="inline-block mr-1" />₹{price.toLocaleString('en-IN')}
						</p>
					</div>
					<div className="mt-4 pt-4 border-t border-white/20 flex flex-col gap-2">
						{error && <div className="text-red-500 text-sm mb-2">{error}</div>}
						{user && user._id !== (seller._id || seller) ? (
							<button
								className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${isInQueue || joined ? 'bg-green-500/70 text-white cursor-not-allowed' : 'bg-indigo-500/50 text-white hover:bg-indigo-500/80 hover:shadow-lg hover:shadow-indigo-500/30'}`}
								onClick={handleJoinQueue}
								disabled={isInQueue || joined || joining}
							>
								<Users size={18} />
								<span>{isInQueue || joined ? 'In Buyer Queue' : joining ? 'Joining...' : "I'm Interested"}</span>
							</button>
						) : (
							<button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-400/50 text-white font-semibold cursor-not-allowed" disabled>
								<MessageCircle size={18} />
								<span>Seller</span>
							</button>
						)}
						{canChat && (
							<button
								className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
								onClick={handleOpenChat}
							>
								<MessageCircle size={18} />
								<span>Open Chat</span>
							</button>
						)}
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
		</div>
	);
}
export default ProductCard;