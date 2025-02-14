import React from 'react';
import './LatestForum.css';
import Sidebar from '../../../Components/Sidebar/Sidebar';
import Forum_post from '../../../Components/Forum_post/Forum_post';
import { forumPosts } from '../../Forum/Forum';


export const LatestForum = ({ sidebar }) => {
    // Sort posts by timestamp
    const sortedPosts = [...forumPosts].sort((a, b) => a.timestamp - b.timestamp);

    return(
        <>
          <Sidebar sidebar={sidebar} />
          <div className={`container ${sidebar ? "" : 'large-container'}`}>
            <div className="forum-feed">
                <h1>Latest</h1>
                {sortedPosts.map((post, index) => (
                    <Forum_post key={index} {...post} />
                ))}
            </div>
          </div>
        </>
    )
}

export default LatestForum;
