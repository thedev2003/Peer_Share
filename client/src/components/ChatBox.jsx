import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000'; // Change if needed

export default function ChatBox({ chatId, product, onClose }) {
	const { user } = useSelector(state => state.auth);
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState('');
	const [error, setError] = useState(null);
	const socketRef = useRef(null);
	const messagesEndRef = useRef(null);

	useEffect(() => {
		socketRef.current = io(SOCKET_URL);
		socketRef.current.emit('joinRoom', chatId);
		socketRef.current.on('previousMessages', msgs => setMessages(msgs));
		socketRef.current.on('newMessage', msg => setMessages(prev => [...prev, msg]));
		socketRef.current.on('chatError', setError);
		return () => {
			socketRef.current.disconnect();
		};
	}, [chatId]);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	const sendMessage = () => {
		if (!input.trim()) return;
		socketRef.current.emit('sendMessage', {
			chatId,
			senderId: user._id,
			content: input.trim(),
		});
		setInput('');
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
			<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg flex flex-col">
				<div className="flex justify-between items-center mb-2">
					<h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-300">Chat for {product?.name}</h2>
					<button onClick={onClose} className="text-gray-500 hover:text-red-500">✕</button>
				</div>
				<div className="flex-1 overflow-y-auto mb-4 border rounded p-2 bg-gray-50 dark:bg-gray-900" style={{ maxHeight: '300px' }}>
					{messages.map((msg, idx) => (
						<div key={idx} className={`mb-2 flex ${msg.sender._id === user._id ? 'justify-end' : 'justify-start'}`}>
							<div className={`px-3 py-2 rounded-lg ${msg.sender._id === user._id ? 'bg-indigo-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'}`}>
								<span className="font-semibold mr-2">{msg.sender.username}</span>
								{msg.content}
							</div>
						</div>
					))}
					<div ref={messagesEndRef} />
				</div>
				{error && <div className="text-red-500 text-sm mb-2">{error}</div>}
				<div className="flex gap-2">
					<input
						type="text"
						value={input}
						onChange={e => setInput(e.target.value)}
						className="flex-1 px-3 py-2 rounded border focus:outline-none focus:ring focus:ring-indigo-400 dark:bg-gray-700 dark:text-white"
						placeholder="Type your message..."
						onKeyDown={e => e.key === 'Enter' && sendMessage()}
					/>
					<button
						onClick={sendMessage}
						className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
					>
						Send
					</button>
				</div>
			</div>
		</div>
	);
}
