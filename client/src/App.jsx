import React from 'react';
import MarketplacePage from './pages/MarketplacePage';

function App() {
	return (
		// Main container with a gradient background that wraps the entire application
		<div className="min-h-screen w-full bg-gray-900 bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 font-sans text-white">
			<MarketplacePage />
		</div>
	);
}

export default App;
