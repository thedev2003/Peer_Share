import { Link, useLocation } from 'react-router-dom';

// Sidebar navigation for marketplace and user product views
export default function Sidebar() {
	const location = useLocation();
	return (
		<nav className="bg-gray-900 text-white min-h-screen p-6 w-64">
			<ul className="space-y-4">
				<li>
					<Link
						to="/my-items"
						className={`block px-3 py-2 rounded ${location.pathname === '/my-items' ? 'bg-indigo-700' : 'hover:bg-gray-800'}`}
					>
						My Items for Sale
					</Link>
				</li>
				<li>
					<Link
						to="/sold-items"
						className={`block px-3 py-2 rounded ${location.pathname === '/sold-items' ? 'bg-indigo-700' : 'hover:bg-gray-800'}`}
					>
						My Items Sold
					</Link>
				</li>
				<li>
					<Link
						to="/purchased-items"
						className={`block px-3 py-2 rounded ${location.pathname === '/purchased-items' ? 'bg-indigo-700' : 'hover:bg-gray-800'}`}
					>
						Items Purchased
					</Link>
				</li>
			</ul>
		</nav>
	);
}