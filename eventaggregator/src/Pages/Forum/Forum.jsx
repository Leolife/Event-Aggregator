import React, { useEffect, useState } from 'react';
import './Forum.css';
import Sidebar from '../../Components/Sidebar/Sidebar';
import ForumPost from '../../Components/Forum_post/Forum_post';
import { fetchForumPosts } from '../Forum/ForumPosts';
import { useSearchParams } from 'react-router-dom';

export const Forum = ({ sidebar }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedType] = useState('posts');
    const [selectedSort, setSelectedSort] = useState('recommended');
    const [selectedTime, setSelectedTime] = useState('all');
    const queryParam = searchParams.get('q');
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    function setParams() {
        // Removes the paramater if they're null, such as when the user hasn't searched anything yet.
        setSearchParams(Object.fromEntries(Object.entries({ q: queryParam, type: selectedType, sort: selectedSort, t: selectedTime }).filter(([_, v]) => v != null)));
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

    useEffect(() => {
        let sortedPosts = [...posts];
        if (selectedSort === "top" || selectedSort === "hot") {
            sortedPosts.sort((a, b) => b.upvoteCount - a.upvoteCount);
        } else if (selectedSort === "latest") {
            sortedPosts.sort((a, b) => a.timestamp - b.timestamp); 
        } else if (selectedSort === "comment")
            sortedPosts.sort((a, b) => b.replyCount - a.replyCount); 
        

        if (queryParam && selectedType === "posts") {
            sortedPosts = sortedPosts.filter(post => 
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
                            <div className="forum-type">
                                <button className="posts-sort-btn"> Posts </button>
                                <button className="comments-sort-btn"> Comments </button>
                            </div>
                            <div className="forum-sort">
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
                                <select className="time-sort-dropdown"
                                    value={selectedTime}
                                    onChange={e => setSelectedTime(e.target.value)}
                                    onClick={() => setParams()}
                                >
                                    <option value="all"> All time </option>
                                    <option value="year"> Past year </option>
                                    <option value="month"> Past month </option>
                                    <option value="week"> Past week </option>
                                    <option value="day"> Today </option>
                                    <option value="hour"> Past hour </option>
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
