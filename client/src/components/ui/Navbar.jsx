import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';

export default function Navbar() {
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    // Only show the marketplace home link if not already on the marketplace page
    const isMarketplaceHome = location.pathname === '/marketplace';

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    return (
        <nav className="w-full bg-gray-800 text-white flex items-center justify-between px-6 py-3 shadow">
            <div className="flex items-center gap-4">
                {!isMarketplaceHome && (
                    <Link to="/marketplace" className="text-lg font-bold hover:text-indigo-400">Home</Link>
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