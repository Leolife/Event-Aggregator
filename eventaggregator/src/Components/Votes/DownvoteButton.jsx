import React, { useEffect, useState } from "react";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  updateDoc, 
  increment, 
  setDoc, 
  deleteDoc 
} from "firebase/firestore";
import DownvoteArrow from "../../assets/downvotearrow.png";
import "./VoteButton.css";

const DownvoteButton = ({ postId, userId }) => {
  const [downvotes, setDownvotes] = useState(null);
  const [userDownvoted, setUserDownvoted] = useState(false);
  const db = getFirestore();

  useEffect(() => {
    const fetchVotes = async () => {
      try {
        // Get the downvote count for the post.
        const postRef = doc(db, "forum", postId);
        const postSnap = await getDoc(postRef);
        if (postSnap.exists()) {
          const data = postSnap.data();
          setDownvotes(data.downvoteCount || 0);
        } else {
          console.log("No such post document!");
        }

        // Check if the user has downvoted.
        const userDownvoteRef = doc(db, "users", userId, "downvotes", postId);
        const userDownvoteSnap = await getDoc(userDownvoteRef);
        setUserDownvoted(userDownvoteSnap.exists());
      } catch (error) {
        console.error("Error fetching downvotes:", error);
      }
    };

    if (postId && userId) {
      fetchVotes();
    }
  }, [db, postId, userId]);

  const handleDownVote = async () => {
    try {
      const postRef = doc(db, "forum", postId);
      const userDownvoteRef = doc(db, "users", userId, "downvotes", postId);
      const userUpvoteRef = doc(db, "users", userId, "upvotes", postId);

      // Check if user has already downvoted or upvoted.
      const userDownvoteSnap = await getDoc(userDownvoteRef);
      const userUpvoteSnap = await getDoc(userUpvoteRef);

      if (userDownvoteSnap.exists()) {
        // Remove existing downvote.
        await deleteDoc(userDownvoteRef);
        await updateDoc(postRef, { downvoteCount: increment(-1) });
        setDownvotes((prev) => (prev !== null ? prev - 1 : 0));
        setUserDownvoted(false);
        console.log("Removed downvote for post:", postId);
      } else {
        // If an upvote exists, remove it first.
        if (userUpvoteSnap.exists()) {
          await deleteDoc(userUpvoteRef);
          await updateDoc(postRef, { upvoteCount: increment(-1) });
        }
        // Then apply downvote.
        await setDoc(userDownvoteRef, { downvotedAt: new Date() }, { merge: true });
        await updateDoc(postRef, { downvoteCount: increment(1) });
        setDownvotes((prev) => (prev !== null ? prev + 1 : 1));
        setUserDownvoted(true);
        console.log("Downvoted post:", postId);
      }
    } catch (error) {
      console.error("Error updating downvote count:", error);
    }
  };

  return (
    <div>
      <div className="vote-count downvotes">
        <p>{downvotes !== null ? downvotes : "0"}</p>
        <button 
          className={`vote-button down ${userDownvoted ? "active" : ""}`} 
          onClick={handleDownVote}
        >
          <img src={DownvoteArrow} alt="downvote" className="vote-icon down" />
        </button>
      </div>
    </div>
  );
};

export default DownvoteButton;
