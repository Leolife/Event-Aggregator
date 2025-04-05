import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Forum_post.css';
import UpvoteButton from '../Votes/UpvoteButton';
import DownvoteButton from '../Votes/DownvoteButton';

const Forum_post = ({ postId, eventName, title, body, ownerName, timestamp, upvoteCount, downvoteCount, replyCount, thumbnailID }) => {
  const navigate = useNavigate();
  let timeAgo;
  // Convert minutes to "time ago"
  if (timestamp < 60) {
    timeAgo = `${timestamp} minute${timestamp !== 1 ? 's' : ''} ago`;
  } else if (timestamp < 1440) {
    const hours = Math.floor(timestamp / 60);
    timeAgo = `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  } else if (timestamp < 43200) { // 30 days in minutes
    const days = Math.floor(timestamp / 1440);
    timeAgo = `${days} day${days !== 1 ? 's' : ''} ago`;
  } else if (timestamp < 525600) { // 365 days in minutes
    const months = Math.floor(timestamp / 43200); // Roughly 30 days/month
    timeAgo = `${months} month${timestamp !== 1 ? 's' : ''} ago`;
  } else {
    const years = Math.floor(timestamp / 525600); // 365 days/year
    timeAgo = `${years} year${years !== 1 ? 's' : ''} ago`;
  }

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
            <span>{timeAgo} • {ownerName}</span>
          </div>

          <div className="post-stats">
            <div className="votes">
              <UpvoteButton postId={postId}/>
              <DownvoteButton postId={postId}/>
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
