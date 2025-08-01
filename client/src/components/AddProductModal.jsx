import { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const TAGS = ['Electronics', 'Furniture', 'Vehicles', 'Books', 'Gadgets', 'Sports', 'Other'];

/**
 * A modal component for adding a new product to the marketplace.
 * It includes a form for product details and handles the API submission.
 */
export default function AddProductModal({ onClose, onProductAdded }) {
	const [formData, setFormData] = useState({
		name: '',
		description: '',
		price: '',
		category: TAGS[0], // Default to the first tag
	});
	const [image, setImage] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { token } = useSelector(state => state.auth);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleImageChange = (e) => {
		setImage(e.target.files[0]);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!image) {
			setError('Please upload an image for the product.');
			return;
		}
		setLoading(true);
		setError(null);

		const submissionData = new FormData();
		submissionData.append('name', formData.name);
		submissionData.append('description', formData.description);
		submissionData.append('price', formData.price);
		submissionData.append('category', formData.category);
		submissionData.append('image', image);

		try {
			const response = await axios.post('/api/products', submissionData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					'Authorization': `Bearer ${token}`,
				},
			});
			onProductAdded(response.data); // Pass the newly created product back to the parent
			onClose(); // Close the modal on success
		} catch (err) {
			setError(err.response?.data?.message || 'Failed to create product. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
				<h2 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-white">Sell Your Item</h2>
				{error && <p className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</p>}
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Product Name</label>
						<input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
					</div>
					<div>
						<label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
						<textarea name="description" id="description" value={formData.description} onChange={handleChange} required rows="3" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
					</div>
					<div className="flex gap-4">
						<div className="flex-1">
							<label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price (₹)</label>
							<input type="number" name="price" id="price" value={formData.price} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
						</div>
						<div className="flex-1">
							<label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
							<select name="category" id="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
								{TAGS.map(tag => <option key={tag} value={tag}>{tag}</option>)}
							</select>
						</div>
					</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Product Image</label>
					<div className="flex items-center gap-2 mt-1">
						<input
							type="file"
							name="image"
							id="image"
							onChange={handleImageChange}
							required
							accept="image/*"
							style={{ display: 'none' }}
						/>
						<button
							type="button"
							onClick={() => document.getElementById('image').click()}
							className="file:mr-4 file:py-2 file:px-4 px-4 py-2 rounded-full font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
						>
							Choose File
						</button>
						<span className="text-sm text-gray-500">
							{image ? image.name : 'No file chosen'}
						</span>
					</div>
				</div>
					<div className="flex justify-end gap-4 pt-4">
						<button type="button" onClick={onClose} disabled={loading} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50">Cancel</button>
						<button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:bg-indigo-400">
							{loading ? 'Submitting...' : 'Submit Item'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}