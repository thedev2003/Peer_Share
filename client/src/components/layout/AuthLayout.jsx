import { motion } from 'framer-motion';

// This component provides a consistent background and centered container for auth pages.
export default function AuthLayout({ children, title, subtitle }) {
	return (
		<div className="min-h-screen w-full flex items-center justify-center bg-gray-900 bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 p-4">
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="w-full max-w-md"
			>
				<div className="bg-black/20 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8">
					<div className="text-center mb-8">
						<h1 className="text-4xl font-extrabold text-white">{title}</h1>
						<p className="text-gray-400 mt-2">{subtitle}</p>
					</div>
					{children}
				</div>
			</motion.div>
		</div>
	);
}