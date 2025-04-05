import React, { useEffect, useState } from "react";
import { getFirestore, doc, getDoc, updateDoc, increment } from "firebase/firestore";
import UpvoteArrow from "../../assets/upvotearrow.png";
import "./VoteButton.css";

const UpvoteButton = ({ postId }) => {
  const [upvotes, setUpvotes] = useState(null);
  const db = getFirestore();

  useEffect(() => {
    const fetchUpvotes = async () => {
      try {
        const postRef = doc(db, "forum", postId); // adjust collection name
        const postSnap = await getDoc(postRef);

        if (postSnap.exists()) {
          const data = postSnap.data();
          setUpvotes(data.UpvoteCount || 0);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error getting document:", error);
      }
    };

    if (postId) fetchUpvotes();
  }, [db, postId]);

  const handleUpVote = async () => {
    try {
      const postRef = doc(db, "forum", postId);
      await updateDoc(postRef, {
        upvoteCount: increment(1),
      });

      // update UI
      setUpvotes((prev) => (prev !== null ? prev + 1 : 1));
      console.log("Upvoted post:", postId);
    } catch (error) {
      console.error("Error updating upvote count:", error);
    }
  };

  return (
    <div>
      <div className="vote-count upvotes">
        <p>{upvotes !== null ? upvotes : "???"}</p>
        <button className="vote-button up" onClick={handleUpVote}>
          <img src={UpvoteArrow} alt="upvote" className="vote-icon up" />
        </button>
      </div>
    </div>
  );
};

export default UpvoteButton;