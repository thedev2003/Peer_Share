import React, { useState } from "react";
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
			const res = await axios.post(
				`${API_URL.replace(/\/$/, "")}/api/products/${_id}/leave-queue`,
				{},
				{ headers: { Authorization: `Bearer ${token}` } }
			);
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
			await axios.delete(
				`${API_URL.replace(/\/$/, "")}/api/products/${_id}`,
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			// Remove product from marketplace state after successful deletion
			if (removeFromMarketplace) removeFromMarketplace(_id);
		} catch (err) {
			setActionError(getApiError(err, "Failed to remove item from sale"));
		}
	};

	// Handler: Open chat modal for seller or buyer
	const handleOpenChat = (chatTargetId) => setShowChat(chatTargetId);

	// Main render for product card
	return (
		<div className="w-full max-w-[320px] min-w-[260px] rounded-xl shadow-lg bg-gray-800 border border-gray-700 mx-auto my-4 flex flex-col">
			{/* Product image section */}
			<div className="relative block w-full h-[200px] overflow-hidden rounded-t-xl">
				<img
					src={imageUrl || "/placeholder.jpg"}
					alt={name}
					className="absolute inset-0 h-full w-full object-cover"
				/>
			</div>
			<div className="flex flex-col p-4">
				{/* Product title and price */}
				<h2 className="text-lg font-semibold text-white">{name}</h2>
				<p className="text-lg font-bold text-indigo-400">₹{price}</p>
				{/* Product status and action buttons */}
				{statusLower === "available" && (
					<div className="flex flex-col gap-2 mt-2">
						{isSeller ? (
							<button
								className="px-2 py-1 rounded bg-red-600 text-white text-xs font-semibold hover:bg-red-700"
								onClick={handleRemoveFromSale}
							>
								Remove from Sale
							</button>
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