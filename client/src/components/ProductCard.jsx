import { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import ChatBox from './ChatBox'; // Ensure this exists and works

const API_URL = import.meta.env.VITE_RENDER_URL || window.location.origin;

export default function ProductCard({
	product,
	onProductRemoved,
	updateProductState,
	removeFromMarketplace,
}) {
	const [showChat, setShowChat] = useState(null);
	const [selling, setSelling] = useState(false);
	const [removing, setRemoving] = useState(false);
	const [leaveQueueLoading, setLeaveQueueLoading] = useState(false);
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

	// Seller marks item as sold to buyer
	const handleSellToBuyer = async (buyerId) => {
		setSelling(true);
		setActionError(null);
		try {
			const res = await axios.post(
				`${API_URL.replace(/\/$/, '')}/api/products/${_id}/sell`,
				{ buyerId },
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			// Remove from marketplace for everyone
			if (removeFromMarketplace) removeFromMarketplace(_id);
			if (onProductRemoved) onProductRemoved(_id);
			if (updateProductState) updateProductState(_id, res.data.product);
		} catch (err) {
			setActionError(err.response?.data?.message || 'Failed to mark as sold');
		} finally {
			setSelling(false);
		}
	};

	// Buyer joins queue
	const handleJoinQueue = async () => {
		setActionError(null);
		try {
			await axios.post(
				`${API_URL.replace(/\/$/, '')}/api/products/${_id}/join-queue`,
				{},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			if (updateProductState)
				updateProductState(_id, { ...product, interestedBuyers: [...interestedBuyers, userId] });
		} catch (err) {
			setActionError(err.response?.data?.message || 'Failed to join queue');
		}
	};

	// Buyer leaves queue
	const handleLeaveQueue = async () => {
		setLeaveQueueLoading(true);
		setActionError(null);
		try {
			await axios.post(
				`${API_URL.replace(/\/$/, '')}/api/products/${_id}/leave-queue`,
				{},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			if (updateProductState)
				updateProductState(
					_id,
					{
						...product,
						interestedBuyers: interestedBuyers.filter((id) => String(id) !== String(userId)),
					}
				);
		} catch (err) {
			setActionError(err.response?.data?.message || 'Failed to leave queue');
		} finally {
			setLeaveQueueLoading(false);
		}
	};

	// Seller removes product from sale
	const handleRemoveFromSale = async () => {
		setRemoving(true);
		setActionError(null);
		try {
			await axios.delete(
				`${API_URL.replace(/\/$/, '')}/api/products/${_id}`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			if (removeFromMarketplace) removeFromMarketplace(_id);
			if (onProductRemoved) onProductRemoved(_id);
		} catch (err) {
			setActionError(err.response?.data?.message || 'Failed to remove from sale');
		} finally {
			setRemoving(false);
		}
	};

	return (
		<div className="w-full max-w-[320px] min-w-[260px] rounded-xl shadow-lg bg-gray-800 border border-gray-700 mx-auto my-4 flex flex-col"
			style={{ flex: '1 1 0', margin: '8px' }}
		>
			{/* Product Image */}
			{imageUrl && (
				<img src={imageUrl} alt={name} className="w-full h-36 object-cover rounded-t-xl" />
			)}
			<div className="p-3 flex flex-col flex-1 justify-between">
				<div>
					<h2 className="text-lg font-semibold text-indigo-300 mb-1">{name}</h2>
					<p className="text-gray-400 mb-1">Category: {category}</p>
					<p className="text-gray-300 font-bold mb-2">₹{price}</p>
					<p className="mb-2 text-xs text-gray-400">
						Seller: {seller.username || seller.email || 'Unknown'}
					</p>
				</div>

				{statusLower === 'available' && (
					<>
						{isSeller ? (
							<div className="flex flex-col gap-2 mt-2">
								<button
									className="px-2 py-1 rounded bg-red-600 text-white text-xs font-semibold hover:bg-red-700"
									onClick={handleRemoveFromSale}
									disabled={removing}
								>
									{removing ? 'Removing...' : 'Remove from Sale'}
								</button>
								<button
									className="px-2 py-1 rounded bg-violet-700 text-white text-xs font-semibold hover:bg-violet-800"
									onClick={() => setShowChat('seller')}
								>
									Open Chat (Interested Buyers)
								</button>
								{/* Interested buyers & sell buttons */}
								{interestedBuyers.length > 0 && (
									<div className="mt-2">
										<span className="text-xs text-gray-400 mb-1 block">Interested Buyers:</span>
										{interestedBuyers.map((buyerId) => (
											<div key={buyerId} className="flex gap-1 mb-2">
												<button
													className="flex-1 px-2 py-1 rounded bg-violet-700 text-white text-xs font-semibold hover:bg-violet-800"
													onClick={() => setShowChat(buyerId)}
												>
													Chat with {buyerId}
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
									</div>
								)}
							</div>
						) : (
							<div className="flex flex-col gap-2 mt-2">
								{!isInQueue ? (
									<button
										className="px-2 py-1 rounded bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
										onClick={handleJoinQueue}
									>
										Enter Buyer Queue
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
											onClick={() => setShowChat(sellerId)}
										>
											Chat with Seller
										</button>
									</>
								)}
							</div>
						)}
					</>
				)}

				{/* Sold status */}
				{statusLower === 'sold' && buyer && (
					<div className="mt-2 text-green-400 font-bold text-xs">
						Sold to: {buyer.username || buyer}
					</div>
				)}

				{/* Error display */}
				{actionError && <div className="text-red-500 text-xs mt-2">{actionError}</div>}

				{/* Chat Modal */}
				{showChat && (
					<ChatBox
						chatId={_id}
						product={product}
						onClose={() => setShowChat(null)}
						buyerId={showChat === 'seller' ? null : showChat}
						isSeller={isSeller}
					/>
				)}
			</div>
		</div>
	);
}