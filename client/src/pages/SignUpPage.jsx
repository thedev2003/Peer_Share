import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../store/authActions';
import AuthLayout from '../components/layouts/AuthLayout';
import { User, Mail, Lock, AlertCircle } from 'lucide-react';
import GoogleIcon from '../components/ui/GoogleIcon';

export default function SignUpPage() {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { status, error } = useSelector((state) => state.auth);

	const handleSubmit = (e) => {
		e.preventDefault();
		dispatch(registerUser({ username, email, password }))
			.unwrap()
			.then(() => {
				navigate('/'); // Redirect to homepage on successful signup
			})
			.catch((err) => { });
	};

	const handleGoogleSignIn = () => {
		window.open(`${process.env.RENDER_URL}/api/auth/google`, '_self');
	};

	return (
		<AuthLayout title="Create Account" subtitle="Join the community and start trading.">
			<form onSubmit={handleSubmit} className="space-y-6">
				{error && (
					<div className="bg-red-500/20 text-red-300 p-3 rounded-lg flex items-center gap-2">
						<AlertCircle size={20} />
						<span>{error}</span>
					</div>
				)}
				<div className="relative">
					<User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
					<input
						type="text"
						placeholder="Full Name"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
						required
					/>
				</div>
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
					{status === 'loading' ? 'Creating Account...' : 'Create Account'}
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
				Sign Up with Google
			</button>
			<p className="text-center text-gray-400 mt-8">
				Already have an account?{' '}
				<Link to="/login" className="font-semibold text-indigo-400 hover:underline">
					Sign In
				</Link>
			</p>
		</AuthLayout>
	);
}