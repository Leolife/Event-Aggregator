import React, { useEffect, useState } from "react";
import { getFirestore, doc, getDoc, updateDoc, increment } from "firebase/firestore";
import DownvoteArrow from "../../assets/downvotearrow.png";
import "./VoteButton.css";

const DownvoteButton = ({ postId }) => {
  const [downvotes, setDownvotes] = useState(null);
  const db = getFirestore();

  useEffect(() => {
    const fetchDownvotes = async () => {
      try {
        const postRef = doc(db, "forum", postId); // adjust collection name
        const postSnap = await getDoc(postRef);

        if (postSnap.exists()) {
          const data = postSnap.data();
          setDownvotes(data.downvoteCount || 0);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error getting document:", error);
      }
    };

    if (postId) fetchDownvotes();
  }, [db, postId]);

  const handleDownVote = async () => {
    try {
      const postRef = doc(db, "forum", postId);
      await updateDoc(postRef, {
        downvoteCount: increment(1),
      });

      // update UI
      setDownvotes((prev) => (prev !== null ? prev + 1 : 1));
      console.log("Downvoted post:", postId);
    } catch (error) {
      console.error("Error updating downvote count:", error);
    }
  };

  return (
    <div>
      <div className="vote-count downvotes">
        <p>{downvotes !== null ? downvotes : "???"}</p>
        <button className="vote-button down" onClick={handleDownVote}>
          <img src={DownvoteArrow} alt="Downvote" className="vote-icon down" />
        </button>
      </div>
    </div>
  );
};

export default DownvoteButton;