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
import UpvoteArrow from "../../assets/upvotearrow.png";
import DownvoteArrow from "../../assets/downvotearrow.png";
import "./VoteButton.css";

const VoteControls = ({ postId, userId }) => {
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [text, setText] = useState("");
  const [userUpvoted, setUserUpvoted] = useState(false);
  const [userDownvoted, setUserDownvoted] = useState(false);
  const db = getFirestore();

  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const postRef = doc(db, "forum", postId);
        const postSnap = await getDoc(postRef);
        if (postSnap.exists()) {
          const data = postSnap.data();
          setUpvotes(data.upvoteCount || 0);
          setDownvotes(data.downvoteCount || 0);
          setText(data.body || "");
        }
  
        // Only fetch user-specific voting state if user is logged in
        if (userId) {
          const userUpvoteRef = doc(db, "users", userId, "upvotes", postId);
          const userDownvoteRef = doc(db, "users", userId, "downvotes", postId);
          const [upSnap, downSnap] = await Promise.all([
            getDoc(userUpvoteRef),
            getDoc(userDownvoteRef),
          ]);
          setUserUpvoted(upSnap.exists());
          setUserDownvoted(downSnap.exists());
        }
      } catch (error) {
        console.error("Error fetching post votes:", error);
      }
    };
  
    if (postId) fetchVotes();
  }, [db, postId, userId]);

  const handleVote = async (type) => {
    if (!userId) {
        alert("You must be logged in to vote.");
        return;
    }

    try {
      const postRef = doc(db, "forum", postId);
      const userUpvoteRef = doc(db, "users", userId, "upvotes", postId);
      const userDownvoteRef = doc(db, "users", userId, "downvotes", postId);
      const [upSnap, downSnap] = await Promise.all([
        getDoc(userUpvoteRef),
        getDoc(userDownvoteRef),
      ]);

      const isUpvote = type === "up";
      const isDownvote = type === "down";

      if (isUpvote && upSnap.exists()) {
        await deleteDoc(userUpvoteRef);
        await updateDoc(postRef, { upvoteCount: increment(-1) });
        setUpvotes((prev) => prev - 1);
        setUserUpvoted(false);
      } else if (isDownvote && downSnap.exists()) {
        await deleteDoc(userDownvoteRef);
        await updateDoc(postRef, { downvoteCount: increment(-1) });
        setDownvotes((prev) => prev - 1);
        setUserDownvoted(false);
      } else {
        if (isUpvote && downSnap.exists()) {
          await deleteDoc(userDownvoteRef);
          await updateDoc(postRef, { downvoteCount: increment(-1) });
          setDownvotes((prev) => prev - 1);
          setUserDownvoted(false);
        }
        if (isDownvote && upSnap.exists()) {
          await deleteDoc(userUpvoteRef);
          await updateDoc(postRef, { upvoteCount: increment(-1) });
          setUpvotes((prev) => prev - 1);
          setUserUpvoted(false);
        }

        const ref = isUpvote ? userUpvoteRef : userDownvoteRef;
        const field = isUpvote ? "upvoteCount" : "downvoteCount";
        await setDoc(ref, { votedAt: new Date(), body: text},  { merge: true });
        await updateDoc(postRef, { [field]: increment(1) });

        if (isUpvote) {
          setUpvotes((prev) => prev + 1);
          setUserUpvoted(true);
        } else {
          setDownvotes((prev) => prev + 1);
          setUserDownvoted(true);
        }
      }
    } catch (error) {
      console.error("Error handling vote:", error);
    }
  };

  return (
    <div className="votes-section">
      <div className="vote-count upvotes">
        <p>{upvotes}</p>
        <button
          className={`vote-button up ${userUpvoted ? "active" : ""}`}
          onClick={() => handleVote("up")}
        >
          <img src={UpvoteArrow} alt="upvote" className="vote-icon up" />
        </button>
      </div>

      <div className="vote-count downvotes">
        <p>{downvotes}</p>
        <button
          className={`vote-button down ${userDownvoted ? "active" : ""}`}
          onClick={() => handleVote("down")}
        >
          <img src={DownvoteArrow} alt="downvote" className="vote-icon down" />
        </button>
      </div>
    </div>
  );
};

export default VoteControls;
