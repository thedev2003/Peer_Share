import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';

// Import route handlers
import productRoutes from './routes/products.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import noCache from './middleware/cacheControl.js'; // Import the cache control middleware

// Import configurations
import configurePassport from './config/passport.js';
import initializeSocket from './socket/socketHandler.js';

// --- Initial Configuration ---
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP server and Socket.IO server
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
	cors: {
		origin: "http://localhost:5173", // Allow frontend to connect
		methods: ["GET", "POST"],
	}
});

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
	.then(() => console.log('MongoDB Connected...'))
	.catch(err => console.error('MongoDB Connection Error:', err));

// --- Core Middleware ---
app.use(cors({
	origin: 'http://localhost:5173',
	credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Passport Middleware Setup ---
app.use(passport.initialize());
configurePassport(passport);

// --- API Routes ---
app.use('/api/auth', authRoutes);
// Apply the noCache middleware to all protected routes to prevent browser caching.
app.use('/api/products', noCache, productRoutes);
app.use('/api/users', noCache, userRoutes); // Add the user routes

// --- Initialize Socket.IO Handler ---
initializeSocket(io);

// --- Server Listener ---
httpServer.listen(PORT, () => {
	console.log(`Server is running on port: ${PORT}`);
});