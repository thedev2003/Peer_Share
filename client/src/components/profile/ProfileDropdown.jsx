import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Tag as TagIcon, LogOut, Sun, Moon } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';

function MenuItem({ icon, text, onClick }) {
	return (
		<button
			onClick={onClick}
			className="w-full flex items-center gap-3 px-2 py-2 text-left text-gray-300 hover:bg-white/10 rounded-md transition-colors"
		>
			{icon}
			<span>{text}</span>
		</button>
	);
}

export default function ProfileDropdown({ user, onLogout }) {
	const [isOpen, setIsOpen] = useState(false);
	const [theme, setTheme] = useState('dark');

	const toggleTheme = () => {
		const newTheme = theme === 'dark' ? 'light' : 'dark';
		setTheme(newTheme);
		if (newTheme === 'dark') {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	};

	const getInitials = (name) => {
		if (!name) return 'U';
		const names = name.split(' ');
		return names.length > 1 ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase() : name[0].toUpperCase();
	};

	const menuVariants = {
		closed: { opacity: 0, height: 0, transition: { type: 'spring', stiffness: 400, damping: 40 } },
		open: { opacity: 1, height: 'auto', transition: { type: 'spring', stiffness: 400, damping: 40 } }
	};

	return (
		<div className="relative" onMouseLeave={() => setIsOpen(false)}>
			<motion.button
				onClick={() => setIsOpen(!isOpen)}
				whileTap={{ scale: 0.95 }}
				className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xl border-2 border-indigo-400 shadow-lg"
			>
				{getInitials(user.name)}
			</motion.button>

			<AnimatePresence>
				{isOpen && (
					<motion.div
						variants={menuVariants}
						initial="closed"
						animate="open"
						exit="closed"
						className="absolute top-16 right-0 w-64 rounded-xl bg-black/30 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden z-10"
						style={{ originY: 0 }}
					>
						<div className="p-4 border-b border-white/20">
							<p className="font-bold text-white">{user.name}</p>
							<p className="text-sm text-gray-400">Student</p>
						</div>
						<div className="p-2">
							<MenuItem icon={<ShoppingBag size={18} />} text="My Purchases" />
							<MenuItem icon={<TagIcon size={18} />} text="My Items on Sale" />
							<div className="px-2 py-2 flex justify-between items-center text-gray-300 hover:bg-white/10 rounded-md cursor-pointer transition-colors">
								<div className="flex items-center gap-3">
									{theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
									<span>Theme</span>
								</div>
								<ThemeToggle isDark={theme === 'dark'} onToggle={toggleTheme} />
							</div>
							<MenuItem icon={<LogOut size={18} />} text="Logout" onClick={onLogout} />
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
