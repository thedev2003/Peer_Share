import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { fetchUserByToken } from './store/authActions';

// Import Pages and Components
import MarketplacePage from './pages/MarketplacePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import NotificationContainer from './components/ui/NotificationContainer';

// A wrapper for routes that require authentication
function ProtectedRoute({ children }) {
	const { token, isInitialized } = useSelector((state) => state.auth);

	// Wait until the initial auth check is complete
	if (!isInitialized) {
		return <div className="min-h-screen w-full flex items-center justify-center bg-gray-900 text-white">Loading...</div>;
	}

	// If the check is done and there's no token, redirect to login
	return token ? children : <Navigate to="/login" />;
}

export default function App() {
	const dispatch = useDispatch();
	const { isInitialized } = useSelector((state) => state.auth);

	// On initial app load, check for a token and try to authenticate the user
	useEffect(() => {
		const tokenFromStorage = localStorage.getItem('token');
		// We only fetch if the token exists and we haven't already tried to initialize the session.
		if (tokenFromStorage && !isInitialized) {
			dispatch(fetchUserByToken(tokenFromStorage));
		}
	}, [dispatch, isInitialized]);

	return (
		<div className="min-h-screen w-full bg-gray-100 dark:bg-gray-900 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 font-sans text-gray-800 dark:text-white transition-colors duration-300">
			<Router>
				<NotificationContainer /> {/* Add the notification container here */}
				<Routes>
					{/* Public Routes */}
					<Route path="/login" element={<LoginPage />} />
					<Route path="/signup" element={<SignUpPage />} />
					<Route path="/auth/callback" element={<AuthCallbackPage />} />

					{/* Protected Routes */}
					<Route
						path="/"
						element={
							<ProtectedRoute>
								<MarketplacePage />
							</ProtectedRoute>
						}
					/>
				</Routes>
			</Router>
		</div>
	);
}