const TAGS = ['Electronics', 'Furniture', 'Vehicles', 'Books', 'Gadgets', 'Sports', 'Other'];

export default function TagSearch({ selectedTag, setTag, clearTag }) {
	return (
		<div className="flex gap-2 flex-wrap my-4 items-center">
			{TAGS.map(tag => (
				<button
					key={tag}
					onClick={() => setTag(tag)}
					className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${selectedTag === tag ? 'bg-indigo-500 text-white shadow-md' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
				>
					{tag}
				</button>
			))}
			{/* The "Clear" button is only rendered if a tag is currently selected. */}
			{selectedTag && (
				<button
					onClick={clearTag}
					className="px-3 py-1 rounded-full text-sm font-medium text-red-500 bg-red-100 dark:bg-red-900/50 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900 transition-colors"
				>
					Clear
				</button>
			)}
		</div>
	);
}