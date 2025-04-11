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
import UpvoteArrow from "../../assets/upvotearrow.png";
import "./VoteButton.css";

const UpvoteButton = ({ postId, userId }) => {
  const [upvotes, setUpvotes] = useState(null);
  const [userUpvoted, setUserUpvoted] = useState(false);
  const db = getFirestore();

  useEffect(() => {
    const fetchVotes = async () => {
      try {
        // Get post upvote count.
        const postRef = doc(db, "forum", postId);
        const postSnap = await getDoc(postRef);
        if (postSnap.exists()) {
          const data = postSnap.data();
          setUpvotes(data.upvoteCount || 0);
        } else {
          console.log("No such post document!");
        }

        // Check if user has upvoted.
        const userUpvoteRef = doc(db, "users", userId, "upvotes", postId);
        const userUpvoteSnap = await getDoc(userUpvoteRef);
        setUserUpvoted(userUpvoteSnap.exists());
      } catch (error) {
        console.error("Error fetching upvotes:", error);
      }
    };

    if (postId && userId) {
      fetchVotes();
    }
  }, [db, postId, userId]);

  const handleUpVote = async () => {
    try {
      const postRef = doc(db, "forum", postId);
      const userUpvoteRef = doc(db, "users", userId, "upvotes", postId);
      const userDownvoteRef = doc(db, "users", userId, "downvotes", postId);

      // Check if the user has already upvoted or downvoted.
      const userUpvoteSnap = await getDoc(userUpvoteRef);
      const userDownvoteSnap = await getDoc(userDownvoteRef);

      if (userUpvoteSnap.exists()) {
        // User is removing their upvote.
        await deleteDoc(userUpvoteRef);
        await updateDoc(postRef, { upvoteCount: increment(-1) });
        setUpvotes((prev) => (prev !== null ? prev - 1 : 0));
        setUserUpvoted(false);
        console.log("Removed upvote for post:", postId);
      } else {
        // If a downvote exists, remove it first.
        if (userDownvoteSnap.exists()) {
          await deleteDoc(userDownvoteRef);
          await updateDoc(postRef, { downvoteCount: increment(-1) });
        }
        // Then apply the upvote.
        await setDoc(userUpvoteRef, { upvotedAt: new Date() }, { merge: true });
        await updateDoc(postRef, { upvoteCount: increment(1) });
        setUpvotes((prev) => (prev !== null ? prev + 1 : 1));
        setUserUpvoted(true);
        console.log("Upvoted post:", postId);
      }
    } catch (error) {
      console.error("Error updating upvote count:", error);
    }
  };

  return (
    <div>
      <div className="vote-count upvotes">
        <p>{upvotes !== null ? upvotes : "0"}</p>
        <button 
          className={`vote-button up ${userUpvoted ? "active" : ""}`} 
          onClick={handleUpVote}
        >
          <img src={UpvoteArrow} alt="upvote" className="vote-icon up" />
        </button>
      </div>
    </div>
  );
};

export default UpvoteButton;
