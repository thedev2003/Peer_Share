import ProductCard from './ProductCard';
import { useState } from 'react';

export default function MarketplacePage({ products }) {
	const [productList, setProductList] = useState(products);

	// Remove sold product from UI
	const removeFromMarketplace = (productId) => {
		setProductList(list => list.filter(p => p._id !== productId));
	};

	// Update product state (for buyer queue, etc)
	const updateProductState = (productId, newProduct) => {
		setProductList(list => list.map(p => p._id === productId ? { ...p, ...newProduct } : p));
	};

	// Only show products that are not sold
	const availableProducts = productList.filter(p => p.status !== 'sold');

	return (
		<div>
			<h2>Marketplace</h2>
			<div>
				{availableProducts.map(product => (
					<ProductCard
						key={product._id}
						product={product}
						updateProductState={updateProductState}
						removeFromMarketplace={removeFromMarketplace}
					/>
				))}
			</div>
		</div>
	);
}