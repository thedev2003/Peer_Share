import { useEffect, useState } from "react";

export default function WelcomeNotification({ name }) {
	const [visible, setVisible] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => setVisible(false), 4000);
		return () => clearTimeout(timer);
	}, []);

	if (!visible) return null;

	return (
		<div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2 font-semibold text-lg transition-all duration-300">
			<span>Welcome {name}!</span>
		</div>
	);
}