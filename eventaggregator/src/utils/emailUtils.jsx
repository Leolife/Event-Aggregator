import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { firestore } from '../firebase';

export const sendEmailNotification = async (email, title, body) => {
  try {
    const mailRef = collection(firestore, 'mail');
    await addDoc(mailRef, {
      to: email,
      message: {
        subject: title,
        html: `<p>${body}</p>`,
      },
      timestamp: serverTimestamp(),
    });
    console.log("Email queued successfully to:", email);
  } catch (error) {
    console.error("Email sending failed:", error.message);
  }
};
