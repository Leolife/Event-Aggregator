import { doc, getDoc, updateDoc, collection, query, where, getDocs, deleteDoc } from "firebase/firestore";
import { firestore } from "../firebase";

class ForumData {
    constructor(postId) {
        if (!postId) {
            throw new Error("Post ID is required to initialize ForumData.");
        }
        this.postId = postId;
        this.postRef = doc(firestore, "forum", this.postId); // Direct reference using Post ID as document ID
    }

    // Delete post from Firestore
    async deletePost() {
        try {
            const postSnap = await getDoc(this.postRef);

            if (postSnap.exists()) {
                await deleteDoc(this.postRef);
                console.log("Post deleted successfully.");
                return;
            }

            // If direct reference fails, search by postId field
            const forumRef = collection(firestore, "forum");
            const q = query(forumRef, where("postId", "==", this.postId));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const postDocRef = querySnapshot.docs[0].ref;
                await deleteDoc(postDocRef);
                console.log("Post deleted successfully (via query).");
            } else {
                throw new Error("Post not found in Firestore.");
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            throw error;
        }
    }

    // Getter: Fetch post data from Firestore
    async getPostData() {
        try {
            const postSnap = await getDoc(this.postRef);
            if (postSnap.exists()) {
                return postSnap.data(); // Return the post data
            }

            const forumRef = collection(firestore, "forum");
            const q = query(forumRef, where("postId", "==", this.postId));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const postDoc = querySnapshot.docs[0];
                return postDoc.data();
            } else {
                throw new Error("Post data not found in Firestore.");
            }
        } catch (error) {
            console.error("Error fetching post data:", error);
            throw error;
        }
    }

    // Setter: Update specific fields in the post's Firestore document
    async setPostData(updatedData) {
        try {
            const postSnap = await getDoc(this.postRef);
            if (postSnap.exists()) {
                await updateDoc(this.postRef, updatedData);
                console.log("Post data updated successfully.");
                return;
            }

            const forumRef = collection(firestore, "forum");
            const q = query(forumRef, where("postId", "==", this.postId));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const postDocRef = querySnapshot.docs[0].ref;
                await updateDoc(postDocRef, updatedData);
                console.log("Post data updated successfully (via query).");
            } else {
                throw new Error("Post data not found in Firestore.");
            }
        } catch (error) {
            console.error("Error updating post data:", error);
            throw error;
        }
    }

    // Getter: Fetch post title
    async getTitle() {
        const postData = await this.getPostData();
        return postData.title || "No title available";
    }

    // Setter: Update post title
    async setTitle(newTitle) {
        await this.setPostData({ title: newTitle });
    }

    // Getter: Fetch post body
    async getBody() {
        const postData = await this.getPostData();
        return postData.body || "No body available";
    }

    // Setter: Update post body
    async setBody(newBody) {
        await this.setPostData({ body: newBody });
    }

    // Getter: Fetch post owner name
    async getOwnerName() {
        const postData = await this.getPostData();
        return postData.ownerName || "Unknown";
    }

    // Setter: Update post owner name
    async setOwnerName(newOwnerName) {
        await this.setPostData({ ownerName: newOwnerName });
    }

    // Getter: Fetch post owner id
    async getOwnerId() {
        const postData = await this.getPostData();
        return postData.ownerId || "Unknown";
    }

    // Setter: Update post owner id
    async setOwnerId(newOwnerId) {
        await this.setPostData({ ownerId: newOwnerId });
    }

    // Getter: Fetch event name associated with the post
    async getEventName() {
        const postData = await this.getPostData();
        return postData.eventName || "No event name available";
    }

    // Setter: Update event name
    async setEventName(newEventName) {
        await this.setPostData({ eventName: newEventName });
    }

    // Getter: Fetch upvote count
    async getUpvoteCount() {
        const postData = await this.getPostData();
        return postData.upvoteCount || 0;
    }

    // Setter: Update upvote count
    async setUpvoteCount(newCount) {
        await this.setPostData({ upvoteCount: newCount });
    }

    // Getter: Fetch downvote count
    async getDownvoteCount() {
        const postData = await this.getPostData();
        return postData.downvoteCount || 0;
    }

    // Setter: Update downvote count
    async setDownvoteCount(newCount) {
        await this.setPostData({ downvoteCount: newCount });
    }

    // Getter: Fetch reply count
    async getReplyCount() {
        const postData = await this.getPostData();
        return postData.replyCount || 0;
    }

    // Setter: Update reply count
    async setReplyCount(newCount) {
        await this.setPostData({ replyCount: newCount });
    }

    // Getter: Fetch thumbnail ID
    async getThumbnailID() {
        const postData = await this.getPostData();
        return postData.thumbnailID || 0;
    }

    // Setter: Update thumbnail ID
    async setThumbnailID(newThumbnailID) {
        await this.setPostData({ thumbnailID: newThumbnailID });
    }

    // Getter: Fetch timestamp
    async getTimestamp() {
        const postData = await this.getPostData();
        return postData.timestamp || "No timestamp available";
    }

    // Setter: Update timestamp
    async setTimestamp(newTimestamp) {
        await this.setPostData({ timestamp: newTimestamp });
    }
}

export default ForumData;
