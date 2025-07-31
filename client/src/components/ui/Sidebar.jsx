import { Link } from 'react-router-dom';

export default function Sidebar() {
	// Only show on homepage after login
	return (
		<aside className="w-64 bg-gray-900 text-white p-6 rounded-lg shadow-md flex flex-col gap-4">
			<Link to="/my-items" className="hover:text-indigo-400">My Items for Sale</Link>
			<Link to="/sold-items" className="hover:text-indigo-400">My Items Sold</Link>
			<Link to="/purchased-items" className="hover:text-indigo-400">Items Purchased</Link>
		</aside>
	);
}