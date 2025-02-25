import React, { useEffect, useState } from 'react';
import './ForumSearch.css'
import Sidebar from '../../../Components/Sidebar/Sidebar';
import Forum_post from '../../../Components/Forum_post/Forum_post';
import { fetchForumPosts } from '../../Forum/Forum';

const ForumSearch = ({ sidebar }) => {
    const [posts, setPosts] = useState([]);
        const [loading, setLoading] = useState(true);
    
        useEffect(() => {
            const loadPosts = async () => {
                setLoading(true);
                const fetchedPosts = await fetchForumPosts();
                setPosts(fetchedPosts);
                setLoading(false);
            };
            
            loadPosts();
        }, []);

    return (
        <>
            <div className="forum-search">
                <Sidebar sidebar={sidebar} />
                <div className={`header-container ${sidebar ? "" : 'large-header-container'}`}>
                    <div className="header">
                        <div className="filters">
                            <div className="forum-type">
                                <button className="posts-sort-btn"> Posts </button>
                                <button className="comments-sort-btn"> Comments </button>
                            </div>
                            <div className="forum-sort">
                                <select className="post-sort-dropdown">
                                    <option> Relevance </option>
                                    <option> Hot </option>
                                    <option> Top </option>
                                    <option> New </option>
                                    <option> Comment count </option>
                                </select>
                                <select className="time-sort-dropdown">
                                    <option> All time </option>
                                    <option> Past year </option>
                                    <option> Past month </option>
                                    <option> Past week </option>
                                    <option> Today </option>
                                    <option> Past hour </option>
                                </select>
                            </div>

                        </div>
                    </div>
                </div>
                <div className={`container ${sidebar ? "" : 'large-container'}`}>
                    <div className="forum-feed">
                        {posts.map((post, index) => (
                            <Forum_post key={index} {...post} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ForumSearch
