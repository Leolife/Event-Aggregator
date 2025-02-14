import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Forum_post.css';

const Forum_post = ({ postId, eventName, title, body, ownerName, timestamp, upvoteCount, downvoteCount, replyCount, thumbnailID }) => {
  const navigate = useNavigate();
  
  return (
    <div className="forum-post" onClick={() => navigate(`/Forum/post/${postId}`)}>
      <div className="post-thumbnail">
        <img src={thumbnailID || "/api/placeholder/64/64"} alt="" />
      </div>
      
      <div className="post-content">
        <span className="post-eventName">{eventName}</span>
        <div className="title-box">
          <h3 className="post-title">{title}</h3>
        </div>
        <div className="post-info">
          <div className="post-meta">
            <span>{timestamp} minutes ago • {ownerName}</span>
          </div>
          
          <div className="post-stats">
            <div className="votes">
              <span className="upvoteCount">{upvoteCount}↑</span>
              <span className="downvoteCount">{downvoteCount}↓</span>
            </div>
            <div className="replyCount">
              See {replyCount} Replies
            </div>
          </div>
        </div>
      </div>

      <div className="body-box">
        <p className="post-body">{body}</p>
      </div>
    </div>
  );
};

export default Forum_post;