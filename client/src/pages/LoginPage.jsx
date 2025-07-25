import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../store/authActions';
import AuthLayout from '../components/layouts/AuthLayout';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import GoogleIcon from '../components/ui/GoogleIcon'; // We will create this simple icon component

export default function LoginPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { status, error } = useSelector((state) => state.auth);

	const handleSubmit = async (e) => {
		e.preventDefault();
		dispatch(loginUser({ email, password }))
			.unwrap()
			.then(() => {
				navigate('/'); // Redirect to homepage on successful login
			})
			.catch((err) => {
				// Error is handled by the slice and displayed from the store state
			});
	};

	const handleGoogleSignIn = () => {
		// This will open the Google OAuth consent screen in a new window
		window.open('http://localhost:5000/api/auth/google', '_self');
	};

	return (
		<AuthLayout title="Welcome Back" subtitle="Sign in to continue to the marketplace.">
			<form onSubmit={handleSubmit} className="space-y-6">
				{error && (
					<div className="bg-red-500/20 text-red-300 p-3 rounded-lg flex items-center gap-2">
						<AlertCircle size={20} />
						<span>{error}</span>
					</div>
				)}
				<div className="relative">
					<Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
					<input
						type="email"
						placeholder="College Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
						required
					/>
				</div>
				<div className="relative">
					<Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
					<input
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
						required
					/>
				</div>
				<button
					type="submit"
					disabled={status === 'loading'}
					className="w-full py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition-colors disabled:bg-indigo-400/50"
				>
					{status === 'loading' ? 'Signing In...' : 'Sign In'}
				</button>
			</form>
			<div className="my-6 flex items-center">
				<div className="flex-grow border-t border-white/20"></div>
				<span className="mx-4 text-gray-400">or</span>
				<div className="flex-grow border-t border-white/20"></div>
			</div>
			<button
				onClick={handleGoogleSignIn}
				className="w-full py-3 rounded-lg bg-white/90 text-gray-800 font-semibold flex items-center justify-center gap-2 hover:bg-white transition-colors"
			>
				<GoogleIcon />
				Sign In with Google
			</button>
			<p className="text-center text-gray-400 mt-8">
				Don't have an account?{' '}
				<Link to="/signup" className="font-semibold text-indigo-400 hover:underline">
					Sign Up
				</Link>
			</p>
		</AuthLayout>
	);
}