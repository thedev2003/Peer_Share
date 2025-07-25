import { Heart, MessageCircle, Tag, Package } from 'lucide-react';

function ProductCard({ product }) {
	const [isFavorited, setIsFavorited] = useState(false);
	const {
		name = 'No Name',
		price = 0,
		category = 'Uncategorized',
		seller = 'Unknown',
		imageUrl = 'https://placehold.co/600x400/cccccc/ffffff?text=No+Image'
	} = product;

	return (
		<div className="w-full rounded-2xl overflow-hidden group transition-all duration-300 ease-in-out transform hover:scale-105 hover:-translate-y-1">
			<div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-1 shadow-2xl shadow-black/40 h-full flex flex-col">
				<div className="relative rounded-xl overflow-hidden">
					<img
						src={imageUrl}
						alt={name}
						onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/ef4444/ffffff?text=Image+Error'; }}
						className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10"></div>
					<button
						onClick={() => setIsFavorited(!isFavorited)}
						className="absolute top-3 right-3 p-2 rounded-full bg-white/20 backdrop-blur-lg transition-colors duration-300 hover:bg-white/30"
						aria-label="Favorite"
					>
						<Heart className={`w-5 h-5 transition-all ${isFavorited ? 'text-red-500 fill-current' : 'text-white'}`} />
					</button>
				</div>
				<div className="p-4 flex-grow flex flex-col">
					<p className="text-xs font-semibold text-indigo-300 uppercase tracking-wider flex items-center gap-1"><Package size={14} /> {category}</p>
					<h3 className="text-xl font-bold truncate mt-1 flex-grow">{name}</h3>
					<div className="mt-2 flex justify-between items-center">
						<p className="text-sm text-gray-400">Seller: <span className="font-semibold text-gray-200">{seller}</span></p>
						<p className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-400">
							<Tag size={16} className="inline-block mr-1" />₹{price.toLocaleString('en-IN')}
						</p>
					</div>
					<div className="mt-4 pt-4 border-t border-white/20">
						<button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-500/50 text-white font-semibold transition-all duration-300 hover:bg-indigo-500/80 hover:shadow-lg hover:shadow-indigo-500/30">
							<MessageCircle size={18} />
							<span>Contact Seller</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
export default ProductCard;