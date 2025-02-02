import React from 'react';
import { useParams } from 'react-router-dom';
import './IndividualPostView.css';
import FullPostView from '../../../Components/FullPostView/FullPostView';
import Sidebar from '../../../Components/Sidebar/Sidebar';
import { forumPosts } from '../Forum';

const IndividualPostView = ({ sidebar }) => {
    const { postId } = useParams();
    
    // Find the specific post from your posts array
    const post = forumPosts.find(post => post.postId === parseInt(postId));
    
    // Temporary comments array - replace with comments from backend when ready
    const dummyComments = [
        {
            author: "User123 ",
            timestamp: "2 hours ago",
            content: "Great post!"
        },
    ];

    if (!post) {
        return <div className="error-message">Post not found</div>;
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
