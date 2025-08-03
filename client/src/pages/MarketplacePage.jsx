import Sidebar from '../components/ui/Sidebar';
import TagSearch from '../components/ui/TagSearch';
import ProductCard from '../components/ProductCard';
import AddProductModal from '../components/AddProductModal';
import WelcomeNotification from '../components/ui/WelcomeNotification';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

// Main marketplace page showing products, tags, and selling modal
export default function MarketplacePage() {
	const { user } = useSelector(state => state.auth);

	// Local states for tag, products, loading, error, modal visibility, welcome notification
	const [selectedTag, setTag] = useState(null);
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [showWelcome, setShowWelcome] = useState(false);

	// Fetch products from backend on mount
	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const API_URL = import.meta.env.VITE_RENDER_URL || '';
				const url = `${API_URL.replace(/\/$/, '')}/api/products`;
				const response = await axios.get(url);
				const data = Array.isArray(response.data) ? response.data : [];
				setProducts(data);
			} catch (err) {
				setError('Could not connect to the server.');
			} finally {
				setLoading(false);
			}
		};
		fetchProducts();
	}, []);

	// Show welcome notification only once per session
	useEffect(() => {
		if (user?.username) {
			const welcomedKey = `welcomed_${user.username}`;
			if (!sessionStorage.getItem(welcomedKey)) {
				setShowWelcome(true);
				sessionStorage.setItem(welcomedKey, "true");
			}
		}
	}, [user?.username]);

	// Handler to clear tag filter
	const clearTag = () => setTag(null);

	// Filter products by selected tag if any
	const filteredProducts = selectedTag
		? products.filter(product => product.category === selectedTag)
		: products;

	// Handler: add new product to the list after successful modal form submission
	const handleProductAdded = (newProduct) => {
		setProducts(prev => [newProduct, ...prev]);
	};

	// Handler: remove product from list after successful deletion
	const handleProductRemoved = (removedId) => {
		setProducts(prev => prev.filter(p => p._id !== removedId));
	};

	return (
		<div className="flex min-h-screen bg-gray-900 text-white">
			{/* Sidebar for navigation */}
			{user && <Sidebar />}
			<div className="flex-1 p-6 relative">
				{/* Welcome notification at the top, showing for 4 seconds, only once per session */}
				{user?.username && showWelcome && (
					<WelcomeNotification name={user.username} />
				)}

				{/* Page title and tag search */}
				<h1 className="text-4xl font-bold text-indigo-400 mb-2">Peer Share</h1>
				<p className="mb-2">Buy and sell items within your college campus.</p>
				<TagSearch selectedTag={selectedTag} setTag={setTag} clearTag={clearTag} />

				{/* Sell Item Button (opens modal) */}
				<button
					className="fixed bottom-8 right-8 px-6 py-3 rounded-full font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg transition-all z-50"
					onClick={() => setShowModal(true)}
				>
					Sell Your Item
				</button>

				{/* Modal for adding new product */}
				{showModal && (
					<AddProductModal
						onClose={() => setShowModal(false)}
						onProductAdded={handleProductAdded}
					/>
				)}

				{/* Loading and error states */}
				{loading ? (
					<div className="text-center text-gray-400">Loading products...</div>
				) : error ? (
					<div className="text-center text-red-500 mb-4">{error}</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
						{/* Render product cards or no products message */}
						{filteredProducts.length === 0 ? (
							<div className="col-span-full text-center text-gray-600">No products found.</div>
						) : (
							filteredProducts.map(product => (
								<ProductCard
									key={product._id || product.id}
									product={product}
									onProductRemoved={handleProductRemoved}
								/>
							))
						)}
					</div>
				)}
			</div>
		</div>
	);
}