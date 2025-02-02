import React from 'react';
import './FullPostView.css';

const FullPostView = ({ post, comments }) => {
    return (
        <div className="full-post">
            <div className="post-header">
                <h2>{post.event}</h2>
                <h1>{post.title}</h1>
                <div className="post-meta">
                    <span className="author">Posted by {post.author}</span>
                    <span className="votes">
                        <span className="upvotes">{post.upvotes}</span>
                        <span className="downvotes">{post.downvotes}</span>
                    </span>
                </div>
            </div>
            
            <div className="post-content">
                <img src={post.thumbnail} alt="Post thumbnail" className="post-thumbnail" />
                <p className="post-text">{post.preview}</p>
            </div>

            <div className="comments-section">
                <h3>Comments ({comments?.length || 0})</h3>
                <div className="comments-list">
                    {comments?.map((comment, index) => (
                        <div key={index} className="comment">
                            <div className="comment-header">
                                <span className="comment-author">{comment.author}</span>
                                <span className="comment-timestamp">{comment.timestamp}</span>
                            </div>
                            <p className="comment-content">{comment.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FullPostView;
