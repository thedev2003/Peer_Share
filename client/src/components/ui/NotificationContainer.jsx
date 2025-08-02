import { useSelector, useDispatch } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle, X } from 'lucide-react';
import { removeNotification } from '../../store/NotificationsSlice';

// This component will render all active notifications.
export default function NotificationContainer() {
	const notifications = useSelector((state) => state.notifications);
	const dispatch = useDispatch();

	return (
		<div className="fixed top-5 right-5 z-50 w-full max-w-sm">
			<AnimatePresence>
				{notifications.map((notification) => (
					<Notification key={notification.id} {...notification} onDismiss={() => dispatch(removeNotification(notification.id))} />
				))}
			</AnimatePresence>
		</div>
	);
}

// A single notification component with styling and animations.
function Notification({ id, message, type, onDismiss }) {
	const notificationVariants = {
		initial: { opacity: 0, y: -20, scale: 0.9 },
		animate: { opacity: 1, y: 0, scale: 1 },
		exit: { opacity: 0, x: 50, scale: 0.9 },
	};

	const notificationTypeStyles = {
		info: {
			icon: <AlertCircle />,
			bg: 'bg-blue-500/20',
			border: 'border-blue-500',
			text: 'text-blue-300',
		},
		success: {
			icon: <CheckCircle />,
			bg: 'bg-green-500/20',
			border: 'border-green-500',
			text: 'text-green-300',
		},
		error: {
			icon: <AlertCircle />,
			bg: 'bg-red-500/20',
			border: 'border-red-500',
			text: 'text-red-300',
		},
	};

	const styles = notificationTypeStyles[type] || notificationTypeStyles.info;

	return (
		<motion.div
			layout
			variants={notificationVariants}
			initial="initial"
			animate="animate"
			exit="exit"
			transition={{ type: 'spring', stiffness: 500, damping: 30 }}
			className={`relative w-full p-4 mb-4 rounded-xl border ${styles.border} ${styles.bg} backdrop-blur-lg shadow-lg flex items-start gap-4 overflow-hidden`}
		>
			<div className={`flex-shrink-0 ${styles.text}`}>{styles.icon}</div>
			<p className="flex-grow text-white">{message}</p>
			<button onClick={onDismiss} className="flex-shrink-0 text-gray-400 hover:text-white transition-colors">
				<X size={18} />
			</button>
		</motion.div>
	);
}