import React, { useEffect, useState } from 'react';
import './FullPostView.css';
import { forumPosts } from '../../Pages/Forum/ForumPosts';
import { useNavigate, useParams } from 'react-router-dom';
import { auth } from '../../firebase';
import ForumData from '../../utils/ForumData';
import Replies from './Replies';
import { onAuthStateChanged } from 'firebase/auth';
import UserData from '../../utils/UserData';
import DownvoteButton from '../Votes/DownvoteButton';
import UpvoteButton from '../Votes/UpvoteButton';
import { formatDistanceToNow } from 'date-fns';


const FullPostView = ({ post, comments }) => {
    const [showDropdown, setShowDropdown] = useState(false);

    const user = auth.currentUser;
    const userData = user ? new UserData(user.uid) : null;
    const navigate = useNavigate();
    const { postId } = useParams();

    const timestampInMilliseconds = post.timestamp * 60 * 1000; // Convert minutes to milliseconds
    const date = new Date(Date.now() - timestampInMilliseconds); // Subtract to get the past date
    const timeAgo = formatDistanceToNow(date, { addSuffix: true });
      

    const handleDeletion = async (e) => {
        e.preventDefault();
        if (user?.uid !== post.ownerId) {
            alert("You are not authorized to delete this post.");
            return;
        }

        const confirmDelete = window.confirm("Are you sure you want to delete this post?");
        if (!confirmDelete) return;

        try {
            const postInstance = new ForumData(postId);
            await postInstance.deletePost();
            alert("Post deleted successfully.");
            navigate(`/Forum`);
        } catch (error) {
            console.error("Error deleting post:", error);
            alert("Failed to delete the post.");
        }
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    // Find the specific post from your posts array
    const forumPost = forumPosts.find(post => post.postId === parseInt(postId));

    return (
        <div className="full-post">
            <div className={`content-wrapper ${showDropdown ? 'with-dropdown' : ''}`}>
                <div className="main-content">
                    <div className="post-header">
                        <div className="title-section">
                            <div className="title-left">
                                <h1 className="post-title">{post.title}</h1>
                                <div 
                                    className="author-info clickable-author" 
                                    onClick={() => navigate(`/profile/${post.ownerId}`)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="author-avatar">
                                        {post.ownerName?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <span>{post.ownerName}</span>
                                </div>

                                {user?.uid === post.ownerId && (
                                    <button className="delete-post" onClick={handleDeletion}>
                                        Delete Post
                                    </button>
                                )}
                            </div>
                            <button
                                className={`dropdown-button ${showDropdown ? 'active' : ''}`}
                                onClick={toggleDropdown}
                            >
                                <span className="dropdown-icon">◄</span>
                                View Event Info
                            </button>
                        </div>
                        <div className="separator" />
                    </div>

                    <div className="post-content">
                        <img
                            src={post.thumbnailID || "/api/placeholder/200/200"}
                            alt=""
                            className="post-thumbnail"
                        />
                        <div className="content-right">
                            <div className="event-title">{post.event}</div>
                            <p className="post-body">{post.body}</p>
                        </div>
                    </div>

                    <div className="post-footer">
                        <span className="post-time">Posted: {timeAgo} </span>
                        <div className="votes-section">
                            <div className="vote-count upvotes">
                                <UpvoteButton postId={postId} userId={user.uid}/>
                            </div>
                            <div className="vote-count downvotes">
                                <DownvoteButton postId={postId} userId={user.uid}/>
                            </div>
                        </div>
                    </div>

                    <Replies postId={postId} />
                </div>

                {showDropdown && (
                    <div className="event-sidebar">
                        <div className="event-card">
                            <img
                                src={post.thumbnailID || "/api/placeholder/400/200"}
                                alt="Event thumbnail"
                                className="event-logos"
                            />
                            <div className="event-details">
                                <h3 className="event-name">{forumPost?.eventName}</h3>
                                <div className="event-info">
                                    <span>📅</span>
                                    <span>Sat, October 19th @ 2:00 PM (PDT)</span>
                                </div>
                                <div className="event-info">
                                    <span>📍</span>
                                    <span>Riot Games Arena</span>
                                </div>
                            </div>
                            <div className="event-actions">
                                <button className="event-button primary-button">Add to Calendar</button>
                                <button className="event-button secondary-button">Export (Google Calendar)</button>
                                <button className="download-button">⬇️</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FullPostView;
