import Sidebar from '../components/ui/Sidebar';
import TagSearch from '../components/ui/TagSearch';
import ProductCard from '../components/ProductCard';
import AddProductModal from '../components/AddProductModal';
import WelcomeNotification from '../components/ui/WelcomeNotification';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

export default function MarketplacePage() {
	const { user } = useSelector(state => state.auth);
	const location = useLocation();

	const [selectedTag, setTag] = useState(null);
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [showWelcome, setShowWelcome] = useState(false);

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const API_URL = import.meta.env.VITE_RENDER_URL || window.location.origin;
				const url = `${API_URL.replace(/\/$/, '')}/api/products`;
				const response = await axios.get(url);
				const data = Array.isArray(response.data) ? response.data : [];
				setProducts(data);
			} catch (err) {
				console.error('Product fetch error:', err);
				setError('Could not connect to the server.');
			} finally {
				setLoading(false);
			}
		};
		fetchProducts();
	}, []);

	useEffect(() => {
		if (user?.username) {
			const welcomedKey = `welcomed_${user.username}`;
			if (!sessionStorage.getItem(welcomedKey)) {
				setShowWelcome(true);
				sessionStorage.setItem(welcomedKey, "true");
			}
		}
	}, [user?.username]);

	const clearTag = () => setTag(null);

	// "My items for sale" routing logic
	let pageProducts = products;
	if (location.pathname === "/my-items" && user) {
		pageProducts = products.filter(p => {
			const sellerId = p.seller?._id || p.seller;
			return sellerId === user._id;
		});
	}

	// Only show products that are not sold (schema uses "Available")
	const availableProducts = pageProducts.filter(p =>
		typeof p.status === "string" && p.status === "Available"
	);

	// Tag filter, case-insensitive
	const filteredProducts = selectedTag
		? availableProducts.filter(product =>
			product.category?.toLowerCase() === selectedTag.toLowerCase()
		)
		: availableProducts;

	const handleProductAdded = (newProduct) => {
		setProducts(prev => [newProduct, ...prev]);
	};

	const handleProductRemoved = (removedId) => {
		setProducts(prev => prev.filter(p => p._id !== removedId));
	};

	return (
		<div className="flex flex-col sm:flex-row min-h-screen bg-gray-900 text-white">
			{user && <Sidebar />}
			<div className="flex-1 p-3 sm:p-6 relative">
				{user?.username && showWelcome && (
					<WelcomeNotification name={user.username} />
				)}
				<h1 className="text-4xl font-bold text-indigo-400 mb-2">Peer Share</h1>
				<p className="mb-2">Buy and sell items within your college campus.</p>
				<TagSearch selectedTag={selectedTag} setTag={setTag} clearTag={clearTag} />
				<button
					className="fixed bottom-8 right-8 px-6 py-3 rounded-full font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg transition-all z-50"
					onClick={() => setShowModal(true)}
				>
					Sell Your Item
				</button>
				{showModal && (
					<AddProductModal
						onClose={() => setShowModal(false)}
						onProductAdded={handleProductAdded}
					/>
				)}
				{loading ? (
					<div className="text-center text-gray-400">Loading products...</div>
				) : error ? (
					<div className="text-center text-red-500 mb-4">{error}</div>
				) : (
					<div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6">
						{filteredProducts.length === 0 ? (
							<div className="text-gray-500">
								No products found.<br />
								Try adding a new item or clearing filters.
							</div>
						) : (
							filteredProducts.map(product => (
								<ProductCard
									key={product._id}
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