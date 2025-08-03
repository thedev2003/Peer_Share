// import { useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { setToken } from '../store/authSlice';

// /**
//  * Handles the redirect from Google OAuth, exchanges code for token,
//  * sets the token, and navigates to the marketplace.
//  */
// export default function AuthCallbackPage() {
// 	const location = useLocation();
// 	const navigate = useNavigate();
// 	const dispatch = useDispatch();

// 	useEffect(() => {
// 		const params = new URLSearchParams(location.search);

// 		// Try getting token first (for other providers)
// 		const token = params.get('token');
// 		if (token) {
// 			dispatch(setToken(token));
// 			navigate('/marketplace');
// 			return;
// 		}

// 		// For Google OAuth: get 'code' and exchange for token
// 		const code = params.get('code');
// 		if (code) {
// 			// Exchange code for token from backend
// 			fetch(`/api/auth/google/exchange?code=${code}`, {
// 				method: 'GET',
// 				credentials: 'include',
// 			})
// 				.then(res => res.json())
// 				.then(data => {
// 					if (data.token) {
// 						dispatch(setToken(data.token));
// 						navigate('/marketplace');
// 					} else {
// 						navigate('/login?error=auth_failed');
// 					}
// 				})
// 				.catch(() => {
// 					navigate('/login?error=auth_failed');
// 				});
// 			return;
// 		}

// 		// If neither token nor code exists, redirect to login
// 		navigate('/login?error=auth_failed');
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

export default function AuthCallbackPage() {
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		console.log("AuthCallbackPage: location.search =", location.search);

		const token = params.get('token');
		const code = params.get('code');
		console.log("AuthCallbackPage: token =", token, "code =", code);

		if (token) {
			console.log("AuthCallbackPage: Dispatching setToken with token");
			dispatch(setToken(token));
			console.log("AuthCallbackPage: Navigating to /marketplace");
			navigate('/marketplace');
			return;
		}

		if (code) {
			console.log("AuthCallbackPage: Found code, calling backend to exchange for token");
			fetch(`/api/auth/google/exchange?code=${code}`, {
				method: 'GET',
				credentials: 'include',
			})
				.then(res => {
					console.log("AuthCallbackPage: Received response from backend, status =", res.status);
					return res.json();
				})
				.then(data => {
					console.log("AuthCallbackPage: Backend returned data =", data);
					if (data.token) {
						console.log("AuthCallbackPage: Dispatching setToken with token from backend");
						dispatch(setToken(data.token));
						console.log("AuthCallbackPage: Navigating to /marketplace");
						navigate('/marketplace');
					} else {
						console.log("AuthCallbackPage: No token in backend response, redirecting to login");
						navigate('/login?error=auth_failed');
					}
				})
				.catch((err) => {
					console.error("AuthCallbackPage: Error calling backend exchange endpoint", err);
					navigate('/login?error=auth_failed');
				});
			return;
		}

		console.log("AuthCallbackPage: Neither token nor code present, redirecting to login");
		navigate('/login?error=auth_failed');
	}, [dispatch, location, navigate]);

	return (
		<div className="min-h-screen w-full flex items-center justify-center bg-gray-900 text-white">
			<p>Authenticating, please wait...</p>
		</div>
	);
}