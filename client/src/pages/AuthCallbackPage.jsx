import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setToken } from '../store/authSlice';

/**
 * Original AuthCallbackPage. It handles the redirect from Google OAuth,
 * sets the token, and navigates to the marketplace.
 */
export default function AuthCallbackPage() {
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		// Parse the token from the URL query parameters.
		const params = new URLSearchParams(location.search);
		const token = params.get('token');

		if (token) {
			// If a token is found, dispatch the action to set it in the Redux store.
			dispatch(setToken(token));
			// Redirect the user to the marketplace.
			navigate('/marketplace');
		} else {
			// If no token is found, redirect to the login page with an error.
			navigate('/login?error=auth_failed');
		}
	}, [dispatch, location, navigate]);

	return (
		<div className="min-h-screen w-full flex items-center justify-center bg-gray-900 text-white">
			<p>Authenticating, please wait...</p>
		</div>
	);
}