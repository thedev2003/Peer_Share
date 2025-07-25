import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';
import multer from 'multer';


dotenv.config();

// Configure Cloudinary with your credentials
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer to use Cloudinary for storage
const storage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: {
		folder: 'HostelMarketplace', // The name of the folder in Cloudinary
		allowedFormats: ['jpeg', 'png', 'jpg'],
		// You can apply transformations here if needed
		// transformation: [{ width: 500, height: 500, crop: 'limit' }]
	},
});

export const parser = multer({ storage: storage });