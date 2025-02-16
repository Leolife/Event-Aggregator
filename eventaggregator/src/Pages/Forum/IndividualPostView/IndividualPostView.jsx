import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './IndividualPostView.css';
import FullPostView from '../../../Components/FullPostView/FullPostView';
import Sidebar from '../../../Components/Sidebar/Sidebar';
import { fetchForumPosts } from '../Forum';

const IndividualPostView = ({ sidebar }) => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const loadPost = async () => {
            setLoading(true);
            try {
                const posts = await fetchForumPosts();
                const foundPost = posts.find(p => p.postId === parseInt(postId));
                setPost(foundPost);
            } catch (error) {
                console.error("Error loading post:", error);
            }
            setLoading(false);
        };
        
        loadPost();
    }, [postId]);

    // Temporary comments array - replace with comments from backend when ready
    const dummyComments = [
        {
            ownerName: "User123 ",
            timestamp: "2 hours ago",
            commentBody: "Great post!"
        },
    ];

    if (loading) {
        return (
            <>
                <Sidebar sidebar={sidebar} />
                <div className={`container ${sidebar ? "" : 'large-container'}`}>
                    <div>Loading post...</div>
                </div>
            </>
        );
    }

    if (!post) {
        return (
            <>
                <Sidebar sidebar={sidebar} />
                <div className={`container ${sidebar ? "" : 'large-container'}`}>
                    <div className="error-message">Post not found</div>
                </div>
            </>
        );
    }

    return (
        <>
            <Sidebar sidebar={sidebar} />
            <div className={`container ${sidebar ? "" : 'large-container'}`}>
                <FullPostView post={post} comments={dummyComments} />
            </div>
        </>
    );
};

export default IndividualPostView;