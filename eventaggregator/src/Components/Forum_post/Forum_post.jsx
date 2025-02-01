import React from 'react';
import './Forum_post.css';

const Forum_post = ({ event, title, preview, author, timestamp, upvotes, downvotes, replies, thumbnail }) => {
  return (
    <div className="forum-post">
      <div className="post-thumbnail">
        <img src={thumbnail || "/api/placeholder/64/64"} alt="" />
      </div>
      
      <div className="post-content">
        <span className="post-event">{event}</span>
        <div className="title-box">
          <h3 className="post-title">{title}</h3>
        </div>
        <div className="post-info">
          <div className="post-meta">
            <span>{timestamp} minutes ago • {author}</span>
          </div>
          
          <div className="post-stats">
            <div className="votes">
              <span className="upvotes">{upvotes}↑</span>
              <span className="downvotes">{downvotes}↓</span>
            </div>
            <div className="replies">
              See {replies} Replies
            </div>
          </div>
        </div>
      </div>

      <div className="preview-box">
        <p className="post-preview">{preview}</p>
      </div>
    </div>
  );
};

export default Forum_post;