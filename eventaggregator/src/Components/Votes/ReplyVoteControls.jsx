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

const ReplyVoteControls = ({ postId, replyId, userId }) => {
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [text, setText] = useState("");
  const [userUpvoted, setUserUpvoted] = useState(false);
  const [userDownvoted, setUserDownvoted] = useState(false);
  const db = getFirestore();

  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const replyRef = doc(db, "forum", postId, "replies", replyId);
        const replySnap = await getDoc(replyRef);

        if (replySnap.exists()) {
          const data = replySnap.data();
          setUpvotes(data.upvoteCount || 0);
          setDownvotes(data.downvoteCount || 0);
          setText(data.commentBody || "");
        }

        if (userId) {
          const userUpvoteRef = doc(db, "users", userId, "reply_upvotes", replyId);
          const userDownvoteRef = doc(db, "users", userId, "reply_downvotes", replyId);
          const [upSnap, downSnap] = await Promise.all([
            getDoc(userUpvoteRef),
            getDoc(userDownvoteRef),
          ]);
          setUserUpvoted(upSnap.exists());
          setUserDownvoted(downSnap.exists());
        }
      } catch (error) {
        console.error("Error fetching reply votes:", error);
      }
    };

    if (postId && replyId) fetchVotes();
  }, [db, postId, replyId, userId]);

  const handleVote = async (type) => {
    if (!userId) {
      alert("You must be logged in to vote.");
      return;
    }

    try {
      const replyRef = doc(db, "forum", postId, "replies", replyId);
      const userUpvoteRef = doc(db, "users", userId, "reply_upvotes", replyId);
      const userDownvoteRef = doc(db, "users", userId, "reply_downvotes", replyId);

      const [upSnap, downSnap] = await Promise.all([
        getDoc(userUpvoteRef),
        getDoc(userDownvoteRef),
      ]);

      const isUpvote = type === "up";
      const isDownvote = type === "down";

      if (isUpvote && upSnap.exists()) {
        await deleteDoc(userUpvoteRef);
        await updateDoc(replyRef, { upvoteCount: increment(-1) });
        setUpvotes((prev) => prev - 1);
        setUserUpvoted(false);
      } else if (isDownvote && downSnap.exists()) {
        await deleteDoc(userDownvoteRef);
        await updateDoc(replyRef, { downvoteCount: increment(-1) });
        setDownvotes((prev) => prev - 1);
        setUserDownvoted(false);
      } else {
        if (isUpvote && downSnap.exists()) {
          await deleteDoc(userDownvoteRef);
          await updateDoc(replyRef, { downvoteCount: increment(-1) });
          setDownvotes((prev) => prev - 1);
          setUserDownvoted(false);
        }
        if (isDownvote && upSnap.exists()) {
          await deleteDoc(userUpvoteRef);
          await updateDoc(replyRef, { upvoteCount: increment(-1) });
          setUpvotes((prev) => prev - 1);
          setUserUpvoted(false);
        }

        const ref = isUpvote ? userUpvoteRef : userDownvoteRef;
        const field = isUpvote ? "upvoteCount" : "downvoteCount";

        //Add additional/update doc information here
        await setDoc(ref, { votedAt: new Date(), body: text },  { merge: true });
        await updateDoc(replyRef, { [field]: increment(1) });

        if (isUpvote) {
          setUpvotes((prev) => prev + 1);
          setUserUpvoted(true);
        } else {
          setDownvotes((prev) => prev + 1);
          setUserDownvoted(true);
        }
      }
    } catch (error) {
      console.error("Error handling reply vote:", error);
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

export default ReplyVoteControls;
