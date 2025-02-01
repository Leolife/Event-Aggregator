import React from 'react';
import './RecommendedForum.css';
import Sidebar from '../../../Components/Sidebar/Sidebar';
import Forum_post from '../../../Components/Forum_post/Forum_post';
import { forumPosts } from '../../Forum/Forum';


export const RecommendedForum = ({ sidebar }) => {
    return(
        <>
          <Sidebar sidebar={sidebar} />
          <div className={`container ${sidebar ? "" : 'large-container'}`}>
            <div className="forum-feed">
                <h1>Recommended</h1>
                {forumPosts.map((post, index) => (
                    <Forum_post key={index} {...post} />
                ))}
            </div>
          </div>
        </>
    )
}

export default RecommendedForum;
