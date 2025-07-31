const TAGS = ['Electronics', 'Furniture', 'Vehicles', 'Books', 'Gadgets', 'Sports', 'Other'];

export default function TagSearch({ selectedTag, setTag }) {
	return (
		<div className="flex gap-2 flex-wrap my-4">
			{TAGS.map(tag => (
				<button
					key={tag}
					onClick={() => setTag(tag)}
					className={`px-3 py-1 rounded ${selectedTag === tag ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700'}`}
				>
					{tag}
				</button>
			))}
		</div>
	);
}