import { useSelector } from 'react-redux';

export default function ItemsPurchasedPage({ products }) {
	const { user } = useSelector(state => state.auth);
	// Items where current user is buyer and status is sold
	const purchasedProducts = products.filter(
		p => p.buyer === user._id && p.status === 'sold'
	);

	return (
		<div>
			<h2>My Purchased Items</h2>
			<div>
				{purchasedProducts.length === 0
					? <span>No items purchased yet.</span>
					: purchasedProducts.map(product => (
						<div key={product._id}>
							{product.name} - Sold by {product.seller.username || product.seller}
						</div>
					))
				}
			</div>
		</div>
	);
}