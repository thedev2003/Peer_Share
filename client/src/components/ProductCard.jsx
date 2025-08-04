import { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import ChatBox from './ChatBox';

const API_URL = import.meta.env.VITE_RENDER_URL;

export default function ProductCard({ product, onProductRemoved, updateProductState, removeFromMarketplace }) {
	const [showChat, setShowChat] = useState(null); // buyerId or null
	const [selling, setSelling] = useState(false);
	const [sellError, setSellError] = useState(null);

	const { user, token } = useSelector(state => state.auth);

	const {
		_id,
		name,
		price,
		category,
		seller = {},
		interestedBuyers = [],
		status = 'available', // new field 'status'
		buyer // new field 'buyer'
	} = product;

	const isSeller = user && user._id === (seller._id || seller);

	// --- Seller marks item as sold to buyer ---
	const handleSellToBuyer = async (buyerId) => {
		setSelling(true);
		setSellError(null);
		try {
			const res = await axios.post(`${API_URL}/api/products/${_id}/sell`, { buyerId }, {
				headers: { Authorization: `Bearer ${token}` }
			});
			// Remove from marketplace if sold
			if (removeFromMarketplace) removeFromMarketplace(_id);
			if (updateProductState) updateProductState(_id, res.data.product);
		} catch (err) {
			setSellError(err.response?.data?.message || 'Failed to mark as sold');
		} finally {
			setSelling(false);
		}
	};

	return (
		<div className="w-full max-w-xs rounded-xl shadow-lg bg-gray-800 border border-gray-700 mx-auto my-4">
			{/* ... other product details ... */}
			<div className="p-3">
				{/* Seller panel: Show buyers and sell button */}
				{isSeller && interestedBuyers.length > 0 && status === 'available' && (
					<div>
						<span className="text-xs text-gray-400 mb-1">Interested Buyers:</span>
						{interestedBuyers.map(buyerId => (
							<div key={buyerId} className="flex gap-1 mb-2">
								<button
									className="flex-1 px-2 py-1 rounded bg-violet-700 text-white text-xs font-semibold hover:bg-violet-800"
									onClick={() => setShowChat(buyerId)}
								>
									Chat with Buyer {buyerId}
								</button>
								<button
									className="flex-1 px-2 py-1 rounded bg-green-600 text-white text-xs font-semibold hover:bg-green-700"
									onClick={() => handleSellToBuyer(buyerId)}
									disabled={selling}
								>
									{selling ? 'Marking...' : `Sell to ${buyerId}`}
								</button>
							</div>
						))}
						{sellError && <div className="text-red-500 text-xs">{sellError}</div>}
					</div>
				)}
				{/* Chat Modal */}
				{showChat && (
					<ChatBox
						chatId={_id}
						product={product}
						onClose={() => setShowChat(null)}
						buyerId={showChat}
					/>
				)}
				{/* If sold, show who bought */}
				{status === 'sold' && buyer && (
					<div className="mt-2 text-green-400 font-bold text-xs">
						Sold to: {buyer.username || buyer}
					</div>
				)}
			</div>
		</div>
	);
}