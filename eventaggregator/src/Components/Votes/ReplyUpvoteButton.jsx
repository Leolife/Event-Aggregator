import React, { useEffect, useState } from "react";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  increment,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import UpvoteArrow from "../../assets/upvotearrow.png";  // Ensure correct path to your icon
import "./VoteButton.css";

const ReplyUpvoteButton = ({ postId, replyId, userId }) => {
  const [upvotes, setUpvotes] = useState(null);
  const [userUpvoted, setUserUpvoted] = useState(false);
  const db = getFirestore();

  useEffect(() => {
    const fetchVotes = async () => {
      try {
        // Reference the reply document from the forum post's "replies" subcollection
        const replyRef = doc(db, "forum", postId, "replies", replyId);
        const replySnap = await getDoc(replyRef);

        if (replySnap.exists()) {
          const data = replySnap.data();
          setUpvotes(data.upvoteCount || 0);
        } else {
          console.log("No such reply!");
        }

        // Check if the user has already upvoted this reply.
        const userUpvoteRef = doc(db, "users", userId, "replyUpvotes", replyId);
        const userUpvoteSnap = await getDoc(userUpvoteRef);
        setUserUpvoted(userUpvoteSnap.exists());
      } catch (error) {
        console.error("Error fetching reply upvotes:", error);
      }
    };

    if (postId && replyId && userId) {
      fetchVotes();
    }
  }, [db, postId, replyId, userId]);

  const handleUpVote = async () => {
    try {
      const replyRef = doc(db, "forum", postId, "replies", replyId);
      const userUpvoteRef = doc(db, "users", userId, "replyUpvotes", replyId);
      const userDownvoteRef = doc(db, "users", userId, "replyDownvotes", replyId);

      // Check the user's current vote status
      const userUpvoteSnap = await getDoc(userUpvoteRef);
      const userDownvoteSnap = await getDoc(userDownvoteRef);

      if (userUpvoteSnap.exists()) {
        // Remove the upvote if already exists.
        await deleteDoc(userUpvoteRef);
        await updateDoc(replyRef, { upvoteCount: increment(-1) });
        setUpvotes((prev) => (prev !== null ? prev - 1 : 0));
        setUserUpvoted(false);
        console.log("Removed upvote for reply:", replyId);
      } else {
        // If a downvote exists, remove it first.
        if (userDownvoteSnap.exists()) {
          await deleteDoc(userDownvoteRef);
          await updateDoc(replyRef, { downvoteCount: increment(-1) });
        }
        // Now apply the upvote.
        await setDoc(userUpvoteRef, { upvotedAt: new Date() }, { merge: true });
        await updateDoc(replyRef, { upvoteCount: increment(1) });
        setUpvotes((prev) => (prev !== null ? prev + 1 : 1));
        setUserUpvoted(true);
        console.log("Upvoted reply:", replyId);
      }
    } catch (error) {
      console.error("Error updating reply upvote count:", error);
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
          <img src={UpvoteArrow} alt="Upvote" className="vote-icon up" />
        </button>
      </div>
    </div>
  );
};

export default ReplyUpvoteButton;
