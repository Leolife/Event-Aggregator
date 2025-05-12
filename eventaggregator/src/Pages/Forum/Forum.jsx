import React, { useEffect, useState } from 'react';
import './Forum.css';
import Sidebar from '../../Components/Sidebar/Sidebar';
import ForumPost from '../../Components/Forum_post/Forum_post';
import { fetchForumPosts, fetchReplies } from '../Forum/ForumPosts';
import { useSearchParams } from 'react-router-dom';
import './AddPostButton'
import './AddPostButton.css'
import Replies from '../../Components/FullPostView/Replies';
import AddPostButton from './AddPostButton';
import UserData from '../../utils/UserData';
import { auth } from '../../firebase';
import Interests from '../Settings/Tabs/Interests';
const user = auth.currentUser

export const Forum = ({ sidebar }) => {
    // The search parameters in the URL
    const [searchParams, setSearchParams] = useSearchParams();
    // The forum type, either Post or Comment
    const [selectedType, setSelectedType] = useState('posts');
    // The sort type: Recommended, Hot, Top, Latest, and Commnet Count. Recommended by default. 
    const [selectedSort, setSelectedSort] = useState('recommended');
    // The query parameter from the URL. Grabs the parameter after "q="
    const queryParam = searchParams.get('q');
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [replies, setReplies] = useState([]);
    const [interest, setInterest] = useState([]);
    const [filteredReplies, setFilteredReplies] = useState([])


    function setParams() {
        // Removes the paramater if they're null, such as when the user hasn't searched anything yet.
        setSearchParams(Object.fromEntries(Object.entries({ q: queryParam, type: selectedType, sort: selectedSort }).filter(([_, v]) => v != null)));
    }


    useEffect(() => {
        const loadPosts = async () => {
            setLoading(true);
            const fetchedPosts = await fetchForumPosts();
            const fetchedReplies = await fetchReplies();
            // Sort posts by timestamp
            const sortedPosts = [...fetchedPosts].sort((a, b) => a.timestamp - b.timestamp);
            setReplies(fetchedReplies)
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

        return voteScore + recencyScore
    }


    const handleSelectType = async (type) => {
        setSelectedType(type)
        setSearchParams(Object.fromEntries(Object.entries({ q: queryParam, type: type, sort: selectedSort }).filter(([_, v]) => v != null)));
    }

    // Ranks forums based on interest
    const getInterestScore = (post) => {
        const combined = `${post.title} ${post.body} ${post.eventName}`.toLowerCase();
        const matches = combined.match(new RegExp(interest, 'g')); // global match
        return matches ? matches.length : 0; // number of times interest appears
    };

    // Fetches user interests for recommended forums
    useEffect(() => {
        const getInterests = async () => {
            const user = auth.currentUser
            if (user) {
                const userId = user.uid
                const userData = new UserData(userId);
                console.log(userId)
                const userInterests = await userData.getQuestionnaire();
                setInterest(userInterests)
            }
        }
        getInterests()
    }, [auth.currentUser])


    useEffect(() => {

        // Sorts the forum posts when the search parameters change 
        let sortedPosts = [...posts];
        let sortedReplies = [...replies];
        if (selectedSort === "top") {   // Sort by Top
            sortedPosts.sort((a, b) => b.upvoteCount - a.upvoteCount);
        } else if (selectedSort === "hot") {    // Sort by Hottest
            sortedPosts.sort((a, b) => calcHottness(b) - calcHottness(a))
        } else if (selectedSort === "latest") { // Sort by Latest
            sortedPosts.sort((a, b) => a.timestamp - b.timestamp);
        } else if (selectedSort === "comment") { // Sort by Reply Count
            sortedPosts.sort((a, b) => b.replyCount - a.replyCount)
        } else if (selectedSort === "recommended") { // Sort by user's itnerests 
            if (interest) {
                sortedPosts.sort((a, b) => getInterestScore(b) - getInterestScore(a));
            }
        }


        // Filters the forums based on the search query    
        if (queryParam && selectedType === "posts") {
            sortedPosts = sortedPosts.filter(post =>
                // The query is matched with event name, title, and body 
                post.eventName.toLowerCase().includes(queryParam.toLowerCase()) ||
                post.title.toLowerCase().includes(queryParam.toLowerCase()) ||
                post.body.toLowerCase().includes(queryParam.toLowerCase())
            );
        }
        if (queryParam && selectedType === "comments") {
            sortedReplies = sortedReplies.filter(reply =>
                reply.commentBody.toLowerCase().includes(queryParam.toLowerCase())
            )
            setFilteredReplies(sortedReplies)
        }
        if (selectedType !== "comments") {
            setFilteredPosts(sortedPosts);
        }

    }, [selectedSort, selectedType, posts, replies, queryParam])

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
                            <div className="forum-type" style={{ visibility: queryParam ? "visible" : "hidden" }}>
                                <button onClick={() => handleSelectType("posts")} className="posts-sort-btn"> Posts </button>
                                <button onClick={() => handleSelectType("comments")} className="comments-sort-btn"> Comments </button>
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
                        {selectedType === "posts" ? (
                            filteredPosts.map((post, index) => (
                                <ForumPost key={index} {...post} />
                            ))
                        ) : (
                            filteredReplies.map((reply) => (
                                <div key={reply.id} className="comment-box">
                                    <div className="author-info">
                                        <div className="author-avatar">
                                            {reply.ownerName?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                        <span>{reply.ownerName}</span>
                                        <span className="post-time">{new Date(reply.timestamp?.toDate()).toLocaleString()}</span>
                                    </div>
                                    <p className="post-body">{reply.commentBody}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                <AddPostButton />
            </div>
        </>
    );
};

export default Forum;
