import { collection, getDocs, doc, setDoc, addDoc } from "firebase/firestore";
import { firestore } from "../firebase";

export const sendRandomEventSuggestions = async (userId, userEmail, userName) => {
  try {
    const eventsSnapshot = await getDocs(collection(firestore, "events"));
    const events = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (events.length === 0) return;

    const randomEvent = events[Math.floor(Math.random() * events.length)];
    if (!randomEvent) return;

    // Add in-app notification
    const notifRef = doc(
      collection(firestore, `users/${userId}/notifications`)
    );
    await setDoc(notifRef, {
      title: `🎉 Event Suggestion: ${randomEvent.title || "New Event"}`,
      body: `We think you might like: ${randomEvent.title || "an awesome event"}!`,
      timestamp: new Date(),
      read: false,
    });

    // Add email to mail collection
    await addDoc(collection(firestore, "mail"), {
      to: userEmail,
      message: {
        subject: `New Event Suggestion Just for You! 🎉`,
        text: `Hi ${userName || "there"},\n\nWe thought you'd love this event: ${randomEvent.title}!\n\nCheck it out on Event Aggregator!`,
        html: `<p>Hi ${userName || "there"},</p><p>We thought you'd love this event:</p><h2>${randomEvent.title}</h2><p>Check it out on Event Aggregator!</p>`,
      },
    });

    console.log("✅ Suggestion sent to user:", userId);
  } catch (err) {
    console.error("❌ Failed to send suggestion:", err);
  }
};
