import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * Original ProtectedRoute component. It redirects to login if there is no token.
 */
const ProtectedRoute = ({ children }) => {
	const { token, isInitialized } = useSelector((state) => state.auth);
	const location = useLocation();

	// Wait until the initial auth check is complete before rendering anything.
	if (!isInitialized) {
		// You might want to show a loading spinner here.
		return <div className="min-h-screen w-full flex items-center justify-center bg-gray-900 text-white"></div>;
	}

	// If the check is done and there's no token, redirect to the login page.
	return token ? children : <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;
