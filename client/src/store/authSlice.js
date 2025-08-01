import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { loginUser, registerUser, fetchUserByToken } from './authActions';

// The initial state of the authentication slice.
const initialState = {
	user: null, // Holds user data (e.g., name, email) after successful login.
	token: localStorage.getItem('token') || null, // Tries to get the token from localStorage to keep the user logged in.
	status: 'idle', // Represents the current status of async operations: 'idle' | 'loading' | 'succeeded' | 'failed'.
	error: null, // Stores any error messages from failed async operations.
	isInitialized: false, // Tracks whether the initial token-based authentication check has been performed.
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	// Reducers are functions that handle synchronous state updates.
	reducers: {
		// The logout reducer resets the authentication state.
		logout: (state) => {
			// Remove the token from local storage to invalidate the session.
			localStorage.removeItem('token');
			// Remove the Authorization header from future Axios requests.
			delete axios.defaults.headers.common['Authorization'];
			// Reset all authentication-related state.
			state.user = null;
			state.token = null;
			state.status = 'idle';
			state.error = null;
			// CRITICAL: Reset the initialization status. This forces the app to re-validate
			// authentication on the next load, even if the user navigates back to a cached page.
			state.isInitialized = false;
		},
		// The setToken reducer is used to manually set the token, e.g., after an OAuth callback.
		setToken: (state, action) => {
			state.token = action.payload;
			localStorage.setItem('token', action.payload);
		}
	},
	// ExtraReducers handle state updates for async actions (thunks) defined elsewhere.
	extraReducers: (builder) => {
		builder
			// Cases for the loginUser async thunk
			.addCase(loginUser.pending, (state) => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.token = action.payload;
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload;
			})
			// Cases for the registerUser async thunk
			.addCase(registerUser.pending, (state) => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(registerUser.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.token = action.payload;
			})
			.addCase(registerUser.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload;
			})
			// Cases for the fetchUserByToken async thunk (used for session persistence)
			.addCase(fetchUserByToken.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(fetchUserByToken.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.user = action.payload.user;
				state.token = action.payload.token;
				// Set the auth header for all subsequent Axios requests.
				axios.defaults.headers.common['Authorization'] = `Bearer ${action.payload.token}`;
				// Mark the app as initialized after the first token check.
				state.isInitialized = true;
			})
			.addCase(fetchUserByToken.rejected, (state) => {
				// If the token is invalid, clear the state and mark as initialized.
				state.status = 'failed';
				state.user = null;
				state.token = null;
				state.isInitialized = true;
				localStorage.removeItem('token');
				delete axios.defaults.headers.common['Authorization'];
			});
	},
});

// Export the synchronous actions to be used in components.
export const { logout, setToken } = authSlice.actions;
// Export the reducer to be included in the Redux store.
export default authSlice.reducer;
