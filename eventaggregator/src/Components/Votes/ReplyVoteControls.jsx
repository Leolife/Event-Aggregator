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
import { sendInAppNotification } from '../../utils/notificationUtils'; 
import UserData from "../../utils/UserData"; 

const ReplyVoteControls = ({ postId, replyId, userId }) => {
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [replyBody, setReplyBody] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState("");
  const [userUpvoted, setUserUpvoted] = useState(false);
  const [userDownvoted, setUserDownvoted] = useState(false);
  const [replyOwnerId, setReplyOwnerId] = useState("");
  const db = getFirestore();

  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const replyRef = doc(db, "forum", postId, "replies", replyId);
        const postRef = doc(db, "forum", postId);

        const [replySnap, postSnap] = await Promise.all([
          getDoc(replyRef),
          getDoc(postRef),
        ]);

        if (replySnap.exists()) {
          const replyData = replySnap.data();
          setUpvotes(replyData.upvoteCount || 0);
          setDownvotes(replyData.downvoteCount || 0);
          setReplyBody(replyData.commentBody || "");
          setReplyOwnerId(replyData.ownerId || "");
        }

        if (postSnap.exists()) {
          const postData = postSnap.data();
          setPostTitle(postData.title || "");
          setPostBody(postData.body || "");
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

        await setDoc(ref, {
          votedAt: new Date(),
          postId,
          replyId,
          postTitle,
          postBody,
          replyBody,
        }, { merge: true });

        await updateDoc(replyRef, { [field]: increment(1) });

        if (isUpvote) {
          setUpvotes((prev) => prev + 1);
          setUserUpvoted(true);
        } else {
          setDownvotes((prev) => prev + 1);
          setUserDownvoted(true);
        }

        // Send Notification
        if (userId !== replyOwnerId) {
          const currentUserData = new UserData(userId);
          const currentUserObj = await currentUserData.getUserData();
          if (isUpvote) {
            await sendInAppNotification(
              replyOwnerId,
              "👍 New Upvote on your Reply!",
              `${currentUserObj.displayName || 'Someone'} upvoted your reply! Click to view.`,
              `/fullpostview/${postId}`
            );
          } else {
            await sendInAppNotification(
              replyOwnerId,
              "👎 Your Reply got a Downvote",
              `Someone downvoted your reply. Click to view.`,
              `/fullpostview/${postId}`
            );
          }
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
