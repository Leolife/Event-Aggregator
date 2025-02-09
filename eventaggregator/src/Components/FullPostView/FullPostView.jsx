import React from 'react';
import './FullPostView.css';

const FullPostView = ({ post, comments }) => {
    return (
        <div className="full-post">
            <div className="post-header">
                <h2>{post.event}</h2>
                <h1>{post.title}</h1>
                <div className="post-meta">
                    <span className="ownerName">Posted by {post.ownerName}</span>
                    <span className="votes">
                        <span className="upvoteCount">{post.upvoteCount}</span>
                        <span className="downvoteCount">{post.downvoteCount}</span>
                    </span>
                </div>
            </div>
            
            <div className="post-content">
                <img src={post.thumbnailID} alt="Post thumbnail" className="post-thumbnail" />
                <p className="post-text">{post.body}</p>
            </div>

            <div className="comments-section">
                <h3>Comments ({comments?.length || 0})</h3>
                <div className="comments-list">
                    {comments?.map((comment, index) => (
                        <div key={index} className="comment">
                            <div className="comment-header">
                                <span className="comment-ownerName">{comment.ownerName}</span>
                                <span className="comment-timestamp">{comment.timestamp}</span>
                            </div>
                            <p className="comment-body">{comment.commentBody}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FullPostView;
