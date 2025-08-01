import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HeroSVG from "../assets/hero.svg"; // Ensure your SVG is in this location

// Typing effect for tagline
function useTypingEffect(text, speed = 70, delay = 1600) {
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
			timeout = setTimeout(() => setBackspacing(false), speed * 3);
		}
		return () => clearTimeout(timeout);
	}, [displayed, backspacing, text, speed, delay]);

	return displayed;
}

export default function HomePage() {
	const tagline = useTypingEffect("Find deals. Share stuff. It's that simple.", 50, 1300);

	return (
		<div className="min-h-screen bg-[#161b22] flex flex-col justify-center items-center px-4 relative overflow-hidden">
			<div className="flex flex-col md:flex-row items-center max-w-4xl w-full mx-auto py-10 gap-10">
				{/* Welcome Illustration */}
				<div className="w-full md:w-1/2 flex justify-center items-center">
					<img
						src={HeroSVG}
						alt="Peer Share Welcome"
						className="w-64 h-64 md:w-[22rem] md:h-[22rem] object-contain drop-shadow-lg rounded-xl bg-[#1f2632] p-4"
						style={{ boxShadow: "0 4px 24px 0 rgba(70, 88, 128, 0.12)" }}
					/>
				</div>
				{/* Welcome Text and Actions */}
				<div className="w-full md:w-1/2 flex flex-col gap-4 items-center md:items-start text-center md:text-left">
					<h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 tracking-tight drop-shadow-md">
						Welcome to Peer Share
					</h1>
					<p className="text-lg md:text-xl font-semibold text-indigo-400 mb-1 tracking-wide">
						Why Buy New?
					</p>
					<p className="text-base md:text-lg text-gray-300 mb-6">
						Find what you need and share what you don't.
					</p>

					<div className="flex gap-4 mb-4">
						<Link
							to="/login"
							className="px-6 py-3 rounded-full bg-indigo-600 text-white font-semibold shadow-md hover:bg-pink-500 transition-colors duration-200"
						>
							Login
						</Link>
						<Link
							to="/signup"
							className="px-6 py-3 rounded-full bg-yellow-400 text-[#161b22] font-semibold border-2 border-indigo-600 shadow-md hover:bg-yellow-300 transition-colors duration-200"
						>
							Sign Up
						</Link>
					</div>
				</div>
			</div>
			{/* Typing Effect Tagline */}
			<div className="absolute bottom-10 w-full flex justify-center pointer-events-none">
				<span className="text-xl md:text-2xl font-bold text-indigo-400 tracking-wide bg-[#161b22] px-4 py-2 rounded-full shadow-lg">
					{tagline}
					<span className="ml-1 animate-blink text-green-600 font-extrabold select-none">|</span>
				</span>
			</div>
			{/* Blinking cursor animation */}
			<style>{`
        .animate-blink {
          animation: blink 1.1s steps(2, start) infinite;
        }
        @keyframes blink {
          to { visibility: hidden; }
        }
      `}</style>
		</div>
	);
}