import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import notificationsReducer from './NotificationsSlice';

export const store = configureStore({
	reducer: {
		auth: authReducer,
		notifications: notificationsReducer,
	},
});