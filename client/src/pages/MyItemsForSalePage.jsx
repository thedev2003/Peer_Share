import { useSelector } from 'react-redux';
import ProductCard from '../components/ProductCard';

export default function MyItemsForSalePage({ products, onProductRemoved }) {
	const { user } = useSelector(state => state.auth);

	// Filter products where I am the seller
	const myProducts = products.filter(
		p => user && (p.seller._id === user._id || p.seller === user._id)
	);

	return (
		<div className="p-6">
			<h2 className="text-2xl font-bold text-indigo-400 mb-4">My Items for Sale</h2>
			<div className="flex flex-wrap gap-6">
				{myProducts.length === 0 ? (
					<div className="text-gray-500">No items for sale.</div>
				) : (
					myProducts.map(product => (
						<ProductCard
							key={product._id}
							product={product}
							onProductRemoved={onProductRemoved}
						/>
					))
				)}
			</div>
		</div>
	);
}