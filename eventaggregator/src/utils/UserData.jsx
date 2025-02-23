import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from "../firebase";

class UserData {
    constructor(uid) {
        if (!uid) {
            throw new Error("User ID is required to initialize UserData.");
        }
        this.uid = uid;
        this.userRef = doc(firestore, "users", this.uid); // Direct reference using UID as document ID
        console.log(this.userRef)
    }

    // Getter: Fetch user data from Firestore
    async getUserData() {
        try {
            // Attempt to fetch document directly
            const userSnap = await getDoc(this.userRef);
            if (userSnap.exists()) {
                return userSnap.data(); // Return the user's data
            }

            // If direct fetch fails, query by UID field
            const usersRef = collection(firestore, "users");
            const q = query(usersRef, where("uid", "==", this.uid));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0]; // Fetch the first matching document
                return userDoc.data();
            } else {
                throw new Error("User data not found in Firestore.");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            throw error;
        }
    }

    // Setter: Update specific fields in the user's Firestore document
    async setUserData(updatedData) {
        try {
            // Attempt to update document directly
            const userSnap = await getDoc(this.userRef);
            if (userSnap.exists()) {
                await updateDoc(this.userRef, updatedData);
                console.log("User data updated successfully.");
                return;
            }

            // If direct update fails, query by UID field
            const usersRef = collection(firestore, "users");
            const q = query(usersRef, where("uid", "==", this.uid));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const userDocRef = querySnapshot.docs[0].ref;
                await updateDoc(userDocRef, updatedData);
                console.log("User data updated successfully (via query).");
            } else {
                throw new Error("User data not found in Firestore.");
            }
        } catch (error) {
            console.error("Error updating user data:", error);
            throw error;
        }
    }

    // Getter: Fetch the user's name
    async getName() {
        const userData = await this.getUserData();
        return userData.name || "No name available";
    }

    // Setter: Update the user's name
    async setName(newName) {
        await this.setUserData({ name: newName });
    }

    // Getter: Fetch the user's email
    async getEmail() {
        const userData = await this.getUserData();
        return userData.email || "No email available";
    }

    // Setter: Update the user's email
    async setEmail(newEmail) {
        await this.setUserData({ email: newEmail });
    }

    // Getter: Fetch the user's friends count
    async getFriendsCount() {
        const userData = await this.getUserData();
        return userData.friendsCount || 0;
    }

    // Setter: Update the user's friends count
    async setFriendsCount(newCount) {
        await this.setUserData({ friendsCount: newCount });
    }

    // Getter: Fetch the user's posts count
    async getPostsCount() {
        const userData = await this.getUserData();
        return userData.postsCount || 0;
    }

    // Setter: Update the user's posts count
    async setPostsCount(newCount) {
        await this.setUserData({ postsCount: newCount });
    }

    // Getter: Fetch the user's profile picture
    async getProfilePicture() {
        const userData = await this.getUserData();
        return userData.profilePicture || "";
    }

    // Setter: Update the user's profile picture
    async setProfilePicture(newPicture) {
        await this.setUserData({ profilePicture: newPicture });
    }

    // Getter: Fetch the user's profile banner
    async getProfileBanner() {
        const userData = await this.getUserData();
        return userData.profileBanner || "";
    }

    // Setter: Update the user's profile banner
    async setProfileBanner(newBanner) {
        await this.setUserData({ profileBanner: newBanner });
    }

    // Getter: Fetch the user's interests array
    async getInterests() {
        const userData = await this.getUserData();
        return userData.interests || [];
    }

    // Setter: Update the user's interests array
    async setInterests(newInterests) {
        await this.setUserData({ interests: newInterests });
    }

    // Getter: Fetch the user's bio
    async getBio() {
        const userData = await this.getUserData();
        return userData.bio || "";
    }

    // Setter: Update the user's bio
    async setBio(newBio) {
        await this.setUserData({ bio: newBio });
    }

}

export default UserData;
