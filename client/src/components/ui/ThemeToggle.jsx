import React from 'react';
import { motion } from 'framer-motion';

export default function ThemeToggle({ isDark, onToggle }) {
	return (
		<button
			onClick={onToggle}
			className={`relative w-12 h-6 rounded-full flex items-center transition-colors ${isDark ? 'bg-indigo-600' : 'bg-gray-400'}`}
			aria-label="Toggle theme"
		>
			<motion.div
				className="w-5 h-5 bg-white rounded-full shadow-md"
				layout
				transition={{ type: 'spring', stiffness: 700, damping: 30 }}
				style={{
					position: 'absolute',
					left: isDark ? 'auto' : '2px',
					right: isDark ? '2px' : 'auto'
				}}
			/>
		</button>
	);
}
