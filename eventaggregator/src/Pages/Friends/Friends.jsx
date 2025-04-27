import React, { useEffect, useState } from 'react';
import { auth } from '../../firebase';
import Sidebar from '../../Components/Sidebar/Sidebar';
import './Friends.css';
import UserData from '../../utils/UserData';
import { useNavigate, useLocation } from 'react-router-dom';


export const Friends = ({ sidebar }) => {
    const [loading, setLoading] = useState(true);
    const [friendsList, setFriendsList] = useState([]);
    const [friendsInfo, setFriendsInfo] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
        useEffect(() => {
        const tabQuery = new URLSearchParams(location.search).get('tab');
        if (tabQuery === 'requests') {
            setActiveTab('requests');
        }
        }, [location]);

    
    // New state variables for friend requests
    const [activeTab, setActiveTab] = useState('friends'); // 'friends' or 'requests'
    const [friendRequests, setFriendRequests] = useState([]);
    const [requestsInfo, setRequestsInfo] = useState([]);
    const [loadingRequests, setLoadingRequests] = useState(true);

    useEffect(() => {
        const fetchFriendsList = async () => {
            try {
                setLoading(true);
                setError(null);

                // Get current user
                const user = auth.currentUser;
                if (!user) {
                    setError("Please log in to view your friends list");
                    setLoading(false);
                    return;
                }

                // Get current user data
                const userData = new UserData(user.uid);
                const userDataObj = await userData.getUserData();
                
                // Get friends list array
                const friends = userDataObj.friendsList || [];
                setFriendsList(friends);

                // If the user has no friends, stop here
                if (friends.length === 0) {
                    setLoading(false);
                    return;
                }

                // Fetch info for each friend
                const friendDetails = await Promise.all(
                    friends.map(async (friendId) => {
                        try {
                            const friendData = new UserData(friendId);
                            const name = await friendData.getName();
                            const bio = await friendData.getBio();
                            const profilePicture = await friendData.getProfilePicture();
                            
                            return {
                                uid: friendId,
                                name: name || 'No name available',
                                bio: bio || 'No bio available',
                                profilePicture: profilePicture || ''
                            };
                        } catch (err) {
                            console.error(`Error fetching friend data for ${friendId}:`, err);
                            return {
                                uid: friendId,
                                name: 'Unknown User',
                                bio: 'User information not available',
                                profilePicture: ''
                            };
                        }
                    })
                );

                setFriendsInfo(friendDetails);
                
            } catch (err) {
                console.error("Error fetching friends list:", err);
                setError("Failed to load friends list. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchFriendsList();
    }, []);

    // New useEffect to fetch friend requests
    useEffect(() => {
        const fetchFriendRequests = async () => {
            try {
                setLoadingRequests(true);
                
                // Get current user
                const user = auth.currentUser;
                if (!user) {
                    setLoadingRequests(false);
                    return;
                }

                // Get current user data
                const userData = new UserData(user.uid);
                const userDataObj = await userData.getUserData();
                
                // Get incoming friend requests array
                const requests = userDataObj.incomingFriendRequests || [];
                setFriendRequests(requests);

                // If no requests, stop here
                if (requests.length === 0) {
                    setLoadingRequests(false);
                    return;
                }

                // Fetch info for each requester
                const requestDetails = await Promise.all(
                    requests.map(async (requesterId) => {
                        try {
                            const requesterData = new UserData(requesterId);
                            const name = await requesterData.getName();
                            const bio = await requesterData.getBio();
                            const profilePicture = await requesterData.getProfilePicture();
                            
                            return {
                                uid: requesterId,
                                name: name || 'No name available',
                                bio: bio || 'No bio available',
                                profilePicture: profilePicture || ''
                            };
                        } catch (err) {
                            console.error(`Error fetching requester data for ${requesterId}:`, err);
                            return {
                                uid: requesterId,
                                name: 'Unknown User',
                                bio: 'User information not available',
                                profilePicture: ''
                            };
                        }
                    })
                );

                setRequestsInfo(requestDetails);
            } catch (err) {
                console.error("Error fetching friend requests:", err);
            } finally {
                setLoadingRequests(false);
            }
        };

        fetchFriendRequests();
    }, []);

    const handleRemoveFriend = async (friendId) => {
        try {
            // Get current user
            const user = auth.currentUser;
            if (!user) {
                setError("Please log in to manage your friends list");
                return;
            }

            // Get current user data
            const userData = new UserData(user.uid);
            
            // Get current friends list
            const currentFriendsList = [...friendsList];
            
            // Remove friend from list
            const updatedFriendsList = currentFriendsList.filter(id => id !== friendId);
            
            // Update friendsList in Firestore
            await userData.setUserData({ friendsList: updatedFriendsList });
            
            // Update local state
            setFriendsList(updatedFriendsList);
            setFriendsInfo(friendsInfo.filter(friend => friend.uid !== friendId));
            
        } catch (err) {
            console.error("Error removing friend:", err);
            setError("Failed to remove friend. Please try again later.");
        }
    };

    // New handlers for friend requests
    const handleAcceptRequest = async (requesterId) => {
        try {
            // Get current user
            const user = auth.currentUser;
            if (!user) {
                setError("Please log in to manage friend requests");
                return;
            }
    
            // Get current user data
            const userData = new UserData(user.uid);
            const userDataObj = await userData.getUserData();
            
            // Get current friends list and requests list
            const currentFriendsList = userDataObj.friendsList || [];
            const currentRequests = userDataObj.incomingFriendRequests || [];
            
            // Add requester to current user's friends list
            const newFriendsList = [...currentFriendsList, requesterId];
            
            // Remove requester from incoming requests
            const newRequests = currentRequests.filter(id => id !== requesterId);
            
            // Update current user's data in Firestore
            await userData.setUserData({ 
                friendsList: newFriendsList,
                incomingFriendRequests: newRequests
            });
            
            // Also update the requester's friendsList to include the current user
            const requesterData = new UserData(requesterId);
            const requesterDataObj = await requesterData.getUserData();
            const requesterFriendsList = requesterDataObj.friendsList || [];
            
            // Add current user to requester's friends list (if not already there)
            if (!requesterFriendsList.includes(user.uid)) {
                const updatedRequesterFriendsList = [...requesterFriendsList, user.uid];
                await requesterData.setUserData({ 
                    friendsList: updatedRequesterFriendsList 
                });
            }
            
            // Update local state
            setFriendsList(newFriendsList);
            setFriendRequests(newRequests);
            
            // Move the accepted request from requestsInfo to friendsInfo
            const acceptedRequest = requestsInfo.find(req => req.uid === requesterId);
            if (acceptedRequest) {
                setFriendsInfo([...friendsInfo, acceptedRequest]);
                setRequestsInfo(requestsInfo.filter(req => req.uid !== requesterId));
            }
            
        } catch (err) {
            console.error("Error accepting friend request:", err);
            setError("Failed to accept friend request. Please try again later.");
        }
    };

    const handleDeclineRequest = async (requesterId) => {
        try {
            // Get current user
            const user = auth.currentUser;
            if (!user) {
                setError("Please log in to manage friend requests");
                return;
            }

            // Get current user data
            const userData = new UserData(user.uid);
            const userDataObj = await userData.getUserData();
            
            // Get current requests list
            const currentRequests = userDataObj.incomingFriendRequests || [];
            
            // Remove requester from incoming requests
            const newRequests = currentRequests.filter(id => id !== requesterId);
            
            // Update requests in Firestore
            await userData.setUserData({ incomingFriendRequests: newRequests });
            
            // Update local state
            setFriendRequests(newRequests);
            setRequestsInfo(requestsInfo.filter(req => req.uid !== requesterId));
            
        } catch (err) {
            console.error("Error declining friend request:", err);
            setError("Failed to decline friend request. Please try again later.");
        }
    };

    return (
        <>
            <Sidebar sidebar={sidebar} />
            <div className={`container ${sidebar ? "" : 'large-container'}`}>
                <div className="friends-container">
                    <div className="friends-header">
                        <h1>Friends List</h1>
                        
                        {/* Tab navigation */}
                        <div className="friends-tabs">
                            <button 
                                className={`tab-button ${activeTab === 'friends' ? 'active' : ''}`}
                                onClick={() => setActiveTab('friends')}
                            >
                                Friends
                            </button>
                            <button 
                                className={`tab-button ${activeTab === 'requests' ? 'active' : ''}`}
                                onClick={() => setActiveTab('requests')}
                            >
                                Friend Requests
                                {friendRequests.length > 0 && (
                                    <span className="request-badge">{friendRequests.length}</span>
                                )}
                            </button>
                        </div>
                    </div>
                    
                    {/* Friends Tab Content */}
                    {activeTab === 'friends' && (
                        <>
                            {loading ? (
                                <div className="loading-message">Loading your friends list...</div>
                            ) : error ? (
                                <div className="error-message">{error}</div>
                            ) : friendsInfo.length === 0 ? (
                                <div className="no-friends-message">
                                    <p>You don't have any friends added yet.</p>
                                    <p>Find users to add them as friends!</p>
                                </div>
                            ) : (
                                <div className="friends-list">
                                    {friendsInfo.map((friend) => (
                                        <div key={friend.uid} className="friend-card">
                                            <div className="friend-avatar">
                                                {friend.profilePicture ? (
                                                    <img 
                                                        src={friend.profilePicture} 
                                                        alt={`${friend.name}'s profile`} 
                                                    />
                                                ) : (
                                                    <div className="avatar-placeholder">
                                                        {friend.name.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="friend-info">
                                                <h3 className="friend-name">{friend.name}</h3>
                                                <p className="friend-bio">{friend.bio}</p>
                                            </div>
                                            <div className="friend-actions">
                                                <button 
                                                    className="view-profile-btn"
                                                    onClick={() => navigate(`/profile/${friend.uid}`)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    View Profile
                                                </button>
                                                <button 
                                                    className="remove-friend-btn"
                                                    onClick={() => handleRemoveFriend(friend.uid)}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                    
                    {/* Friend Requests Tab Content */}
                    {activeTab === 'requests' && (
                        <>
                            {loadingRequests ? (
                                <div className="loading-message">Loading friend requests...</div>
                            ) : requestsInfo.length === 0 ? (
                                <div className="no-friends-message">
                                    <p>You don't have any pending friend requests.</p>
                                </div>
                            ) : (
                                <div className="friends-list">
                                    {requestsInfo.map((requester) => (
                                        <div key={requester.uid} className="friend-card">
                                            <div className="friend-avatar">
                                                {requester.profilePicture ? (
                                                    <img 
                                                        src={requester.profilePicture} 
                                                        alt={`${requester.name}'s profile`} 
                                                    />
                                                ) : (
                                                    <div className="avatar-placeholder">
                                                        {requester.name.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="friend-info">
                                                <h3 className="friend-name">{requester.name}</h3>
                                                <p className="friend-bio">{requester.bio}</p>
                                            </div>
                                            <div className="friend-request-actions">
                                                <div className="request-decision-buttons">
                                                    <button 
                                                        className="accept-request-btn"
                                                        onClick={() => handleAcceptRequest(requester.uid)}
                                                    >
                                                        Accept
                                                    </button>
                                                    <button 
                                                        className="decline-request-btn"
                                                        onClick={() => handleDeclineRequest(requester.uid)}
                                                    >
                                                        Decline
                                                    </button>
                                                </div>
                                                <button 
                                                    className="view-profile-btn"
                                                    onClick={() => navigate(`/profile/${requester.uid}`)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    View Profile
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default Friends;
