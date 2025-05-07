import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '../firebase';

/**
 * Sends an in-app notification to a user.
 * 
 * @param {string} userId - ID of the user to send the notification to.
 * @param {string} title - Title of the notification.
 * @param {string} body - Body text of the notification (optional).
 * @param {string} link - URL or internal app route to navigate when user clicks (optional).
 */
export const sendInAppNotification = async (userId, title, body = "", link = "") => {
  console.log("🔔 Sending notification to user:", userId);

  try {
    const notifRef = collection(firestore, `users/${userId}/notifications`);
    console.log("Firestore notifications path:", notifRef.path);

    const notificationData = {
      title,
      body,
      link, 
      timestamp: serverTimestamp(),
      read: false
    };

    const result = await addDoc(notifRef, notificationData);

    console.log("Notification created with ID:", result.id);
  } catch (err) {
    console.error(" Failed to send notification:", err.message);
  }
};
