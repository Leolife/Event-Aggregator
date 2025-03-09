import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './IndividualPostView.css';
import FullPostView from '../../../Components/FullPostView/FullPostView';
import Sidebar from '../../../Components/Sidebar/Sidebar';
import { fetchForumPosts } from '../ForumPosts';
import '../AddPostButton.css'
import AddPostButton from '../AddPostButton';
import Overlays from '../../../Components/Overlays';

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

    // temp comments array - replace with comments from backend when ready
    const dummyComments = [
        {
            ownerName: "User123 ",
            timestamp: "2 hours ago",
            commentBody: "Great post!"
        },
    ];

    if (loading) {  // if posts havent loaded in from database yet, it displays loading msg
        return (
            <>
                <Sidebar sidebar={sidebar} />
                <div className={`container ${sidebar ? "" : 'large-container'}`}>
                    <div>Loading post...</div>
                </div>

                <AddPostButton />
            </>
        );
    }

    if (!post) {  // error msg if post does not exist
        return (
            <>
                <Sidebar sidebar={sidebar} />
                <div className={`container ${sidebar ? "" : 'large-container'}`}>
                    <div className="error-message">Post not found</div>
                </div>
                <AddPostButton />
            </>
        );
    }

    return (
        <>
            <Sidebar sidebar={sidebar} />
            <div className={`container ${sidebar ? "" : 'large-container'}`}>
                <FullPostView post={post} comments={dummyComments} />
            </div>
            <AddPostButton />
        </>
    );
};

export default IndividualPostView;
