import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import ChatBox from './ChatBox';

const ProductCard = ({ product, updateProductState, removeFromMarketplace }) => {
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
        description,
    } = product;

    // Defensive checks
    const userId = user?._id;
    const sellerId = seller._id || seller;
    const isSeller = userId === sellerId;
    const isInQueue = interestedBuyers.map(String).includes(String(userId));
    const statusLower = typeof status === 'string' ? status.toLowerCase() : status;

    /** Helper: API error message */
    const getApiError = (err, fallback) =>
        err?.response?.data?.message || err?.message || fallback;

    /** Button: Join Buyer Queue */
    const handleJoinQueue = async () => {
        if (!_id) return setActionError('Product ID missing.');
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
            setActionError(getApiError(err, 'Failed to join queue'));
        } finally {
            setJoinQueueLoading(false);
        }
    };

    /** Button: Leave Buyer Queue */
    const handleLeaveQueue = async () => {
        if (!_id) return setActionError('Product ID missing.');
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
            setActionError(getApiError(err, 'Failed to leave queue'));
        } finally {
            setLeaveQueueLoading(false);
        }
    };

    /** Button: Remove from Sale */
    const handleRemoveFromSale = async () => {
        if (!_id) return setActionError('Product ID missing.');
        setActionError(null);
        try {
            const res = await axios.delete(
                `${API_URL.replace(/\/$/, '')}/api/products/${_id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (removeFromMarketplace) removeFromMarketplace(_id);
        } catch (err) {
            setActionError(getApiError(err, 'Failed to remove item from sale'));
        }
    };

    /** Button: Chat with Seller */
    const handleOpenChat = (chatTargetId) => setShowChat(chatTargetId);

    // ... existing code ... (for seller actions, interested buyers UI)

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
                <h2 className="text-lg font-semibold text-white">{name}</h2>
                {/* Seller info, category, etc. will move to dropdown in next step */}
                <p className="text-lg font-bold text-indigo-400">₹{price}</p>

                {/* Product status/actions */}
                {statusLower === 'available' && (
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
                            </>
                        )}
                    </div>
                )}

                {statusLower === 'sold' && buyer && (
                    <div className="mt-2 text-green-400 font-bold text-xs">
                        Sold to: {buyer.username || buyer}
                    </div>
                )}

                {actionError && <div className="text-red-500 text-xs mt-2">{actionError}</div>}

                {/* Chat Modal */}
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