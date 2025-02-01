import React from 'react';
import './HottestForum.css';
import Sidebar from '../../../Components/Sidebar/Sidebar';
import Forum_post from '../../../Components/Forum_post/Forum_post';
import { forumPosts } from '../../Forum/Forum';


export const HottestForum = ({ sidebar }) => {
    // Sort posts by number of upvotes in descending order
    const sortedPosts = [...forumPosts].sort((a, b) => b.upvotes - a.upvotes);

    return(
        <>
          <Sidebar sidebar={sidebar} />
          <div className={`container ${sidebar ? "" : 'large-container'}`}>
            <div className="forum-feed">
                <h1>Hottest</h1>
                {sortedPosts.map((post, index) => (
                    <Forum_post key={index} {...post} />
                ))}
            </div>
          </div>
        </>
    )
}

export default HottestForum;
