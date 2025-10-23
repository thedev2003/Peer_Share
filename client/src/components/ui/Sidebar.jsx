import { Link, useLocation } from 'react-router-dom';

// Sidebar navigation for marketplace and user product views
export default function Sidebar() {
	const location = useLocation();
	return (
		   <nav className="bg-gray-900 text-white w-full sm:w-64 p-2 sm:p-3 mb-1 sm:mb-0">
			   <ul className="flex flex-row sm:flex-col gap-2 sm:gap-2 justify-around sm:justify-start">
				   <li>
					   <Link
						   to="/my-items"
						   className={`block px-3 py-1 rounded ${location.pathname === '/my-items' ? 'bg-indigo-700' : 'hover:bg-gray-800'}`}
					   >
						   My Items for Sale
					   </Link>
				   </li>
				   <li>
					   <Link
						   to="/sold-items"
						   className={`block px-3 py-1 rounded ${location.pathname === '/sold-items' ? 'bg-indigo-700' : 'hover:bg-gray-800'}`}
					   >
						   My Items Sold
					   </Link>
				   </li>
				   <li>
					   <Link
						   to="/purchased-items"
						   className={`block px-3 py-1 rounded ${location.pathname === '/purchased-items' ? 'bg-indigo-700' : 'hover:bg-gray-800'}`}
					   >
						   Items Purchased
					   </Link>
				   </li>
			   </ul>
		   </nav>
	);
}