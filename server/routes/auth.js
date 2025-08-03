import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { registerUser, loginUser, logoutUser } from '../controllers/authController.js';

const router = express.Router();
const CLIENT_URL = process.env.VERCEL_URL;

// --- Standard Authentication ---
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

// --- Google OAuth Authentication ---
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
	passport.authenticate('google', {
		// failureRedirect: `http://localhost:5173/login`, // Redirect on fail
		failureRedirect: `${CLIENT_URL}/login`, // Redirect on fail
		session: false // We are using JWTs, not sessions
	}),
	(req, res) => {
		if(!req.user) {
			return res.redirect(`${CLIENT_URL}/login?error=auth_failed`);
		}
		// On success, Passport attaches the user to req.user.
		const payload = { id: req.user.id, username: req.user.username };

		// We generate a JWT and redirect back to the frontend with the token.
		const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' });
		res.redirect(`${CLIENT_URL}/auth/callback?token=${token}`);
	}
);

export default router;