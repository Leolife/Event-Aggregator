import React, { useEffect, useState } from "react";
import { getFirestore, doc, getDoc, updateDoc, increment, setDoc } from "firebase/firestore";
import UpvoteArrow from "../../assets/upvotearrow.png";  // Replace with your upvote icon
import "./VoteButton.css";

const ReplyUpvoteButton = ({ postId, replyId }) => {
  const [upvotes, setUpvotes] = useState(null);
  const db = getFirestore();

  useEffect(() => {
    const fetchUpvotes = async () => {
      try {
        // Reference the reply document in the "replies" subcollection under the forum post
        const replyRef = doc(db, "forum", postId, "replies", replyId);
        const replySnap = await getDoc(replyRef);

        if (replySnap.exists()) {
          const data = replySnap.data();
          setUpvotes(data.upvoteCount || 0);
        } else {
          console.log("No such reply!");
        }
      } catch (error) {
        console.error("Error getting reply document:", error);
      }
    };

    if (postId && replyId) fetchUpvotes();
  }, [db, postId, replyId]);

  const handleUpVote = async () => {
    try {
      const replyRef = doc(db, "forum", postId, "replies", replyId);
      const replySnap = await getDoc(replyRef);

      if (replySnap.exists()) {
        // If the reply document exists, increment upvoteCount
        await updateDoc(replyRef, {
          upvoteCount: increment(1),
        });
      } else {
        // If the reply document doesn't exist, create it with upvoteCount = 1
        await setDoc(replyRef, { upvoteCount: 1 });
      }

      // Update UI
      setUpvotes((prev) => (prev !== null ? prev + 1 : 1));
      console.log("Upvoted reply:", replyId);
    } catch (error) {
      console.error("Error updating reply upvote count:", error);
    }
  };

  return (
    <div>
      <div className="vote-count upvotes">
        <p>{upvotes !== null ? upvotes : "0"}</p>
        <button className="vote-button up" onClick={handleUpVote}>
          <img src={UpvoteArrow} alt="Upvote" className="vote-icon up" />
        </button>
      </div>
    </div>
  );
};

export default ReplyUpvoteButton;
