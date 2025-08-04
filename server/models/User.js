import mongoose from 'mongoose';
import findOrCreate from 'mongoose-findorcreate';

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		trim: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		// Add validation to ensure it's a college email if needed
		// match: [/@college\.edu$/, 'Please use your official college email.'] 
	},
	password: { // Will be null for Google Sign-In users
		type: String,
		required: false,
	},
	googleId: { // To store the user's unique Google ID
		type: String,
		required: false,
	},
	profilePicture: {
		type: String,
		default: 'https://placehold.co/100x100/663399/FFFFFF?text=U',
	},
	itemsSold: [
		{ type: mongoose.Schema.Types.ObjectId, 
			ref: 'Product' 
		}
	],
	itemsPurchased: [
		{ type: mongoose.Schema.Types.ObjectId, 
			ref: 'Product' 
		}
	]
}, { timestamps: true });

// This plugin is very useful for Passport's Google strategy
userSchema.plugin(findOrCreate);

const User = mongoose.model('User', userSchema);
export default User;