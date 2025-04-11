import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Forum_post.css';
import { formatDistanceToNow } from 'date-fns'; // Import the necessary function
import VoteControls from '../Votes/VoteControls';

const Forum_post = ({ postId, eventName, title, body, ownerName, ownerId, timestamp, upvoteCount, downvoteCount, replyCount, thumbnailID }) => {
  const navigate = useNavigate();
  const timestampInMilliseconds = timestamp * 60 * 1000; // Convert minutes to milliseconds
  const date = new Date(Date.now() - timestampInMilliseconds); // Subtract to get the past date
  const timeAgo = formatDistanceToNow(date, { addSuffix: true });
  

  return (
    //Route to individual post
    <div className="forum-post linkable" onClick={() => navigate(`/Forum/post/${postId}`)}>
      <div className="post-thumbnail" >
        <img src={thumbnailID || "/api/placeholder/64/64"} alt="" />
      </div>

      <div className="post-content">
        <span className="post-eventName">{eventName}</span>
        <div className="title-box">
          <h3 className="post-title">{title}</h3>
        </div>
        <div className="post-info">
          <div className="post-meta">
            <span> 
              {timeAgo} • <span 
                className="profile-link" 
                onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/profile/${ownerId}`)
                  }
                }
              >
                  {ownerName}
              </span>
            </span>
          </div>

          <div className="post-stats">
            <div className="votes" onClick={(e) => e.stopPropagation()}>
              <VoteControls postId={postId} userId={ownerId}/>
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
