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
		const token = params.get('token');

		console.log("AuthCallbackPage: location.search =", location.search);
		console.log("AuthCallbackPage: token =", token);

		if (token) {
			console.log("AuthCallbackPage: Dispatching setToken with token");
			dispatch(setToken(token));
			console.log("AuthCallbackPage: Navigating to /marketplace");
			navigate('/marketplace');
			return;
		}

		console.log("AuthCallbackPage: No token present, redirecting to login");
		navigate('/login?error=auth_failed');
	}, [dispatch, location, navigate]);

	return (
		<div className="min-h-screen w-full flex items-center justify-center bg-gray-900 text-white">
			<p>Authenticating, please wait...</p>
		</div>
	);
}