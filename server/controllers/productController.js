import { v2 as cloudinary } from 'cloudinary';
// ...rest of imports

export const deleteProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (!product) {
			return res.status(404).json({ message: 'Product not found' });
		}
		if (product.seller.toString() !== req.user.id) {
			return res.status(401).json({ message: 'User not authorized' });
		}

		// Extract public_id from Cloudinary URL (example assumes URL contains public_id)
		const imageUrl = product.imageUrl;
		const publicIdMatch = imageUrl.match(/\/([^\/]+)\.[a-z]+$/); // gets 'public_id' out of cloudinary url
		if (publicIdMatch) {
			await cloudinary.uploader.destroy(`HostelMarketplace/${publicIdMatch[1]}`);
		}

		await product.remove();
		res.json({ message: 'Product removed' });
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
};