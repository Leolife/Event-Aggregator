import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Forum_post.css';
import UpvoteButton from '../Votes/UpvoteButton';
import DownvoteButton from '../Votes/DownvoteButton';
import { formatDistanceToNow } from 'date-fns'; // Import the necessary function

const Forum_post = ({ postId, eventName, title, body, ownerName, timestamp, upvoteCount, downvoteCount, replyCount, thumbnailID }) => {
  const navigate = useNavigate();
  const timestampInMilliseconds = timestamp * 60 * 1000; // Convert minutes to milliseconds
  const date = new Date(Date.now() - timestampInMilliseconds); // Subtract to get the past date
  const timeAgo = formatDistanceToNow(date, { addSuffix: true });
  

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
