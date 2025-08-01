import Sidebar from '../components/ui/Sidebar';
import TagSearch from '../components/ui/TagSearch';
import ProductCard from '../components/ProductCard';
import AddProductModal from '../components/AddProductModal';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

export default function MarketplacePage() {
	const { user } = useSelector(state => state.auth);
	const [selectedTag, setTag] = useState(null);
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [showModal, setShowModal] = useState(false);

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const response = await axios.get('/api/products');
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

	const clearTag = () => {
		setTag(null);
	};

// Filter products by selected tag, always ensure products is an array
const safeProducts = Array.isArray(products) ? products : [];
const filteredProducts = selectedTag
	? safeProducts.filter(product => product.category === selectedTag)
	: safeProducts;

	// Handle new product addition
	const handleProductAdded = (newProduct) => {
		setProducts(prev => [newProduct, ...prev]);
	};

	return (
		<div className="flex">
			{user && <Sidebar />}
			<div className="flex-1 p-6">
				<h1 className="text-4xl font-bold text-indigo-400 mb-2">Peer Share</h1>
				<p className="mb-2">Buy and sell items within your college campus.</p>
				<TagSearch selectedTag={selectedTag} setTag={setTag} clearTag={clearTag} />
	{/* Fixed Sell Item Button in bottom right */}
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
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
						{filteredProducts.length === 0 ? (
							<div className="col-span-full text-center text-gray-600">No products found.</div>
						) : (
							filteredProducts.map(product => (
								<ProductCard key={product._id || product.id} product={product} />
							))
						)}
					</div>
				)}
			</div>
		</div>
	);
}