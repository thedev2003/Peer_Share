import { useLocation, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';

export default function Navbar() {
	const { user } = useSelector(state => state.auth);
	const dispatch = useDispatch();
	const location = useLocation();

	// Only show homepage link if not already on homepage
	const isHome = location.pathname === '/';

	const handleLogout = () => {
		dispatch(logout());
	};

	return (
		<nav className="w-full bg-gray-800 text-white flex items-center justify-between px-6 py-3 shadow">
			<div className="flex items-center gap-4">
				{!isHome && (
					<Link to="/" className="text-lg font-bold hover:text-indigo-400">Home</Link>
				)}
			</div>
			<div className="flex items-center gap-4">
				{user && (
					<>
						<img src={user.photoUrl} alt="user" className="w-8 h-8 rounded-full" />
						<span>{user.email}</span>
						<button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded">Logout</button>
					</>
				)}
			</div>
		</nav>
	);
}