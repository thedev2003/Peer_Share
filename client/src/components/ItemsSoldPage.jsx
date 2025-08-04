import { useSelector } from 'react-redux';

export default function ItemsSoldPage({ products }) {
	const { user } = useSelector(state => state.auth);
	// Sold items for this seller
	const soldProducts = products.filter(
		p => p.seller === user._id && p.status === 'sold'
	);

	return (
		<div>
			<h2>My Sold Items</h2>
			<div>
				{soldProducts.length === 0
					? <span>No items sold yet.</span>
					: soldProducts.map(product => (
						<div key={product._id}>
							{product.name} - Sold to {product.buyer.username || product.buyer}
						</div>
					))
				}
			</div>
		</div>
	);
}