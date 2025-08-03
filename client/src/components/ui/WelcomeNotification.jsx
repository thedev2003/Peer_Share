import { useEffect, useState } from "react";

export default function WelcomeNotification({ name }) {
	const [visible, setVisible] = useState(true);
	const [fade, setFade] = useState(false);

	useEffect(() => {
		// Start fade out after 3.5 seconds, remove after 4 seconds
		const fadeTimeout = setTimeout(() => setFade(true), 3500);
		const hideTimeout = setTimeout(() => setVisible(false), 4000);
		return () => {
			clearTimeout(fadeTimeout);
			clearTimeout(hideTimeout);
		};
	}, []);

	if (!visible) return null;

	return (
		<div
			className={`fixed top-6 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2 font-semibold text-lg 
        transition-opacity duration-500
        ${fade ? "opacity-0" : "opacity-100"}
      `}
		>
			<span>Welcome {name}!</span>
		</div>
	);
}