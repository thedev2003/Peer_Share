import { createSlice, createAsyncThunk, nanoid } from '@reduxjs/toolkit';

// Async thunk to show a notification and automatically remove it after a delay
export const showNotification = createAsyncThunk(
	'notifications/show',
	async ({ message, type = 'info' }, { dispatch }) => {
		const id = nanoid(); // Generate a unique ID for the notification
		dispatch(addNotification({ id, message, type }));

		// Wait for 3 seconds before removing the notification
		await new Promise(resolve => setTimeout(resolve, 3000));

		dispatch(removeNotification(id));
		return id;
	}
);

const notificationsSlice = createSlice({
	name: 'notifications',
	initialState: [], // The state will be an array of notification objects
	reducers: {
		addNotification: (state, action) => {
			// action.payload should be { id, message, type }
			state.push(action.payload);
		},
		removeNotification: (state, action) => {
			// action.payload should be the id of the notification to remove
			return state.filter(notification => notification.id !== action.payload);
		},
	},
});

export const { addNotification, removeNotification } = notificationsSlice.actions;
export default notificationsSlice.reducer;