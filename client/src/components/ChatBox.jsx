import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";


export default function ChatBox({ productId, participantId, product, onClose }) {
	const { user, token } = useSelector((state) => state.auth);
	const [chatId, setChatId] = useState(null);
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(true);
	const [sending, setSending] = useState(false);
	const messagesEndRef = useRef(null);

	// On mount, get or create the chat and fetch messages
	useEffect(() => {
		let interval;
		const getOrCreateChat = async () => {
			try {
				setLoading(true);
				const res = await axios.get(`/api/chats/product/${productId}/${participantId}`, {
					headers: { Authorization: `Bearer ${token}` }
				});
				setChatId(res.data._id);
				// Defensive: If res.data.messages is not an array, fallback to []
				if (Array.isArray(res.data.messages)) {
					setMessages(res.data.messages);
				} else {
					setMessages([]);
				}
				// Start polling for new messages
				interval = setInterval(async () => {
					try {
						const msgRes = await axios.get(`/api/chats/${res.data._id}/messages`, {
							headers: { Authorization: `Bearer ${token}` }
						});
						if (Array.isArray(msgRes.data)) {
							setMessages(msgRes.data);
						} else {
							setMessages([]);
						}
					} catch {
						setMessages([]);
					}
				}, 3000);
			} catch (e) {
				setMessages([]);
			} finally {
				setLoading(false);
			}
		};
		getOrCreateChat();
		return () => interval && clearInterval(interval);
	}, [productId, participantId, token]);

	// Scroll to bottom on new message
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	// Send message
	const handleSend = async (e) => {
		e.preventDefault();
		if (!input.trim() || !chatId) return;
		setSending(true);
		try {
			const res = await axios.post(
				`/api/chats/${chatId}/messages`,
				{ content: input },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			// After sending, fetch messages again
			const msgRes = await axios.get(`/api/chats/${chatId}/messages`, {
				headers: { Authorization: `Bearer ${token}` }
			});
			if (Array.isArray(msgRes.data)) {
				setMessages(msgRes.data);
			}
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
						: Array.isArray(messages) && messages.length === 0
							? <div className="text-center text-gray-500">No messages yet.</div>
							: Array.isArray(messages) && messages.map((msg, i) => (
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