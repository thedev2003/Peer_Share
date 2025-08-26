// import { useState } from 'react';
// import { useSelector } from 'react-redux';
// import axios from 'axios';
// import ChatBox from './ChatBox';

// const API_URL = import.meta.env.VITE_RENDER_URL || window.location.origin;

// export default function ProductCard({
// 	product,
// 	onProductRemoved,
// 	updateProductState,
// 	removeFromMarketplace,
// }) {
// 	const [showChat, setShowChat] = useState(null);
// 	const [leaveQueueLoading, setLeaveQueueLoading] = useState(false);
// 	const [joinQueueLoading, setJoinQueueLoading] = useState(false);
// 	const [actionError, setActionError] = useState(null);

// 	const { user, token } = useSelector((state) => state.auth);

// 	const {
// 		_id,
// 		name,
// 		price,
// 		category,
// 		imageUrl,
// 		seller = {},
// 		interestedBuyers = [],
// 		status = 'Available',
// 		buyer,
// 	} = product;

// 	const statusLower = typeof status === 'string' ? status.toLowerCase() : status;
// 	const userId = user?._id;
// 	const sellerId = seller._id || seller;
// 	const isSeller = userId === sellerId;
// 	const isInQueue = interestedBuyers.map(String).includes(String(userId));

// 	// Join buyer queue
// 	const handleJoinQueue = async () => {
// 		setJoinQueueLoading(true);
// 		setActionError(null);
// 		try {
// 			const res = await axios.post(
// 				`${API_URL.replace(/\/$/, '')}/api/products/${_id}/join-queue`,
// 				{},
// 				{ headers: { Authorization: `Bearer ${token}` } }
// 			);
// 			if (updateProductState) updateProductState(_id, res.data.product);
// 			setShowChat(null); // Hide chat until re-joined
// 		} catch (err) {
// 			setActionError(err.response?.data?.message || 'Failed to join queue');
// 		} finally {
// 			setJoinQueueLoading(false);
// 		}
// 	};

// 	// Leave buyer queue
// 	const handleLeaveQueue = async () => {
// 		setLeaveQueueLoading(true);
// 		setActionError(null);
// 		try {
// 			const res = await axios.post(
// 				`${API_URL.replace(/\/$/, '')}/api/products/${_id}/leave-queue`,
// 				{},
// 				{ headers: { Authorization: `Bearer ${token}` } }
// 			);
// 			if (updateProductState) updateProductState(_id, res.data.product);
// 			setShowChat(null); // Remove chat UI for buyer after leaving queue
// 		} catch (err) {
// 			setActionError(err.response?.data?.message || 'Failed to leave queue');
// 		} finally {
// 			setLeaveQueueLoading(false);
// 		}
// 	};

// 	// Seller marks item as sold to buyer (unchanged)
// 	const handleSellToBuyer = async (buyerId) => {
// 		// ... existing code ...
// 	};

// 	// Seller removes product from sale (unchanged)
// 	const handleRemoveFromSale = async () => {
// 		// ... existing code ...
// 	};

// 	// Open chat modal
// 	const handleOpenChat = (chatTargetId) => setShowChat(chatTargetId);

// 	return (
// 		<div className="w-full max-w-[320px] min-w-[260px] rounded-xl shadow-lg bg-gray-800 border border-gray-700 mx-auto my-4 flex flex-col"
// 			style={{ flex: '1 1 0', margin: '8px' }}
// 		>
// 			{imageUrl && (
// 				<img src={imageUrl} alt={name} className="w-full h-36 object-cover rounded-t-xl" />
// 			)}
// 			<div className="p-3 flex flex-col flex-1 justify-between">
// 				<div>
// 					{/* Name and Price in flex-between */}
// 					<div className="flex justify-between items-center mb-1">
// 						<h2 className="text-lg font-semibold text-indigo-300">{name}</h2>
// 						<span className="text-base font-bold text-gray-300">₹{price}</span>
// 					</div>
// 					{/* Category in smaller font, no "Category:" label */}
// 					<div className="text-xs text-gray-400 mb-1">{category}</div>
// 					<p className="mb-2 text-xs text-gray-400">
// 						Seller: {seller.username || seller.email || 'Unknown'}
// 					</p>
// 				</div>

// 				{statusLower === 'available' && (
// 					<>
// 						{isSeller ? (
// 							<div className="flex flex-col gap-2 mt-2">
// 								<button
// 									className="px-2 py-1 rounded bg-red-600 text-white text-xs font-semibold hover:bg-red-700"
// 									onClick={handleRemoveFromSale}
// 									disabled={false}
// 								>
// 									Remove from Sale
// 								</button>
// 								{interestedBuyers.length > 0 && (
// 									<div className="mt-2">
// 										<span className="text-xs text-gray-400 mb-1 block">Interested Buyers:</span>
// 										{interestedBuyers.map((buyerId) => (
// 											<div key={buyerId} className="flex gap-1 mb-2">
// 												<button
// 													className="flex-1 px-2 py-1 rounded bg-violet-700 text-white text-xs font-semibold hover:bg-violet-800"
// 													onClick={() => handleOpenChat(buyerId)}
// 												>
// 													Chat with {buyerId}
// 												</button>
// 												<button
// 													className="flex-1 px-2 py-1 rounded bg-green-600 text-white text-xs font-semibold hover:bg-green-700"
// 													onClick={() => handleSellToBuyer(buyerId)}
// 													disabled={false}
// 												>
// 													Sell to {buyerId}
// 												</button>
// 											</div>
// 										))}
// 									</div>
// 								)}
// 							</div>
// 						) : (
// 							<div className="flex flex-col gap-2 mt-2">
// 								{!isInQueue ? (
// 									<button
// 										className="px-2 py-1 rounded bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
// 										onClick={handleJoinQueue}
// 										disabled={joinQueueLoading}
// 									>
// 										{joinQueueLoading ? 'Joining...' : 'Enter Buyer Queue'}
// 									</button>
// 								) : (
// 									<>
// 										<button
// 											className="px-2 py-1 rounded bg-gray-600 text-white text-xs font-semibold hover:bg-gray-700"
// 											onClick={handleLeaveQueue}
// 											disabled={leaveQueueLoading}
// 										>
// 											{leaveQueueLoading ? 'Leaving...' : 'Leave Buyer Queue'}
// 										</button>
// 										<button
// 											className="px-2 py-1 rounded bg-violet-700 text-white text-xs font-semibold hover:bg-violet-800"
// 											onClick={() => handleOpenChat(sellerId)}
// 										>
// 											Chat with Seller
// 										</button>
// 									</>
// 								)}
// 							</div>
// 						)}
// 					</>
// 				)}

// 				{statusLower === 'sold' && buyer && (
// 					<div className="mt-2 text-green-400 font-bold text-xs">
// 						Sold to: {buyer.username || buyer}
// 					</div>
// 				)}

// 				{actionError && <div className="text-red-500 text-xs mt-2">{actionError}</div>}

// 				{/* Only show chat if user is in queue or is seller */}
// 				{showChat &&
// 					((isSeller || isInQueue) && (
// 						<ChatBox
// 							chatId={_id}
// 							product={product}
// 							onClose={() => setShowChat(null)}
// 							participantId={showChat}
// 							isSeller={isSeller}
// 						/>
// 					))}
// 			</div>
// 		</div>
// 	);
// };




import { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import ChatBox from './ChatBox';

const ProductCard = ({ product, updateProductState }) => {
	const [showChat, setShowChat] = useState(null);
	const [leaveQueueLoading, setLeaveQueueLoading] = useState(false);
	const [joinQueueLoading, setJoinQueueLoading] = useState(false);
	const [actionError, setActionError] = useState(null);

	const { user, token } = useSelector((state) => state.auth);

	const {
		_id,
		name,
		price,
		category,
		imageUrl,
		seller = {},
		interestedBuyers = [],
		status = 'Available',
		buyer,
	} = product;

	const statusLower = typeof status === 'string' ? status.toLowerCase() : status;
	const userId = user?._id;
	const sellerId = seller._id || seller;
	const isSeller = userId === sellerId;
	const isInQueue = interestedBuyers.map(String).includes(String(userId));

	// Join buyer queue
	const handleJoinQueue = async () => {
		setJoinQueueLoading(true);
		setActionError(null);
		try {
			const res = await axios.post(
				`${API_URL.replace(/\/$/, '')}/api/products/${_id}/join-queue`,
				{},
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			if (updateProductState) updateProductState(_id, res.data.product);
			setShowChat(null);
		} catch (err) {
			setActionError(err.response?.data?.message || 'Failed to join queue');
		} finally {
			setJoinQueueLoading(false);
		}
	};

	// Leave buyer queue
	const handleLeaveQueue = async () => {
		setLeaveQueueLoading(true);
		setActionError(null);
		try {
			const res = await axios.post(
				`${API_URL.replace(/\/$/, '')}/api/products/${_id}/leave-queue`,
				{},
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			if (updateProductState) updateProductState(_id, res.data.product);
			setShowChat(null);
		} catch (err) {
			setActionError(err.response?.data?.message || 'Failed to leave queue');
		} finally {
			setLeaveQueueLoading(false);
		}
	};

	// Seller marks item as sold to buyer
	const handleSellToBuyer = async (buyerId) => {
		setActionError(null);
		try {
			const res = await axios.post(
				`${API_URL.replace(/\/$/, '')}/api/products/${_id}/sell`,
				{ buyerId },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			if (updateProductState) updateProductState(_id, res.data.product);
		} catch (err) {
			setActionError(err.response?.data?.message || 'Failed to sell item');
		}
	};

	// Seller removes product from sale
	const handleRemoveFromSale = async () => {
		setActionError(null);
		try {
			const res = await axios.delete(
				`${API_URL.replace(/\/$/, '')}/api/products/${_id}`,
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			if (updateProductState) updateProductState(_id, null);
		} catch (err) {
			setActionError(err.response?.data?.message || 'Failed to remove item from sale');
		}
	};

	// Open chat modal
	const handleOpenChat = (chatTargetId) => setShowChat(chatTargetId);

	return (
		<div className="w-full max-w-[320px] min-w-[260px] rounded-xl shadow-lg bg-gray-800 border border-gray-700 mx-auto my-4 flex flex-col">
			{/* Product image */}
			<div className="relative block w-full h-[200px] overflow-hidden rounded-t-xl">
				<img
					src={imageUrl || '/placeholder.jpg'}
					alt={name}
					className="absolute inset-0 h-full w-full object-cover"
				/>
			</div>

			<div className="flex flex-col p-4">
				{/* Product details */}
				<h2 className="text-lg font-semibold text-white">{name}</h2>
				<p className="text-sm text-gray-400">{category}</p>
				<p className="text-sm text-gray-400">Seller: {seller.username || seller}</p>
				<p className="text-lg font-bold text-indigo-400">₹{price}</p>

				{/* Action buttons */}
				{statusLower === 'available' && (
					<>
						{isSeller ? (
							<div className="flex flex-col gap-2 mt-2">
								<button
									className="px-2 py-1 rounded bg-red-600 text-white text-xs font-semibold hover:bg-red-700"
									onClick={handleRemoveFromSale}
								>
									Remove from Sale
								</button>
								{interestedBuyers.length > 0 && (
									<div className="mt-2">
										<span className="text-xs text-gray-400 mb-1 block">Interested Buyers:</span>
										{interestedBuyers.map((buyerId) => (
											<div key={buyerId} className="flex gap-1 mb-2">
												<button
													className="flex-1 px-2 py-1 rounded bg-violet-700 text-white text-xs font-semibold hover:bg-violet-800"
													onClick={() => handleOpenChat(buyerId)}
												>
													Chat with {buyerId}
												</button>
												<button
													className="flex-1 px-2 py-1 rounded bg-green-600 text-white text-xs font-semibold hover:bg-green-700"
													onClick={() => handleSellToBuyer(buyerId)}
												>
													Sell to {buyerId}
												</button>
											</div>
										))}
									</div>
								)}
							</div>
						) : (
							<div className="flex flex-col gap-2 mt-2">
								{!isInQueue ? (
									<button
										className="px-2 py-1 rounded bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
										onClick={handleJoinQueue}
										disabled={joinQueueLoading}
									>
										{joinQueueLoading ? 'Joining...' : 'Enter Buyer Queue'}
									</button>
								) : (
									<>
										<button
											className="px-2 py-1 rounded bg-gray-600 text-white text-xs font-semibold hover:bg-gray-700"
											onClick={handleLeaveQueue}
											disabled={leaveQueueLoading}
										>
											{leaveQueueLoading ? 'Leaving...' : 'Leave Buyer Queue'}
										</button>
										<button
											className="px-2 py-1 rounded bg-violet-700 text-white text-xs font-semibold hover:bg-violet-800"
											onClick={() => handleOpenChat(sellerId)}
										>
											Chat with Seller
										</button>
									</>
								)}
							</div>
						)}
					</>
				)}

				{statusLower === 'sold' && buyer && (
					<div className="mt-2 text-green-400 font-bold text-xs">
						Sold to: {buyer.username || buyer}
					</div>
				)}

				{actionError && <div className="text-red-500 text-xs mt-2">{actionError}</div>}

				{/* Only show chat if user is in queue or is seller */}
				{showChat &&
					((isSeller || isInQueue) && (
						<ChatBox
							chatId={_id}
							product={product}
							onClose={() => setShowChat(null)}
							participantId={showChat}
							isSeller={isSeller}
						/>
					))}
			</div>
		</div>
	);
};

export default ProductCard;