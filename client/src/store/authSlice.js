import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { loginUser, registerUser, fetchUserByToken } from './authActions';

// The original initial state for the authentication slice.
const initialState = {
	user: null,
	token: localStorage.getItem('token') || null,
	status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
	error: null,
	isInitialized: false, // Tracks if the initial token check has been done.
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		logout: (state) => {
			localStorage.removeItem('token');
			delete axios.defaults.headers.common['Authorization'];
			state.user = null;
			state.token = null;
			state.status = 'idle';
			state.error = null;
			state.isInitialized = false; // Reset for re-authentication checks.
		},
		setToken: (state, action) => {
			state.token = action.payload;
			localStorage.setItem('token', action.payload);
		}
	},
	// Reverting to the original extraReducers with separate cases for each thunk.
	extraReducers: (builder) => {
		builder
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
			.addCase(fetchUserByToken.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(fetchUserByToken.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.user = action.payload.user;
				state.token = action.payload.token;
				axios.defaults.headers.common['Authorization'] = `Bearer ${action.payload.token}`;
				state.isInitialized = true;
			})
			.addCase(fetchUserByToken.rejected, (state) => {
				state.status = 'failed';
				state.user = null;
				state.token = null;
				state.isInitialized = true;
				localStorage.removeItem('token');
				delete axios.defaults.headers.common['Authorization'];
			});
	},
});

export const { logout, setToken } = authSlice.actions;
export default authSlice.reducer;
