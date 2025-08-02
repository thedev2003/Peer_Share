import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/User.js'; 

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

export default function (passport) {
	// --- Google OAuth 2.0 Strategy ---
	passport.use(new GoogleStrategy({
		clientID: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		callbackURL: `https://peer-share-d613.onrender.com/api/auth/google/callback`
		// callbackURL: "/api/auth/google/callback" // This must match the route
	},
		async (_, __, profile, done) => {
			const newUser = {
				googleId: profile.id,
				username: profile.displayName,
				email: profile.emails[0].value,
				profilePicture: profile.photos[0].value,
			};

			try {
				const { doc: user } = await User.findOrCreate({ googleId: profile.id }, newUser); return done(null, user);
			} catch (err) {
				console.error(err);
				return done(err, null);
			}
		}
	));

	// --- JSON Web Token Strategy ---
	passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
		try {
			const user = await User.findById(jwt_payload.id);
			if (user) {
				return done(null, user);
			}
			return done(null, false);
		} catch (err) {
			console.error(err);
			return done(err, false);
		}
	}));

	// These are required for session-based auth but not strictly for JWT.
	// Including them is good practice for Passport.
	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	passport.deserializeUser((id, done) => {
		User.findById(id, (err, user) => done(err, user));
	});
}
