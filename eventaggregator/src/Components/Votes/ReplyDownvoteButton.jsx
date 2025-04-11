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
import DownvoteArrow from "../../assets/downvotearrow.png";  // Ensure correct path to your icon
import "./VoteButton.css";

const ReplyDownvoteButton = ({ postId, replyId, userId }) => {
  const [downvotes, setDownvotes] = useState(null);
  const [userDownvoted, setUserDownvoted] = useState(false);
  const db = getFirestore();

  useEffect(() => {
    const fetchVotes = async () => {
      try {
        // Reference the reply document from the forum post's "replies" subcollection
        const replyRef = doc(db, "forum", postId, "replies", replyId);
        const replySnap = await getDoc(replyRef);

        if (replySnap.exists()) {
          const data = replySnap.data();
          setDownvotes(data.downvoteCount || 0);
        } else {
          console.log("No such reply!");
        }

        // Check if the user has already downvoted this reply.
        const userDownvoteRef = doc(db, "users", userId, "replyDownvotes", replyId);
        const userDownvoteSnap = await getDoc(userDownvoteRef);
        setUserDownvoted(userDownvoteSnap.exists());
      } catch (error) {
        console.error("Error fetching reply downvotes:", error);
      }
    };

    if (postId && replyId && userId) {
      fetchVotes();
    }
  }, [db, postId, replyId, userId]);

  const handleDownVote = async () => {
    try {
      const replyRef = doc(db, "forum", postId, "replies", replyId);
      const userDownvoteRef = doc(db, "users", userId, "replyDownvotes", replyId);
      const userUpvoteRef = doc(db, "users", userId, "replyUpvotes", replyId);

      // Check the user's current vote status
      const userDownvoteSnap = await getDoc(userDownvoteRef);
      const userUpvoteSnap = await getDoc(userUpvoteRef);

      if (userDownvoteSnap.exists()) {
        // Remove the downvote if it already exists.
        await deleteDoc(userDownvoteRef);
        await updateDoc(replyRef, { downvoteCount: increment(-1) });
        setDownvotes((prev) => (prev !== null ? prev - 1 : 0));
        setUserDownvoted(false);
        console.log("Removed downvote for reply:", replyId);
      } else {
        // If an upvote exists, remove it first.
        if (userUpvoteSnap.exists()) {
          await deleteDoc(userUpvoteRef);
          await updateDoc(replyRef, { upvoteCount: increment(-1) });
        }
        // Then apply the downvote.
        await setDoc(userDownvoteRef, { downvotedAt: new Date() }, { merge: true });
        await updateDoc(replyRef, { downvoteCount: increment(1) });
        setDownvotes((prev) => (prev !== null ? prev + 1 : 1));
        setUserDownvoted(true);
        console.log("Downvoted reply:", replyId);
      }
    } catch (error) {
      console.error("Error updating reply downvote count:", error);
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
          <img src={DownvoteArrow} alt="Downvote" className="vote-icon down" />
        </button>
      </div>
    </div>
  );
};

export default ReplyDownvoteButton;
