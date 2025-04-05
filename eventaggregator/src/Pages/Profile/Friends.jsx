import React, { useEffect, useState } from 'react';
import { auth } from '../../firebase';
import Sidebar from '../../Components/Sidebar/Sidebar';
import './Friends.css';
import UserData from '../../utils/UserData';

export const Friends = ({ sidebar }) => {
    const [loading, setLoading] = useState(true);
    const [friendsList, setFriendsList] = useState([]);
    const [friendsInfo, setFriendsInfo] = useState([]);
    const [error, setError] = useState(null);

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

    return (
        <>
            <Sidebar sidebar={sidebar} />
            <div className={`container ${sidebar ? "" : 'large-container'}`}>
                <div className="friends-container">
                    <div className="friends-header">
                        <h1>Friends List</h1>
                    </div>
                    
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
                                            onClick={() => window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ')}
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
                </div>
            </div>
        </>
    );
};

export default Friends;
