import React, { useEffect, useState } from 'react';
import './FullPostView.css';
import { forumPosts } from '../../Pages/Forum/ForumPosts';
import { useParams } from 'react-router-dom';
import { auth } from '../../firebase';
import UserData from '../../utils/UserData';
import ForumData from '../../utils/ForumData';


const FullPostView = ({ post, comments }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [isUser, setIsUser] = useState(false);

    const handleDeletion = (e) => {
        e.preventDefault();

    };

    const handleReplySubmit = (e) => {
        e.preventDefault();
        setReplyText('You actually thought the reply button would work properly, LOL!');
        window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    useEffect(() => {
        const user = auth.currentUser;
        const post = new ForumData(postId);
        if (user) {
            if (user.id == post.getOwnerId()) {
                setIsUser(true);
            }
        }
    }, []);

    const { postId } = useParams();

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
                                <div className="author-info">
                                    <div className="author-avatar">
                                        {post.ownerName?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <span>{post.ownerName}</span>
                                </div>
                                <button className="delete-post" onClick={handleDeletion}>
                                    Delete Post
                                </button>
                            </div>
                            <button
                                className={`dropdown-button ${showDropdown ? 'active' : ''}`}
                                onClick={toggleDropdown}>
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
                        <span className="post-time">Posted: {post.timestamp} minutes ago</span>
                        <div className="votes-section">
                            <div className="vote-count upvotes">
                                {post.upvoteCount} <span className="vote-arrow">↑</span>
                            </div>
                            <div className="vote-count downvotes">
                                {post.downvoteCount} <span className="vote-arrow">↓</span>
                            </div>
                        </div>
                    </div>

                    <div className="comments-section">
                        <div className="reply-container">
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

                        {comments?.map((comment, index) => (
                            <div key={index} className="comment-box">
                                <div className="author-info">
                                    <div className="author-avatar">
                                        {comment.ownerName?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <span>{comment.ownerName}</span>
                                    <span className="post-time">{comment.timestamp}</span>
                                </div>
                                <p className="post-body">{comment.commentBody}</p>
                            </div>
                        ))}
                    </div>
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
                                <h3 className="event-name"> {forumPost.eventName} </h3>
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
                                <button className="event-button primary-button">
                                    Add to Calendar
                                </button>
                                <button className="event-button secondary-button">
                                    Export (Google Calendar)
                                </button>
                                <button className="download-button">
                                    ⬇️
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FullPostView;
