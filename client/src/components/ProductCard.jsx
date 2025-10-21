import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import ChatBox from "./ChatBox";

// Set API base URL from Vite environment variable
const API_URL = import.meta.env.VITE_RENDER_URL;


const ProductCard = ({ product, updateProductState, removeFromMarketplace }) => {
	// State hooks for UI toggles and status
	const [showChat, setShowChat] = useState(null);
	const [leaveQueueLoading, setLeaveQueueLoading] = useState(false);
	const [joinQueueLoading, setJoinQueueLoading] = useState(false);
	const [actionError, setActionError] = useState(null);
	const [showDescription, setShowDescription] = useState(false);
	const [descAnim, setDescAnim] = useState(''); // '' | 'fadeIn' | 'fadeOut'
	const [showBuyersDropdown, setShowBuyersDropdown] = useState(false);

	// Get user and token from Redux store
	const { user, token } = useSelector((state) => state.auth);

	// Destructure product data
	const {
		_id,
		name,
		price,
		imageUrl,
		seller = {},
		interestedBuyers = [],
		status = "Available",
		buyer,
		description,
	} = product;

	// Identify user roles and product status
	const userId = user?._id;
	const sellerId = seller._id || seller;
	const isSeller = userId === sellerId;
	const isInQueue = interestedBuyers.map(String).includes(String(userId));
	const statusLower = typeof status === "string" ? status.toLowerCase() : status;

	// Helper: Return error message based on API response
	const getApiError = (err, fallback) => {
		if (err?.response?.status === 404) {
			return `Request failed with status code 404: ${err.response?.data?.message || "Not found."} (Check API_URL and product ID)`;
		}
		return err?.response?.data?.message || err?.message || fallback;
	};

	// Handler: Join Buyer Queue
	const handleJoinQueue = async () => {
		// Make sure product ID is present and valid
		if (!_id || typeof _id !== "string") {
			setActionError("Product ID missing or invalid.");
			return;
		}
		setJoinQueueLoading(true);
		setActionError(null);
		try {
			console.log(_id);
			const res = await axios.post(
				`${API_URL.replace(/\/$/, "")}/api/products/${_id}/join-queue`,
				{},
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			// Update product in parent state after successful queue join
			if (updateProductState) updateProductState(_id, res.data.product);
			setShowChat(null);
		} catch (err) {
			setActionError(getApiError(err, "Failed to join queue"));
		} finally {
			setJoinQueueLoading(false);
		}
	};

	// Handler: Leave Buyer Queue
	const handleLeaveQueue = async () => {
		if (!_id || typeof _id !== "string") {
			setActionError("Product ID missing or invalid.");
			return;
		}
		setLeaveQueueLoading(true);
		setActionError(null);
		try {
			console.log(_id);
			const res = await axios.post(
				`${API_URL.replace(/\/$/, "")}/api/products/${_id}/leave-queue`,
				{},
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			console.log(res.data);



			// Update product in parent state after leaving queue
			if (updateProductState) updateProductState(_id, res.data.product);
			setShowChat(null);
		} catch (err) {
			setActionError(getApiError(err, "Failed to leave queue"));
		} finally {
			setLeaveQueueLoading(false);
		}
	};

	// Handler: Remove Product from Sale
	const handleRemoveFromSale = async () => {
		if (!_id || typeof _id !== "string") {
			setActionError("Product ID missing or invalid.");
			return;
		}
		setActionError(null);
		try {
			console.log(_id);
			const deleteRes = await axios.delete(
				`${API_URL.replace(/\/$/, "")}/api/products/${_id}`,
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			console.log(deleteRes.data);


			
			// Remove product from marketplace state after successful deletion
			if (removeFromMarketplace) removeFromMarketplace(_id);
		} catch (err) {
			setActionError(getApiError(err, "Failed to remove item from sale"));
		}
	};


	// Handler: Open chat modal for seller or buyer
	const handleOpenChat = (chatTargetId) => {
		setShowChat(chatTargetId);
		setShowBuyersDropdown(false);
	};
	// Handler: Toggle buyers dropdown
	const handleToggleBuyersDropdown = () => setShowBuyersDropdown((prev) => !prev);

	// Handler: Toggle description overlay
	const handleToggleDescription = () => {
		setDescAnim('fadeIn');
		setShowDescription(true);
	};
	// Handler: Close description overlay with fadeOut
	const handleCloseDescription = () => {
		setDescAnim('fadeOut');
		setTimeout(() => {
			setShowDescription(false);
			setDescAnim('');
		}, 300); // match animation duration
	};


	// Main render for product card
	return (
		<div className="w-full max-w-[280px] min-w-[250px] rounded-xl shadow-lg bg-gray-800 border border-gray-700 mx-auto my-4 flex flex-col">
			{/* Product image section */}
			<div className="relative block w-full h-[200px] overflow-hidden rounded-t-xl">
				<img
					src={imageUrl || "/placeholder.jpg"}
					alt={name}
					className="absolute inset-0 h-full w-full object-cover"
				/>
				{/* Dropdown icon button */}
				{!showDescription && (
					<button
						className="absolute top-2 right-2 bg-gray-900 bg-opacity-70 rounded-full p-1 hover:bg-opacity-90 z-10"
						onClick={handleToggleDescription}
						aria-label="Show Description"
					>
						{/* Simple chevron-down icon (SVG) */}
						<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-white">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
						</svg>
					</button>
				)}
				{/* Description overlay with fade animation and info */}
				{showDescription && (
					<div className={`absolute inset-0 flex flex-col items-center justify-center bg-gray-900 bg-opacity-70 backdrop-blur-sm z-20 ${descAnim === 'fadeIn' ? 'animate-fadeIn' : descAnim === 'fadeOut' ? 'animate-fadeOut' : ''}`}>
						<button
							className="absolute top-2 right-2 bg-gray-800 bg-opacity-80 rounded-full p-1 hover:bg-red-600 z-30"
							onClick={handleCloseDescription}
							aria-label="Close Description"
						>
							{/* Close (X) icon */}
							<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-white">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
						<div className="text-white text-sm p-4 text-center">
							<div className="mb-2 font-semibold">{description || "No description provided."}</div>
							<div className="text-xs text-gray-300">Category: {product.category || "N/A"}</div>
							<div className="text-xs text-gray-300">
								Seller: {typeof seller === 'object' && seller.username ? seller.username : 'N/A'}
							</div>
							<div className="text-xs text-gray-300">
								Scholar No.: {typeof seller === 'object' && seller.email ? seller.email.split('@')[0] : 'N/A'}
							</div>
						</div>
					</div>
				)}
				{/* Fade animation keyframes */}
				<style>{`
					@keyframes fadeIn {
						from { opacity: 0; }
						to { opacity: 1; }
					}
					@keyframes fadeOut {
						from { opacity: 1; }
						to { opacity: 0; }
					}
					.animate-fadeIn {
						animation: fadeIn 0.3s ease;
					}
					.animate-fadeOut {
						animation: fadeOut 0.3s ease;
					}
				`}</style>
			</div>
			<div className="flex flex-col p-4">
				{/* Product title and price aligned */}
				<div className="flex items-center justify-between">
					<h2 className="text-lg font-semibold text-white">{name}</h2>
					<p className="text-lg font-bold text-indigo-400">₹{price}</p>
				</div>
				{/* Product status and action buttons */}
				{statusLower === "available" && (
					<div className="flex flex-col gap-2 mt-2">
						{isSeller ? (
							<>
								<button
									className="px-2 py-1 rounded bg-red-600 text-white text-xs font-semibold hover:bg-red-700"
									onClick={handleRemoveFromSale}
								>
									Remove from Sale
								</button>
								{/* Chat with Buyers button and dropdown */}
								<div className="mt-2 relative">
									<button
										className="px-2 py-1 rounded bg-violet-700 text-white text-xs font-semibold hover:bg-violet-800 w-full text-center"
										onClick={handleToggleBuyersDropdown}
									>
										Chat with Buyers
									</button>
									{showBuyersDropdown && (
										<div className="absolute left-0 right-0 mt-2 bg-gray-900 rounded shadow-lg z-30">
											{interestedBuyers.length > 0 ? (
												interestedBuyers.map((buyer, idx) => {
													// buyer can be an object or just an id
													const buyerId = buyer._id || buyer;
													let scholarNo = buyerId;
													if (buyer.email) {
														scholarNo = buyer.email.split('@')[0];
													}
													return (
														<button
															key={buyerId}
															className="w-full px-2 py-2 border-b border-gray-800 text-left text-xs text-white hover:bg-violet-800"
															onClick={() => handleOpenChat(buyerId)}
														>
															Chat with Buyer #{idx + 1} <span className="ml-2 text-gray-400">Scholar No.: {scholarNo}</span>
														</button>
													);
												})
											) : (
												<div className="px-2 py-2 text-center text-xs text-gray-300">No buyers so far</div>
											)}
										</div>
									)}
								</div>
							</>
						) : (
							<>
								{!isInQueue ? (
									<button
										className="px-2 py-1 rounded bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
										onClick={handleJoinQueue}
										disabled={joinQueueLoading}
									>
										{joinQueueLoading ? "Joining..." : "Enter Buyer Queue"}
									</button>
								) : (
									<>
										<button
											className="px-2 py-1 rounded bg-gray-600 text-white text-xs font-semibold hover:bg-gray-700"
											onClick={handleLeaveQueue}
											disabled={leaveQueueLoading}
										>
											{leaveQueueLoading ? "Leaving..." : "Leave Buyer Queue"}
										</button>
										<button
											className="px-2 py-1 rounded bg-violet-700 text-white text-xs font-semibold hover:bg-violet-800"
											onClick={() => handleOpenChat(sellerId)}
										>
											Chat with Seller
										</button>
									</>
								)}
							</>
						)}
					</div>
				)}

				{/* Show buyer info once sold */}
				{statusLower === "sold" && buyer && (
					<div className="mt-2 text-green-400 font-bold text-xs">
						Sold to: {buyer.username || buyer}
					</div>
				)}

				{/* Error display section */}
				{actionError && (
					<div className="text-red-500 text-xs mt-2">{actionError}</div>
				)}

				{/* Render chat modal if needed */}
				{showChat &&
					(isSeller || isInQueue) && (
						<ChatBox
							chatId={_id}
							product={product}
							onClose={() => setShowChat(null)}
							participantId={showChat}
							isSeller={isSeller}
						/>
					)}
			</div>
		</div>
	);
};

export default ProductCard;