import React, { useEffect, useState } from "react";
import { getFirestore, doc, getDoc, updateDoc, increment, setDoc } from "firebase/firestore";
import DownvoteArrow from "../../assets/downvotearrow.png";
import "./VoteButton.css";

const ReplyDownvoteButton = ({ postId, replyId }) => {
  const [downvotes, setDownvotes] = useState(null);
  const db = getFirestore();

  useEffect(() => {
    const fetchDownvotes = async () => {
      try {
        // Reference the reply document in the "replies" subcollection under the forum post
        const replyRef = doc(db, "forum", postId, "replies", replyId);
        const replySnap = await getDoc(replyRef);

        if (replySnap.exists()) {
          const data = replySnap.data();
          setDownvotes(data.downvoteCount || 0);
        } else {
          console.log("No such reply!");
        }
      } catch (error) {
        console.error("Error getting reply document:", error);
      }
    };

    if (postId && replyId) fetchDownvotes();
  }, [db, postId, replyId]);

  const handleDownVote = async () => {
    try {
      const replyRef = doc(db, "forum", postId, "replies", replyId);
      const replySnap = await getDoc(replyRef);

      if (replySnap.exists()) {
        // If the reply document exists, increment downvoteCount
        await updateDoc(replyRef, {
          downvoteCount: increment(1),
        });
      } else {
        // If the reply document doesn't exist, create it with downvoteCount = 1
        await setDoc(replyRef, { downvoteCount: 1 });
      }

      // Update UI
      setDownvotes((prev) => (prev !== null ? prev + 1 : 1));
      console.log("Downvoted reply:", replyId);
    } catch (error) {
      console.error("Error updating reply downvote count:", error);
    }
  };

  return (
    <div>
      <div className="vote-count downvotes">
        <p>{downvotes !== null ? downvotes : "0"}</p>
        <button className="vote-button down" onClick={handleDownVote}>
          <img src={DownvoteArrow} alt="Downvote" className="vote-icon down" />
        </button>
      </div>
    </div>
  );
};

export default ReplyDownvoteButton;
