import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { registerUser, loginUser, logoutUser } from '../controllers/authController.js';

const router = express.Router();

// --- Standard Authentication ---
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

// --- Google OAuth Authentication ---
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
	'/google/callback',
	passport.authenticate('google', {
		failureRedirect: 'http://localhost:5173/login', // Redirect on fail
		session: false // We are using JWTs, not sessions
	}),
	(req, res) => {
		// On success, Passport attaches the user to req.user.
		// We generate a JWT and redirect back to the frontend with the token.
		const payload = { id: req.user.id, username: req.user.username };
		const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' });
		res.redirect(`http://localhost:5173/auth/callback?token=${token}`);
	}
);

export default router;