import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '../firebase';

export const sendInAppNotification = async (userId, title, body = "") => {
  console.log("Sending to:", userId);

  try {
    const notifRef = collection(firestore, `users/${userId}/notifications`);
    console.log("Firestore path:", notifRef.path);

    const result = await addDoc(notifRef, {
      title,
      body,
      timestamp: serverTimestamp(),
      read: false
    });

    console.log("Notification created:", result.id);
  } catch (err) {
    console.error("Notification failed:", err.message);
  }
};
