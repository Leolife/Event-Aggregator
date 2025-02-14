import { auth, firestore } from '../firebase'; // Adjusted for your firebase.js location
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";


//This function serves as a way to change the id of documents with randomized ids 
// into documents with user ids as document ids. 
// its unlikely to be used again, but ill keep it here just in case
async function migrateUsersToUIDDocs() {
  const usersRef = collection(firestore, "users");
  const snapshot = await getDocs(usersRef);

  for (const userDoc of snapshot.docs) {
    const userData = userDoc.data();
    const userUid = userData.uid;

    if (!userUid) {
      console.log(`Skipping doc ${userDoc.id} - no uid field found.`);
      continue;
    }

    // Create/overwrite a doc at /users/{userUid}
    await setDoc(doc(firestore, "users", userUid), userData, { merge: true });

    // Optionally delete the old doc
    if (userDoc.id !== userUid) {
      await deleteDoc(doc(firestore, "users", userDoc.id));
      console.log(`Migrated data from ${userDoc.id} to ${userUid}`);
    }
  }
}
