import React, { useEffect, useState } from 'react';
import './FullPostView.css';
import { forumPosts } from '../../Pages/Forum/ForumPosts';
import { useNavigate, useParams } from 'react-router-dom';
import { auth } from '../../firebase';
import UserData from '../../utils/UserData';
import ForumData from '../../utils/ForumData';

const Replies = ({ comments }) => {
    const [replyText, setReplyText] = useState('');

    const handleReplySubmit = (e) => {
        e.preventDefault();
        alert('Reply submitted: ' + replyText);
        setReplyText('');
    };

    return (
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
    );
};

export default Replies;
