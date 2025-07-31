// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Search } from 'lucide-react';
// import ProductCard from '../components/ProductCard'; // Assumes ProductCard is in a separate file

// const INITIAL_VISIBLE_COUNT = 6;

// // Expanded mock data to use as a fallback if the backend isn't running
// const mockProducts = [
// 	{ id: 1, name: 'Hercules Roadeo Bicycle', price: 4500, category: 'Vehicles', seller: 'Rohan S.', imageUrl: 'https://placehold.co/600x400/3498db/ffffff?text=Bicycle' },
// 	{ id: 2, name: 'Usha Air Cooler', price: 3200, category: 'Electronics', seller: 'Priya K.', imageUrl: 'https://placehold.co/600x400/2ecc71/ffffff?text=Cooler' },
// 	{ id: 3, name: 'TP-Link WiFi Router', price: 1200, category: 'Electronics', seller: 'Amit V.', imageUrl: 'https://placehold.co/600x400/9b59b6/ffffff?text=Router' },
// 	{ id: 4, name: 'Dell Inspiron Laptop', price: 28000, category: 'Electronics', seller: 'Sneha M.', imageUrl: 'https://placehold.co/600x400/f1c40f/ffffff?text=Laptop' },
// 	{ id: 5, name: 'Bose QuietComfort 35', price: 9500, category: 'Gadgets', seller: 'Vikram R.', imageUrl: 'https://placehold.co/600x400/e74c3c/ffffff?text=Headphones' },
// 	{ id: 6, name: 'Study Table & Chair', price: 2500, category: 'Furniture', seller: 'Anjali G.', imageUrl: 'https://placehold.co/600x400/1abc9c/ffffff?text=Furniture' },
// 	{ id: 7, name: 'Samsung 24" Monitor', price: 7000, category: 'Electronics', seller: 'Rohan S.', imageUrl: 'https://placehold.co/600x400/34495e/ffffff?text=Monitor' },
// 	{ id: 8, name: 'Used Textbooks (SEM 5)', price: 800, category: 'Books', seller: 'Priya K.', imageUrl: 'https://placehold.co/600x400/d35400/ffffff?text=Books' },
// ];

// export default function MarketplacePage() {
// 	const [products, setProducts] = useState([]);
// 	const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
// 	const [loading, setLoading] = useState(true);
// 	const [error, setError] = useState(null);

// 	useEffect(() => {
// 		const fetchProducts = async () => {
// 			try {
// 				const response = await axios.get('http://localhost:5000/api/products');
// 				setProducts(response.data);
// 			} catch (err) {
// 				console.error("Failed to fetch products from backend:", err);
// 				setError('Could not connect to the server. Displaying sample data.');
// 				setProducts(mockProducts);
// 			} finally {
// 				setLoading(false);
// 			}
// 		};
// 		fetchProducts();
// 	}, []);

// 	const showMoreItems = () => {
// 		setVisibleCount(products.length);
// 	};

// 	return (
// 		<div className="container mx-auto px-4 py-8">
// 			<header className="text-center mb-12">
// 				<h1 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
// 					Hostel Marketplace
// 				</h1>
// 				<p className="mt-2 text-lg text-gray-400">Buy and sell items within your college campus.</p>
// 			</header>
// 			<div className="mb-8 flex justify-center">
// 				<div className="w-full max-w-lg relative">
// 					<input type="text" placeholder="Search for items..." className="w-full pl-12 pr-4 py-3 rounded-full bg-white/10 border border-white/20 backdrop-blur-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300" />
// 					<Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
// 				</div>
// 			</div>
// 			{loading ? (
// 				<div className="text-center text-gray-400">Loading products...</div>
// 			) : (
// 				<>
// 					{error && <div className="text-center text-yellow-500 mb-4">{error}</div>}
// 					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
// 						{products.slice(0, visibleCount).map(product => (
// 							<ProductCard key={product.id} product={product} />
// 						))}
// 					</div>
// 				</>
// 			)}
// 			{!loading && visibleCount < products.length && (
// 				<div className="text-center mt-12">
// 					<button
// 						onClick={showMoreItems}
// 						className="px-8 py-3 rounded-full font-semibold text-white bg-indigo-600 bg-opacity-50 border border-indigo-500 backdrop-blur-lg hover:bg-opacity-75 transition-all duration-300 transform hover:scale-105"
// 					>
// 						Show More
// 					</button>
// 				</div>
// 			)}
// 		</div>
// 	);
// }






import Sidebar from '../components/ui/Sidebar';
import TagSearch from '../components/ui/TagSearch';
import { useState } from 'react';
import { useSelector } from 'react-redux';

export default function MarketplacePage() {
	const { user } = useSelector(state => state.auth);
	const [selectedTag, setTag] = useState(null);

	return (
		<div className="flex">
			{user && <Sidebar />}
			<div className="flex-1 p-6">
				<h1 className="text-4xl font-bold text-indigo-400 mb-2">Peer Share</h1>
				<p className="mb-2">Buy and sell items within your college campus.</p>
				<TagSearch selectedTag={selectedTag} setTag={setTag} />
				{/* Item search and listing logic here, filtered by selectedTag */}
			</div>
		</div>
	);
}