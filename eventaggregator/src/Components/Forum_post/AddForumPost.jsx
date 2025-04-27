import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as Logo } from '../../assets/calendar-icon.svg';
import { auth, firestore } from '../../firebase'; // Adjust for your firebase.js location
import { collection, addDoc, doc, setDoc, Timestamp, updateDoc } from 'firebase/firestore';
import UserData from '../../utils/UserData';

export const AddForumPost = ({ isOpen, onClose }) => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [eventName, setEventName] = useState('');
    const navigate = useNavigate();

    // Current user from Firebase Auth
    const user = auth.currentUser;
    const userData = new UserData(user.uid);

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Make sure there is a logged-in user
        if (!user) {
            alert("No user is signed in. Please log in first.");
            return;
        }
        
        const userName = await userData.getName();

        // Prepare new post data including the user's name and id
        const newPostData = {
            title,
            body,
            eventName,
            upvoteCount: 0,
            downvoteCount: 0,
            replyCount: 0,
            thumbnailID: 0,
            timestamp: Timestamp.now(),  // use Timestamp from Firestore for consistency
            ownerId: user.uid,
            ownerName: userName || "Anonymous", // Fallback if displayName is not set
        };

        try {
            // Add the new post to the "forum" collection
            const newDocRef = await addDoc(collection(firestore, 'forum'), newPostData);

            // Create an empty "replies" subcollection by adding a placeholder doc.
            await setDoc(doc(newDocRef, 'replies', 'placeholder'), {});

            // Update the new post document with its own ID for reference
            await updateDoc(newDocRef, {
                postId: newDocRef.id,
            });

            // Create a new document in the user's posts subcollection with the post ID and timestamp
            await setDoc(
                doc(firestore, 'users', user.uid, 'posts', newDocRef.id),
                { timestamp: newPostData.timestamp, body: body }
            );

            console.log("Document written with ID:", newDocRef.id);
            
            // Reset form fields and close the modal
            setTitle('');
            setBody('');
            setEventName('');
            onClose();
            
            navigate(`/Forum/post/${newDocRef.id}`);

        } catch (error) {
            console.error("Error adding document:", error);
        }
    };

    return (
        <div className={`modal ${isOpen ? 'open' : ''}`}>
            <div className="modal-content post">
                <button className="close-btn" onClick={onClose}>&times;</button>
                <h2>Add Post</h2>
                <form onSubmit={handleSubmit}>
                    <p>Title</p>
                    <div className="input-box title">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <p>Body</p>
                    <div className="input-box body">
                        <textarea
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                minHeight: '150px',
                                padding: '12px',
                                border: '1px solid #ccc',
                                borderRadius: '8px'
                            }}
                        />
                    </div>
                    <p>Event Name</p>
                    <div className="input-box event">
                        <input
                            type="text"
                            value={eventName}
                            onChange={(e) => setEventName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex-div">
                        <button className="button-submit" type="submit">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddForumPost;
