import passport from 'passport';

/**
 * Middleware to protect routes that require authentication.
 * It uses the 'jwt' strategy defined in passport.js.
 * This is the gatekeeper for all protected API endpoints.
 */
export const authRequired = (req, res, next) => {
	// Use passport's 'jwt' strategy to authenticate the request
	passport.authenticate('jwt', { session: false }, (err, user, info) => {
		// Handle potential server errors during authentication (e.g., database connection issue)
		if (err) {
			console.error('Authentication error:', err);
			return res.status(500).json({ message: 'An internal error occurred during authentication.' });
		}

		// Handle authentication failure (e.g., invalid/expired token, user not found)
		if (!user) {
			// 'info' can contain details from passport-jwt, like 'TokenExpiredError'
			const message = info?.message || 'You are not authorized to access this resource.';
			return res.status(401).json({ message });
		}

		// If authentication is successful, attach the user object to the request
		req.user = user;
		
		// Proceed to the next middleware or the final route handler
		next();
	})(req, res, next);
};
