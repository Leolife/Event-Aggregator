import React, { useEffect, useState } from 'react';
import './HottestForum.css';
import Sidebar from '../../../Components/Sidebar/Sidebar';
import Forum_post from '../../../Components/Forum_post/Forum_post';
import { fetchForumPosts } from '../../Forum/ForumPosts';

export const HottestForum = ({ sidebar }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPosts = async () => {
            setLoading(true);
            const fetchedPosts = await fetchForumPosts();
            // Sort posts by number of upvotes in descending order
            const sortedPosts = [...fetchedPosts].sort((a, b) => b.upvoteCount - a.upvoteCount);
            setPosts(sortedPosts);
            setLoading(false);
        };
        
        loadPosts();
    }, []);

    if (loading) {  // if posts havent loaded in from database yet, it displays loading msg
        return (
            <>
                <Sidebar sidebar={sidebar} />
                <div className={`container ${sidebar ? "" : 'large-container'}`}>
                    <div className="forum-feed">
                        <h1>Hottest</h1>
                        <div>Loading posts...</div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Sidebar sidebar={sidebar} />
            <div className={`container ${sidebar ? "" : 'large-container'}`}>
                <div className="forum-feed">
                    <h1>Hottest</h1>
                    {posts.map((post, index) => (
                        <Forum_post key={index} {...post} />
                    ))}
                </div>
            </div>
        </>
    );
};

export default HottestForum;
