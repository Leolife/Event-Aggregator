import React, { useEffect, useState } from 'react';
import './Profile.css';
import Sidebar from '../../Components/Sidebar/Sidebar';
import headerimage from '../../assets/blockListheader.png';
import profileimage from '../../assets/blockListpfp.png';
import { auth } from '../../firebase';
import { Link, useParams } from "react-router-dom";
import UserData from '../../utils/UserData';
import Overlays from '../../Components/Overlays';
import { sendInAppNotification } from '../../utils/notificationUtils';

// Include all tabs from the tabs folder
import About from './Tabs/About';
import UserCalendar from './Tabs/UserCalendar';
import UsersPosts from './Tabs/UserPosts';
import Comments from './Tabs/Comments';
import UpVoted from './Tabs/UpVoted';
import DownVoted from './Tabs/DownVoted';

export const Profile = ({ sidebar }) => {
    const [editMode, setEditMode] = useState(false);
    const [activeTab, setActiveTab] = useState('About');

    const [profileName, setProfileName] = useState("");
    // Temporary state for holding the edited name
    const [tempProfileName, setTempProfileName] = useState("");
    // Flag for whether the profile name is in inline edit mode
    const [editingProfileName, setEditingProfileName] = useState(false);

    const [profilePicture, setProfilePicture] = useState("");
    const [tempProfilePicture, setTempProfilePicture] = useState("");

    const [profileBanner, setProfileBanner] = useState("");
    const [tempProfileBanner, setTempProfileBanner] = useState("");

    const [profileFavorites, setProfileFavorites] = useState([]);
    const [profileCalendars, setProfileCalendars] = useState([]);

    const [bio, setBio] = useState("");
    const [isFriend, setIsFriend] = useState(false);
    const [friendshipChecked, setFriendshipChecked] = useState(false);
    
    // State for the three-dot menu
    const [showDropdown, setShowDropdown] = useState(false);
    
    // New state for block status
    const [isBlocked, setIsBlocked] = useState(false);
    const [blockCheckComplete, setBlockCheckComplete] = useState(false);

    const { userId } = useParams();

    // Determine if the current authenticated user is the owner of the profile
    const currentUser = auth.currentUser;
    const isOwner = currentUser && currentUser.uid === userId;

    // modal control for editing mode
    const [modalType, setModalType] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const openModal = (type) => {
        setModalType(type);
        setIsOpen(true);
    }

    // page setup
    useEffect(() => {
        const fetchProfileData = async () => {
            const user = auth.currentUser;
            
            // If not the profile owner, check block status first
            if (user && user.uid !== userId) {
                // Check if either user has blocked the other
                const isBlocked = await checkBlockStatus(user.uid, userId);
                setIsBlocked(isBlocked);
                setBlockCheckComplete(true);
                
                // If blocked, don't fetch profile data
                if (isBlocked) {
                    setProfileName("User");
                    setProfilePicture("");
                    setProfileBanner("");
                    setBio("");
                    return;
                }
            } else {
                // If viewing own profile or not logged in, no block check needed
                setBlockCheckComplete(true);
            }
            
            const userData = new UserData(userId);
            const userName = await userData.getName();
            const picture = await userData.getProfilePicture();
            const banner = await userData.getProfileBanner();
            const userBio = await userData.getBio();
            const userFavorites = await userData.getFavorites();
            const userCalendars = await userData.getCalendars();

            setProfileName(userName);
            setProfilePicture(picture);
            setProfileBanner(banner);
            setProfileFavorites(userFavorites);
            setProfileCalendars(userCalendars);
            setBio(userBio);

            if (user) {
                setTempProfileBanner(banner); // Initialize temp banner
                setTempProfilePicture(picture); // Initialize temp picture

                // Check if the logged-in user is friends with the profile user
                checkFriendshipStatus(user.uid, userId);
            }
        };
        fetchProfileData();
    }, [userId]);

    // Function to check if either user has blocked the other
    const checkBlockStatus = async (currentUserId, profileUserId) => {
        try {
            // First check if current user has blocked profile user
            const currentUserData = new UserData(currentUserId);
            const currentUserObj = await currentUserData.getUserData();
            const currentUserBlockList = currentUserObj.blockList || [];
            
            if (currentUserBlockList.includes(profileUserId)) {
                return true; // Current user has blocked profile user
            }
            
            // Then check if profile user has blocked current user
            const profileUserData = new UserData(profileUserId);
            const profileUserObj = await profileUserData.getUserData();
            const profileUserBlockList = profileUserObj.blockList || [];
            
            if (profileUserBlockList.includes(currentUserId)) {
                return true; // Profile user has blocked current user
            }
            
            return false; // No block in either direction
        } catch (error) {
            console.error("Error checking block status:", error);
            return false; // Default to not blocked on error
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showDropdown && !event.target.closest('.profile-actions-dropdown')) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [showDropdown]);

    // Check if the current user is friends with the profile user
    const checkFriendshipStatus = async (currentUserId, profileUserId) => {
        if (currentUserId === profileUserId) {
            // User is viewing their own profile, no need to check friendship
            setFriendshipChecked(true);
            return;
        }

        try {
            const userData = new UserData(currentUserId);
            const userDataObj = await userData.getUserData();
            
            // Check if the user has a friendsList and if it contains the profile user
            const friendsList = userDataObj.friendsList || [];
            setIsFriend(friendsList.includes(profileUserId));
            setFriendshipChecked(true);
        } catch (error) {
            console.error("Error checking friendship status:", error);
            setIsFriend(false);
            setFriendshipChecked(true);
        }
    };

    // Handler for add friend button
    const handleAddFriend = async () => {
        try {
            // Get current user
            const user = auth.currentUser;
            if (!user) {
                console.error("You must be logged in to add friends");
                return;
            }
    
            // Get the target user's data
            const targetUserData = new UserData(userId);
            const targetUserObj = await targetUserData.getUserData();
            
            // Check if the incomingFriendRequests array exists, if not create it
            let currentRequests = targetUserObj.incomingFriendRequests || [];
            
            // Check if the request is already pending to avoid duplicates
            if (currentRequests.includes(user.uid)) {
                console.log("Friend request already sent");
                return;
            }
            
            // Add current user's UID to the target user's incomingFriendRequests
            currentRequests.push(user.uid);
            
            // Update the target user's document with the new incomingFriendRequests array
            await targetUserData.setUserData({ incomingFriendRequests: currentRequests });
            
            console.log("Friend request sent successfully");
            
            const fromUserData = new UserData(user.uid);
            const senderName = user.displayName || await fromUserData.getName() || "Someone";
            
            console.log("Sending notification to", userId, "from", senderName);
            
            await sendInAppNotification(
              userId,
              "New Friend Request",
              `${senderName} sent you a friend request.`,
               "/friends?tab=requests"
            );
            
            console.log("Notification sent");
            // Close the dropdown after sending request
            setShowDropdown(false);
        } catch (error) {
            console.error("Error sending friend request:", error);
        }
    };

    // Handler for block user button
    const handleBlockUser = async () => {
        try {
            const user = auth.currentUser;
            if (!user) {
                console.error("You must be logged in to block users");
                return;
            }
            
            // Get current user data
            const userData = new UserData(user.uid);
            const userDataObj = await userData.getUserData();
            
            // Initialize blockList if it doesn't exist
            const blockList = userDataObj.blockList || [];
            
            // Check if user is already blocked
            if (blockList.includes(userId)) {
                console.log("User is already blocked");
                return;
            }
            
            // Add user to block list
            blockList.push(userId);
            
            // Save updated block list
            await userData.setUserData({ blockList });
            
            // Update UI state
            setIsBlocked(true);
            setShowDropdown(false);
            
            console.log("User blocked successfully");
        } catch (error) {
            console.error("Error blocking user:", error);
        }
    };

    // Toggle dropdown menu
    const toggleDropdown = (e) => {
        e.stopPropagation(); // Prevent event bubbling
        setShowDropdown(!showDropdown);
    };

    // Callback to receive the new banner link from the modal
    const handleBannerSubmit = (link) => {
        setTempProfileBanner(link);
        // Optionally, close the modal here or leave that to the modal itself
        setIsOpen(false);
    };

    // Callback to receive the new picture link from the modal
    const handlePictureSubmit = (link) => {
        setTempProfilePicture(link);
        // Optionally, close the modal here or leave that to the modal itself
        setIsOpen(false);
    };

    // Whenever the saved profileName is updated, update the temporary name
    useEffect(() => {
        setTempProfileName(profileName);
    }, [profileName]);

    const handleEditClick = () => {
        setEditMode(true);
    };

    // Global "Save Changes" button handler: update database then commit changes locally
    const handleSaveClick = async () => {
        const user = auth.currentUser;
        if (user) {
            const userData = new UserData(user.uid);
            // Update the name in backend
            await userData.setName(tempProfileName);
            // Update the bio in the backend
            await userData.setBio(bio);
            // Update the banner in the backend
            await userData.setProfileBanner(tempProfileBanner);
            // Update the pfp in the backend
            await userData.setProfilePicture(tempProfilePicture);
        }
        // Commit changes locally and exit edit modes
        setProfileName(tempProfileName);
        setProfileBanner(tempProfileBanner);
        setEditMode(false);
        setEditingProfileName(false);
    };

    // Global "Discard Changes" button handler: revert temp value and exit edit modes
    const handleDiscardChanges = () => {
        setTempProfileName(profileName);
        setTempProfileBanner(profileBanner);
        setTempProfilePicture(profilePicture);
        setEditMode(false);
        setEditingProfileName(false);
    };

    // Tab definitions (original implementation)
    const TABS = Object.freeze({
        ABOUT: 'About',
        USERCALENDAR: 'My Calendar',
        USERPOSTS: 'My Posts',
        COMMENTS: 'Comments',
        UPVOTED: 'Up Voted',
        DOWNVOTED: 'Down Voted'
    });

    // Renders the active tab content
    function renderTab(tab) {
        // If profile is blocked, only show a message about the blocked status
        if (isBlocked) {
            return (
                <div className="blocked-profile-message">
                    <p>This profile is not available.</p>
                </div>
            );
        }
        
        switch (tab) {
            case TABS.ABOUT:
                return <About editMode={editMode} bio={bio} setBio={setBio} favorites={profileFavorites} />;
            case TABS.USERCALENDAR:
                return <UserCalendar />;
            case TABS.USERPOSTS:
                return <UsersPosts />;
            case TABS.COMMENTS:
                return <Comments />;
            case TABS.UPVOTED:
                return <UpVoted />;
            case TABS.DOWNVOTED:
                return <DownVoted />;
            default:
                return null; // or a default page
        }
    }

    return (
        <>
            <Sidebar sidebar={sidebar} />
            <div className={`container ${sidebar ? "" : 'large-container'}`}>
                <div className="profile">
                    <div className="section-header">
                        <div className="profile-container">
                            <div className="profile-header">
                                <div className="profile-banner">
                                    <div className="profile-banner-sizer">
                                        <img
                                            className="profile-banner-image"
                                            src={isBlocked ? headerimage : (editMode ? tempProfileBanner : profileBanner)}
                                            alt="Profile Banner"
                                        />
                                        {editMode && !isBlocked && (
                                            <button
                                                className="edit-profile-banner-button"
                                                onClick={() => { openModal('submit-prof-ban') }}
                                            >
                                                Edit
                                            </button>
                                        )}
                                    </div>
                                    <div className="profile-picture-container">
                                        <img
                                            className="profile-picture"
                                            src={isBlocked ? profileimage : (editMode ? tempProfilePicture : profilePicture)}
                                            alt="Profile Picture"
                                        />
                                        {editMode && !isBlocked && (
                                            <button
                                                className="edit-profile-picture-button"
                                                onClick={() => { openModal('submit-prof-pic') }}
                                            >
                                                Edit
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="profile-header-content">
                                    <div className="header-caption">
                                        <div className="header-names">
                                            {editingProfileName && !isBlocked ? (
                                                <>
                                                    <input
                                                        type="text"
                                                        value={tempProfileName}
                                                        onChange={(e) => setTempProfileName(e.target.value)}
                                                    />
                                                    {/* Inline save now exits inline editing mode */}
                                                    <button
                                                        className="save-profile-name-button"
                                                        onClick={() => setEditingProfileName(false)}
                                                    >
                                                        Save
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    {/* If in edit mode, show the temporary (preview) name */}
                                                    <h1>{isBlocked ? "User" : (editMode ? tempProfileName : profileName)}</h1>
                                                    {editMode && !isBlocked && (
                                                        <button
                                                            className="edit-profile-name-button"
                                                            onClick={() => setEditingProfileName(true)}
                                                        >
                                                            Edit
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                        {!isBlocked && (
                                            <div className="header-details">
                                                <h2><span>30</span> Friends</h2>
                                                <h2><span>30</span> Posts</h2>
                                            </div>
                                        )}
                                        
                                        {/* Three-dot menu for non-profile owners who aren't already friends */}
                                        {currentUser && !isOwner && friendshipChecked && blockCheckComplete && !isBlocked && (
                                            <div className="profile-actions-dropdown">
                                                <button className="three-dots-button" onClick={toggleDropdown}>
                                                    &#8226;&#8226;&#8226;
                                                </button>
                                                {showDropdown && (
                                                    <div className="dropdown-menu">
                                                        {!isFriend && (
                                                            <button className="dropdown-item" onClick={handleAddFriend}>
                                                                Add Friend
                                                            </button>
                                                        )}
                                                        <button className="dropdown-item" onClick={handleBlockUser}>
                                                            Block User
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className="profile-header-more">
                                        {/* Additional header content */}
                                    </div>
                                </div>
                                <div className="profile-buttons">
                                    {!editMode && isOwner && !isBlocked && (
                                        <button className="edit-profile-button" onClick={handleEditClick}>
                                            Edit Profile
                                        </button>
                                    )}
                                    {editMode && !isBlocked && (
                                        <>
                                            <button className="save-changes" onClick={handleSaveClick}>
                                                Save Changes
                                            </button>
                                            <button className="discard-changes" onClick={handleDiscardChanges}>
                                                Discard Changes
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {!isBlocked && (
                            <div className="profile-tabs">
                                {Object.entries(TABS).map(([tabKey, tabName]) => (
                                    <button
                                        key={tabName}
                                        className={`tab-link ${activeTab === tabName ? 'active' : ''}`}
                                        onClick={() => setActiveTab(tabName)}
                                    >
                                        {tabName}
                                    </button>
                                ))}
                                <hr />
                            </div>
                        )}
                    </div>
                    <div className="section-content">
                        <div className="profile-content">
                            <div className="content-tabs">
                                {renderTab(activeTab)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Overlays
                modalType={modalType}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onSubmitBanner={handleBannerSubmit}
                onSubmitPicture={handlePictureSubmit}
            />
        </>
    );
};
