import React, { useEffect, useState } from 'react';
import './Profile.css';
import Sidebar from '../../Components/Sidebar/Sidebar';
import headerimage from '../../assets/profile-header-image.png';
import profileimage from '../../assets/profile-picture.png';
import { auth } from '../../firebase'; 
import { Link } from "react-router-dom";
import UserData from '../../utils/UserData';
import Overlays from '../../Components/Overlays';

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

    const [bio, setBio] =  useState("");
    
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
            if (user) {
                const userData = new UserData(user.uid);
                const userName = await userData.getName();
                const picture = await userData.getProfilePicture();
                const banner = await userData.getProfileBanner();
                const userBio = await userData.getBio();
                setProfileName(userName);
                setProfilePicture(picture);
                setProfileBanner(banner);
                setBio(userBio)

                setTempProfileBanner(banner); // Initialize temp banner
                setTempProfilePicture(picture); // Initialize temp pictire

            }
        };
        fetchProfileData();
    }, []);

    // Callback to receive the new banner link from the modal
    const handleBannerSubmit = (link) => {
        setTempProfileBanner(link);
        // Optionally, you might close the modal here or leave that to the modal itself
        setIsOpen(false);
    };

    // Callback to receive the new picture link from the modal
    const handlePictureSubmit = (link) => {
        setTempProfilePicture(link);
        // Optionally, you might close the modal here or leave that to the modal itself
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
        setTempProfileBanner(profileBanner)
        setTempProfilePicture(profilePicture)
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
        switch (tab) {
            case TABS.ABOUT:
                return <About editMode={editMode} bio={bio} setBio={setBio} />;
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
                                            src={editMode ? tempProfileBanner : profileBanner} 
                                            alt="Profile Banner" 
                                        />
                                        {editMode && (
                                            <button 
                                                className="edit-profile-banner-button"
                                                onClick={() => {openModal('submit-prof-ban')}}
                                            >
                                                Edit
                                            </button>
                                        )}
                                    </div>
                                    <div className="profile-picture-container">
                                    <img 
                                        className="profile-picture" 
                                        src={editMode ? tempProfilePicture : profilePicture} 
                                        alt="Profile Picture" 
                                    />
                                        {editMode && (
                                            <button 
                                                className="edit-profile-picture-button" 
                                                onClick={() => {openModal('submit-prof-pic')}
                                            }>
                                                Edit
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="profile-header-content">
                                    <div className="header-caption">
                                        <div className="header-names">
                                            {editingProfileName ? (
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
                                                    <h1>{editMode ? tempProfileName : profileName}</h1>
                                                    {editMode && (
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
                                        <div className="header-details">
                                            <h2><span>30</span> Friends</h2>
                                            <h2><span>30</span> Posts</h2>
                                        </div>
                                    </div>
                                    <div className="profile-header-more">
                                        {/* Additional header content */}
                                    </div>
                                </div>
                                <div className="profile-buttons">
                                    {!editMode && (
                                        <button className="edit-profile-button" onClick={handleEditClick}>
                                            Edit Profile
                                        </button>
                                    )}
                                    {editMode && (
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
