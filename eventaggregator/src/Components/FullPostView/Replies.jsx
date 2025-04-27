import React, { useEffect, useState } from 'react';
import './FullPostView.css';
import { auth, firestore } from '../../firebase';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, Timestamp, setDoc, updateDoc, increment } from 'firebase/firestore';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ForumData from '../../utils/ForumData';
import UserData from '../../utils/UserData';
import { formatDistanceToNowStrict } from 'date-fns';
import ReplyVoteControls from '../Votes/ReplyVoteControls';

const Replies = ({ postId }) => {
    const [replyText, setReplyText] = useState('');
    const [replies, setReplies] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const typeParam = searchParams.get('type');

    // Current user from Firebase Auth
    const user = auth.currentUser;
    const userData = user ? new UserData(user.uid) : null;
    const navigate = useNavigate();

    useEffect(() => {
        if (!postId) return;

        const repliesRef = collection(firestore, 'forum', postId, 'replies');
        const q = query(repliesRef, orderBy('timestamp', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            setReplies(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => unsubscribe();
    }, [postId]);

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        if (!replyText.trim()) return;
    
        if (!user) {
            alert('You must be logged in to comment.');
            return;
        }
    
        try {
            const userName = await userData.getName();
            
            // Check if the current user is blocked by or has blocked the post owner
            const postInstance = new ForumData(postId);
            const postData = await postInstance.getPostData();
            const postOwnerId = postData.ownerId;
            
            // Get current user data
            const currentUserData = new UserData(user.uid);
            const currentUserObj = await currentUserData.getUserData();
            const currentUserBlockList = currentUserObj.blockList || [];
            
            // Get post owner's data
            const postOwnerData = new UserData(postOwnerId);
            const postOwnerObj = await postOwnerData.getUserData();
            const postOwnerBlockList = postOwnerObj.blockList || [];
            
            // Check if either user has blocked the other
            if (currentUserBlockList.includes(postOwnerId) || postOwnerBlockList.includes(user.uid)) {
                alert('You cannot comment on this post. You either blocked this user or this user blocked you.');
                return;
            }
    
            const replyData = {
                ownerName: userName || 'Anonymous',
                ownerId: user.uid,
                commentBody: replyText.trim(),
                timestamp: Timestamp.now(),
                upvoteCount: 0,
                downvoteCount: 0
            };
    
            // Add the reply to the forum's replies subcollection
            const replyDocRef = await addDoc(
                collection(firestore, 'forum', postId, 'replies'),
                replyData
            );
    
            // Create a new document in the user's replies subcollection with the same replyId
            await setDoc(
                doc(firestore, 'users', user.uid, 'replies', replyDocRef.id),
                { timestamp: replyData.timestamp, body: replyText }
            );
    
            // Increment replyCount in the parent forum document
            await updateDoc(doc(firestore, 'forum', postId), {
                replyCount: increment(1)
            });
    
            setReplyText('');
        } catch (error) {
            console.error('Error adding reply:', error);
            alert('Failed to add reply. Please try again later.');
        }
    };

    const handleDeletion = async (replyId, ownerId) => {
        if (!user || user.uid !== ownerId) {
            alert("You are not authorized to delete this post.");
            return;
        }

        const confirmDelete = window.confirm("Are you sure you want to delete this reply?");
        if (!confirmDelete) return;

        try {
            await deleteDoc(doc(firestore, 'forum', postId, 'replies', replyId));

            // Decrement replyCount in the parent forum document
            await updateDoc(doc(firestore, 'forum', postId), {
                replyCount: increment(-1)
            });
        } catch (error) {
            console.error("Error deleting post:", error);
            alert("Failed to delete the post.");
        }
    };

    return (
        <div className="comments-section">
            <div className="reply-container" style={{display : typeParam === "comments" ? "none" : "flex" }}>
                <textarea
                    className="reply-input"
                    placeholder="Comment..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={4}
                />
                <button className="reply-button" onClick={handleReplySubmit}>
                    Reply
                </button>
            </div>

            {replies.map((reply) => {
                const timeAgo = formatDistanceToNowStrict(reply.timestamp.toDate(), { addSuffix: true });

                return (
                    <div key={reply.id} className="comment-box">
                        <div className="author-info">
                            <div className="author-avatar">
                                {reply.ownerName?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <span>{reply.ownerName}</span>
                            <span className="post-time">{timeAgo}</span>
                            
                            {user?.uid === reply.ownerId && (
                                <button className="delete-post"
                                    onClick={() => handleDeletion(reply.id, reply.ownerId)}
                                >
                                    Delete Reply
                                </button>
                            )}
                        </div>
                        <p className="post-body">{reply.commentBody}</p>
                        <div className="votes-section">
                            <ReplyVoteControls postId={postId} replyId={reply.id} userId={user?.uid} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Replies;
