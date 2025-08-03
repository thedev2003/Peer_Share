import React from 'react';

// Basic modal for chat placeholder, closeable for UI flow
export default function ChatBox({ chatId, product, onClose }) {
	return (
		<div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
			<div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg w-full max-w-md">
				<div className="flex justify-between items-center mb-3">
					<h2 className="text-lg font-bold text-gray-900 dark:text-white">
						Chat for <span className="text-indigo-500">{product?.name}</span>
					</h2>
					<button
						className="text-gray-400 hover:text-red-500 font-bold text-lg"
						onClick={onClose}
						aria-label="Close"
					>
						×
					</button>
				</div>
				<div className="mb-4">
					{/* Placeholder for chat messages */}
					<div className="text-gray-500 dark:text-gray-300 text-sm text-center">
						Chat functionality coming soon.
					</div>
				</div>
				<div className="flex gap-2">
					<input
						type="text"
						className="flex-1 px-3 py-2 border rounded bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
						placeholder="Type your message..."
						disabled
					/>
					<button
						className="px-4 py-2 rounded bg-indigo-600 text-white font-semibold disabled:opacity-60"
						disabled
					>
						Send
					</button>
				</div>
			</div>
		</div>
	);
}