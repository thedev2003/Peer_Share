// /**
//  * Original AuthCallbackPage. It handles the redirect from Google OAuth,
//  * sets the token, and navigates to the marketplace.
//  */
// export default function AuthCallbackPage() {
// 	const location = useLocation();
// 	const navigate = useNavigate();
// 	const dispatch = useDispatch();

// 	useEffect(() => {
// 		// Parse the token from the URL query parameters.
// 		const params = new URLSearchParams(location.search);
// 		const token = params.get('token');

// 		if (token) {
// 			// If a token is found, dispatch the action to set it in the Redux store.
// 			dispatch(setToken(token));
// 			// Redirect the user to the marketplace.
// 			navigate('/marketplace');
// 		} else {
// 			// If no token is found, redirect to the login page with an error.
// 			navigate('/login?error=auth_failed');
// 		}
// 	}, [dispatch, location, navigate]);

// 	return (
// 		<div className="min-h-screen w-full flex items-center justify-center bg-gray-900 text-white">
// 			<p>Authenticating, please wait...</p>
// 		</div>
// 	);
// }

import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setToken } from '../store/authSlice';

/**
 * Handles the redirect from Google OAuth, exchanges code for token,
 * sets the token, and navigates to the marketplace.
 */
export default function AuthCallbackPage() {
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		const params = new URLSearchParams(location.search);

		// Try getting token first (for other providers)
		const token = params.get('token');
		if (token) {
			dispatch(setToken(token));
			navigate('/marketplace');
			return;
		}

		// For Google OAuth: get 'code' and exchange for token
		const code = params.get('code');
		if (code) {
			// Exchange code for token from backend
			fetch(`/api/auth/google/exchange?code=${code}`, {
				method: 'GET',
				credentials: 'include',
			})
				.then(res => res.json())
				.then(data => {
					if (data.token) {
						dispatch(setToken(data.token));
						navigate('/marketplace');
					} else {
						navigate('/login?error=auth_failed');
					}
				})
				.catch(() => {
					navigate('/login?error=auth_failed');
				});
			return;
		}

		// If neither token nor code exists, redirect to login
		navigate('/login?error=auth_failed');
	}, [dispatch, location, navigate]);

	return (
		<div className="min-h-screen w-full flex items-center justify-center bg-gray-900 text-white">
			<p>Authenticating, please wait...</p>
		</div>
	);
}