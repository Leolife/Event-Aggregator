import React, { useEffect, useState } from 'react';
import './RecommendedForum.css';
import Sidebar from '../../../Components/Sidebar/Sidebar';
import Forum_post from '../../../Components/Forum_post/Forum_post';
import { fetchForumPosts } from '../../Forum/Forum';

export const RecommendedForum = ({ sidebar }) => {
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

    if (loading) {
        return (
            <>
                <Sidebar sidebar={sidebar} />
                <div className={`container ${sidebar ? "" : 'large-container'}`}>
                    <div className="forum-feed">
                        <h1>Recommended</h1>
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
                    <h1>Recommended</h1>
                    {posts.map((post, index) => (
                        <Forum_post key={index} {...post} />
                    ))}
                </div>
            </div>
        </>
    );
};

export default RecommendedForum;