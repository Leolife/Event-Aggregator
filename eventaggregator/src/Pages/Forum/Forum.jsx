import { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../firebase';
import thumbnail1 from '../../assets/thumbnail1.png';

// will hold post data, but initialize it as empty
export let forumPosts = [];

// fetches posts that can be called when needed
export const fetchForumPosts = async () => {
    try {
        const forumCollection = collection(firestore, 'forum');
        const forumSnapshot = await getDocs(forumCollection);
        
        forumPosts = forumSnapshot.docs.map(doc => ({
            postId: doc.data().postId || doc.id,
            eventName: doc.data().eventName || '',
            title: doc.data().title || '',
            body: doc.data().body || '',
            ownerName: doc.data().ownerName || '',
            timestamp: doc.data().timestamp ? Math.floor((Date.now() - doc.data().timestamp.toDate()) / 60000) : 0,  // calculates in terms of minutes
            upvoteCount: doc.data().upvoteCount || 0,
            downvoteCount: doc.data().downvoteCount || 0,
            replyCount: doc.data().replyCount || 0,
            thumbnailID: doc.data().thumbnailID || thumbnail1  // using LoL as a filler image if none exists because LoL > default error pic
        }));

        return forumPosts;
    } catch (error) {
        console.error("Error fetching forum posts:", error);
        return [];
    }
};

export const Forum = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // loads forum posts then sets loading boolean to false
        fetchForumPosts().then(() => {
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        // redirect if exactly at /forum
        if (window.location.pathname === '/Forum') {
            navigate('/forum/recommended');
        }
    }, [navigate]);
    
    if (loading) {
        return <div>Loading forum posts...</div>;
    }
    
    return <Outlet />;
}

export default Forum;
