import { doc, getDoc, updateDoc, collection, query, where, getDocs, deleteDoc } from "firebase/firestore";
import { firestore } from "../firebase";

class EventData {
    constructor(eventId) {
        if (!eventId) {
            throw new Error("Event ID is required to initialize EventData.");
        }
        this.id = eventId;
        this.eventRef = doc(firestore, "events", this.id); // Direct reference using Post ID as document ID
    }
    // Getter: Fetch post data from Firestore
    async getEventData() {
        try {
            const eventSnap = await getDoc(this.postRef);
            if (eventSnap.exists()) {
                return eventSnap.data(); // Return the post data
            }

            const eventRef = collection(firestore, "events");
            const q = query(eventRef, where("id", "==", this.id));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const eventDoc = querySnapshot.docs[0];
                return eventDoc.data();
            } else {
                throw new Error("Event data not found in Firestore.");
            }
        } catch (error) {
            console.error("Error fetching event data:", error);
            throw error;
        }
    }
}
