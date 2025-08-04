import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

// You might use socket.io-client for real-time; here is REST + polling for simplicity
// import io from "socket.io-client";
// const socket = io(<YOUR_BACKEND_URL>);

export default function ChatBox({ chatId, product, onClose }) {
	const { user, token } = useSelector((state) => state.auth);
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(true);
	const [sending, setSending] = useState(false);
	const messagesEndRef = useRef(null);

	// Fetch chat history on open
	useEffect(() => {
		const fetchMessages = async () => {
			try {
				setLoading(true);
				const res = await axios.get(`/api/chat/${chatId}`, {
					headers: { Authorization: `Bearer ${token}` }
				});
				setMessages(res.data || []);
			} catch (e) {
				setMessages([]);
			} finally {
				setLoading(false);
			}
		};
		fetchMessages();
		// Optionally poll every 5s for new messages
		const interval = setInterval(fetchMessages, 5000);
		return () => clearInterval(interval);
	}, [chatId, token]);

	// Scroll to bottom on new message
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	// Send message
	const handleSend = async (e) => {
		e.preventDefault();
		if (!input.trim()) return;
		setSending(true);
		try {
			const res = await axios.post(
				`/api/chat/${chatId}`,
				{ message: input },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			setMessages((prev) => [...prev, res.data]);
			setInput("");
		} catch (err) {
			alert("Failed to send message");
		} finally {
			setSending(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
			<div className="bg-gray-900 w-full max-w-md rounded-xl shadow-lg p-4 flex flex-col"
				style={{ maxHeight: "90vh" }}>
				<div className="flex justify-between items-center mb-2">
					<h2 className="text-lg font-bold text-white">
						Chat for <span className="text-indigo-400">{product?.name}</span>
					</h2>
					<button
						className="text-gray-400 hover:text-red-500 font-bold text-lg"
						onClick={onClose}
						aria-label="Close"
					>×</button>
				</div>
				<div className="flex-1 overflow-y-auto mb-2 px-1"
					style={{ minHeight: "200px" }}>
					{loading
						? <div className="text-center text-gray-400">Loading chat…</div>
						: messages.length === 0
							? <div className="text-center text-gray-500">No messages yet.</div>
							: messages.map((msg, i) => (
								<div key={i} className={`flex mb-2 ${msg.sender === user._id ? "justify-end" : "justify-start"}`}>
									<div className={`px-3 py-2 rounded-lg max-w-xs ${msg.sender === user._id ? "bg-indigo-600 text-white" : "bg-gray-700 text-gray-200"}`}>
										<div className="text-xs opacity-80">{msg.senderName || (msg.sender === user._id ? "You" : "Seller")}</div>
										<div className="break-words">{msg.message}</div>
									</div>
								</div>
							))
					}
					<div ref={messagesEndRef}></div>
				</div>
				<form className="flex gap-2" onSubmit={handleSend}>
					<input
						type="text"
						className="flex-1 px-3 py-2 rounded bg-gray-800 text-white border border-gray-700"
						placeholder="Type your message…"
						value={input}
						onChange={e => setInput(e.target.value)}
						disabled={sending}
						autoFocus
					/>
					<button
						className="px-4 py-2 rounded bg-indigo-600 text-white font-semibold disabled:opacity-60"
						type="submit"
						disabled={sending || !input.trim()}
					>
						Send
					</button>
				</form>
			</div>
		</div>
	);
}