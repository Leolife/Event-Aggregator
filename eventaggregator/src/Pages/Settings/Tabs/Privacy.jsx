import React, { useState, useEffect } from 'react';
import { auth, firestore } from '../../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import UserData from '../../../utils/UserData';
import { useNavigate } from 'react-router-dom';
import './Privacy.css';

function Privacy() {
    const [loading, setLoading] = useState(true);
    const [blockedUsers, setBlockedUsers] = useState([]);
    const [blockedUsersInfo, setBlockedUsersInfo] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlockedUsersList = async () => {
            try {
                setLoading(true);
                setError(null);

                // Get current user
                const user = auth.currentUser;
                if (!user) {
                    setError("Please log in to view your blocked users");
                    setLoading(false);
                    return;
                }

                // Get current user data
                const userData = new UserData(user.uid);
                const userDataObj = await userData.getUserData();
                
                // Get blocked users list array
                const blockedList = userDataObj.blockList || [];
                setBlockedUsers(blockedList);

                // If the user has no blocked users, stop here
                if (blockedList.length === 0) {
                    setLoading(false);
                    return;
                }

                // Fetch info for each blocked user
                const blockedDetails = await Promise.all(
                    blockedList.map(async (blockedId) => {
                        try {
                            const blockedUserData = new UserData(blockedId);
                            const name = await blockedUserData.getName();
                            
                            return {
                                uid: blockedId,
                                name: name || 'No name available'
                            };
                        } catch (err) {
                            console.error(`Error fetching blocked user data for ${blockedId}:`, err);
                            return {
                                uid: blockedId,
                                name: 'Unknown User'
                            };
                        }
                    })
                );

                setBlockedUsersInfo(blockedDetails);
                
            } catch (err) {
                console.error("Error fetching blocked users list:", err);
                setError("Failed to load blocked users list. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchBlockedUsersList();
    }, []);

    const handleUnblockUser = async (blockedId) => {
        try {
            // Get current user
            const user = auth.currentUser;
            if (!user) {
                setError("Please log in to manage your blocked users");
                return;
            }

            // Get current user data
            const userData = new UserData(user.uid);
            
            // Get current blocked list
            const currentBlockedList = [...blockedUsers];
            
            // Remove user from blocked list
            const updatedBlockedList = currentBlockedList.filter(id => id !== blockedId);
            
            // Update blockList in Firestore
            await userData.setUserData({ blockList: updatedBlockedList });
            
            // Update local state
            setBlockedUsers(updatedBlockedList);
            setBlockedUsersInfo(blockedUsersInfo.filter(user => user.uid !== blockedId));
            
        } catch (err) {
            console.error("Error unblocking user:", err);
            setError("Failed to unblock user. Please try again later.");
        }
    };

    return (
        <div className="privacy-container">
            <h2>Blocked Accounts</h2>
            <p>Users in this list cannot view your profile nor interact with your content.</p>
            
            {loading ? (
                <div className="loading-message">Loading your blocked users list...</div>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : blockedUsersInfo.length === 0 ? (
                <div className="no-blocked-users-message">
                    <p>You have not blocked any users.</p>
                </div>
            ) : (
                <div className="blocked-users-list">
                    {blockedUsersInfo.map((user) => (
                        <div key={user.uid} className="blocked-user-card">
                            <div className="blocked-user-avatar">
                                <div className="avatar-placeholder">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                            </div>
                            <div className="blocked-user-info">
                                <h3 className="blocked-user-name">{user.name}</h3>
                            </div>
                            <div className="blocked-user-actions">
                                <button 
                                    className="view-profile-btn"
                                    onClick={() => navigate(`/profile/${user.uid}`)}
                                >
                                    View Profile
                                </button>
                                <button 
                                    className="unblock-user-btn"
                                    onClick={() => handleUnblockUser(user.uid)}
                                >
                                    Unblock
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Privacy;
