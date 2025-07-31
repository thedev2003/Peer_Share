import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HeroSVG from "../assets/welcome.svg"; // Your illustration SVG

// Typing and backspace effect for the main tagline
function useTypingEffect(text, speed = 80, delay = 1200) {
	const [displayed, setDisplayed] = useState("");
	const [backspacing, setBackspacing] = useState(false);

	useEffect(() => {
		let timeout;
		if (!backspacing && displayed.length < text.length) {
			timeout = setTimeout(() => setDisplayed(text.slice(0, displayed.length + 1)), speed);
		} else if (!backspacing && displayed.length === text.length) {
			timeout = setTimeout(() => setBackspacing(true), delay);
		} else if (backspacing && displayed.length > 0) {
			timeout = setTimeout(() => setDisplayed(text.slice(0, displayed.length - 1)), speed / 1.5);
		} else if (backspacing && displayed.length === 0) {
			timeout = setTimeout(() => setBackspacing(false), speed);
		}
		return () => clearTimeout(timeout);
	}, [displayed, backspacing, text, speed, delay]);

	return displayed;
}

export default function HomePage() {
	const tagline = useTypingEffect("Clutter to Cash in a Flash", 80, 1200);

	return (
		<div className="min-h-screen bg-[#161b22] flex flex-col items-center justify-center px-4">
			<div className="flex flex-col md:flex-row items-center gap-12 max-w-4xl w-full mb-8">
				{/* Illustration */}
				<div className="w-full md:w-1/2 flex justify-center">
					<img src={HeroSVG} alt="Welcome" className="w-72 md:w-96" />
				</div>
				{/* Hero Section */}
				<div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
					<h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
						Welcome to Peer Share
					</h1>
					<p className="text-lg text-indigo-400 font-semibold mb-2">
						Why Buy New?
					</p>
					<p className="text-lg text-gray-300 mb-10">
						Find what you need and share what you don't
					</p>
					<div className="flex gap-4 mb-8">
						<Link
							to="/login"
							className="px-6 py-3 rounded-full bg-indigo-600 text-white font-semibold shadow-lg hover:bg-indigo-700 transition"
						>
							Login
						</Link>
						<Link
							to="/signup"
							className="px-6 py-3 rounded-full bg-gray-800 border border-indigo-500 text-indigo-400 font-semibold hover:bg-indigo-900 transition"
						>
							Sign Up
						</Link>
					</div>
				</div>
			</div>
			{/* Bottom Section: Typing effect */}
			<div className="absolute bottom-10 w-full flex justify-center">
				<span className="text-2xl font-bold text-indigo-400 tracking-wide">
					{tagline}
					<span className="animate-blink ml-1 text-white">|</span>
				</span>
			</div>
			{/* Simple blink animation */}
			<style>{`
        .animate-blink {
          animation: blink 1s steps(2, start) infinite;
        }
        @keyframes blink {
          to { visibility: hidden; }
        }
      `}</style>
		</div>
	);
}