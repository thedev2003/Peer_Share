import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { fetchUserByToken } from './store/authActions';
import Navbar from './components/ui/Navbar';

// Import Pages and Components
import MarketplacePage from './pages/MarketplacePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import NotificationContainer from './components/ui/NotificationContainer';
import HomePage from './pages/HomePage';

// Import dummy pages for other routes (these can be replaced with real logic later)
const DummyPage = ({ title }) => (
	<div className="p-6 text-white text-2xl">{title} (Coming soon)</div>
);

// Protected Route logic (unchanged from previous version)
function ProtRoute({ children }) {
	const { token, isInitialized } = useSelector((state) => state.auth);
	const location = useLocation();

	console.log("ProtRoute: token =", token, "isInitialized =", isInitialized, "location =", location);

	if (!isInitialized) {
		console.log("ProtRoute: Waiting for auth initialization");
		return <div className="min-h-screen w-full flex items-center justify-center bg-gray-900 text-white"></div>;
	}

	if (!token) {
		console.log("ProtRoute: No token found, redirecting to login");
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	console.log("ProtRoute: Authenticated, rendering protected children");
	return children;
}

function App() {
	const dispatch = useDispatch();
	const { token, isInitialized } = useSelector((state) => state.auth);

	useEffect(() => {
		const tokenFromStorage = localStorage.getItem('token');
		console.log("App: tokenFromStorage =", tokenFromStorage, "isInitialized =", isInitialized);
		if (tokenFromStorage && !isInitialized) {
			console.log("App: Dispatching fetchUserByToken");
			dispatch(fetchUserByToken(tokenFromStorage));
		}
	}, [dispatch, isInitialized]);

	return (
		<div className="min-h-screen w-full bg-gray-100 dark:bg-gray-900 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 font-sans text-gray-800 dark:text-white transition-colors">
			{token && <Navbar />}
			<NotificationContainer />
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/signup" element={<SignUpPage />} />
				<Route path="/auth/callback" element={<AuthCallbackPage />} />
				<Route path="/api/auth/google/callback" element={<AuthCallbackPage />} />
				{/* Protected Marketplace and extended protected routes */}
				<Route path="/marketplace" element={<ProtRoute><MarketplacePage /></ProtRoute>} />
				<Route path="/my-items" element={<ProtRoute><MarketplacePage /></ProtRoute>} />
				<Route path="/sold-items" element={<ProtRoute><DummyPage title="My Items Sold" /></ProtRoute>} />
				<Route path="/purchased-items" element={<ProtRoute><DummyPage title="Items Purchased" /></ProtRoute>} />
			</Routes>
		</div>
	);
}

export default App;