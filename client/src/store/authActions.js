import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// --- Async Thunk to handle user login ---
export const loginUser = createAsyncThunk(
	'auth/loginUser',
	async ({ email, password }, { rejectWithValue }) => {
		try {
			const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
			localStorage.setItem('token', response.data.token);
			return response.data.token;
		} catch (err) {
			return rejectWithValue(err.response.data.message || 'Login failed');
		}
	}
);

// --- Async Thunk to handle user registration ---
export const registerUser = createAsyncThunk(
	'auth/registerUser',
	async ({ username, email, password }, { rejectWithValue }) => {
		try {
			const response = await axios.post('http://localhost:5000/api/auth/register', { username, email, password });
			localStorage.setItem('token', response.data.token);
			return response.data.token;
		} catch (err) {
			return rejectWithValue(err.response.data.message || 'Registration failed');
		}
	}
);

// --- Async Thunk to fetch user profile if a token exists ---
export const fetchUserByToken = createAsyncThunk(
	'auth/fetchUserByToken',
	async (token, { rejectWithValue }) => {
		try {
			const config = { headers: { Authorization: `Bearer ${token}` } };
			const response = await axios.get('http://localhost:5000/api/users/me', config);
			return { user: response.data, token };
		} catch (err) {
			return rejectWithValue('Session expired or token is invalid.');
		}
	}
);
