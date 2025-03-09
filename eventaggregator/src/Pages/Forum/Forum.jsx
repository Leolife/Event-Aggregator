import React, { useEffect, useState } from 'react';
import './Forum.css';
import Sidebar from '../../Components/Sidebar/Sidebar';
import ForumPost from '../../Components/Forum_post/Forum_post';
import { fetchForumPosts } from '../Forum/ForumPosts';
import { useSearchParams } from 'react-router-dom';

export const Forum = ({ sidebar }) => {
    // The search parameters in the URL
    const [searchParams, setSearchParams] = useSearchParams();
    // The forum type, either Post or Comment
    const [selectedType] = useState('posts');
    // The sort type: Recommended, Hot, Top, Latest, and Commnet Count. Recommended by default. 
    const [selectedSort, setSelectedSort] = useState('recommended');
    // The query parameter from the URL. Grabs the parameter after "q="
    const queryParam = searchParams.get('q');
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [loading, setLoading] = useState(true);


    function setParams() {
        // Removes the paramater if they're null, such as when the user hasn't searched anything yet.
        setSearchParams(Object.fromEntries(Object.entries({ q: queryParam, type: selectedType, sort: selectedSort}).filter(([_, v]) => v != null)));
    }

    useEffect(() => {
        const loadPosts = async () => {
            setLoading(true);
            const fetchedPosts = await fetchForumPosts();
            // Sort posts by timestamp
            const sortedPosts = [...fetchedPosts].sort((a, b) => a.timestamp - b.timestamp);
            setPosts(sortedPosts);
            setLoading(false);
        };
        loadPosts();
    }, []);

    // Calculates the hottness score (Based on Reddit's algorithm)
    function calcHottness(post) {
        const ageWeight = 1000;
        const age = post.timestamp;
        const voteScore = Math.log(Math.abs(post.upvoteCount - post.downvoteCount) + 1);
        const recencyScore = age / ageWeight;

        return voteScore  + recencyScore
    }

    
    useEffect(() => {
        // Sorts the forum posts when the search parameters change 
        let sortedPosts = [...posts];
        if (selectedSort === "top") {   // Sort by Top
            sortedPosts.sort((a, b) => b.upvoteCount - a.upvoteCount);
        } else if (selectedSort === "hot") {    // Sort by Hottest
            sortedPosts.sort((a, b) => calcHottness(b) - calcHottness(a))
        } else if (selectedSort === "latest") { // Sort by Latest
            sortedPosts.sort((a, b) => a.timestamp - b.timestamp); 
        } else if (selectedSort === "comment") // Sort by Reply Count
            sortedPosts.sort((a, b) => b.replyCount - a.replyCount); 
        
        // Filters the forums based on the search query    
        if (queryParam && selectedType === "posts") {
            sortedPosts = sortedPosts.filter(post => 
                // The query is matched with event name, title, and body 
                post.eventName.toLowerCase().includes(queryParam.toLowerCase()) ||
                post.title.toLowerCase().includes(queryParam.toLowerCase()) ||
                post.body.toLowerCase().includes(queryParam.toLowerCase())
            );
        }
        setFilteredPosts(sortedPosts);
    }, [selectedSort, posts, queryParam])

    useEffect(() => {
        setSelectedSort(searchParams.get('sort'))
    }, [searchParams.get('sort')])

    if (loading) {  // if posts havent loaded in from database yet, it displays loading msg
        return (
            <>
                <Sidebar sidebar={sidebar} />
                <div className={`container ${sidebar ? "" : 'large-container'}`}>
                    <div className="forum-feed">
                        <h1>Forums</h1>
                        <div>Loading posts...</div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="forum-page">
                <Sidebar sidebar={sidebar} />
                <div className={`header-container ${sidebar ? "" : 'large-header-container'}`}>
                    <div className="header">
                        <h1> Forums </h1>
                        <div className="filters">
                            {/* The Post and Comments buttons */}
                            <div className="forum-type">
                                <button className="posts-sort-btn"> Posts </button>
                                <button className="comments-sort-btn"> Comments </button>
                            </div>
                            <div className="forum-sort">
                                {/* The Sort Dropdown Menu */}
                                <select className="post-sort-dropdown"
                                    value={selectedSort}
                                    onChange={e => setSelectedSort(e.target.value)}
                                    onClick={() => setParams()}
                                >
                                    <option value="recommended"> Recommended </option>
                                    <option value="hot"> Hot </option>
                                    <option value="top"> Top </option>
                                    <option value="latest"> Latest </option>
                                    <option value="comment"> Comment count </option>
                                </select>
                            </div>

                        </div>
                    </div>
                </div>
                <div className={`container ${sidebar ? "" : 'large-container'}`}>
                    <div className="forum-feed">
                        {filteredPosts.map((post, index) => (
                            <ForumPost key={index} {...post} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Forum;
