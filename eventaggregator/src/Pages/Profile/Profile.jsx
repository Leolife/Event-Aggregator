import React, { useState } from 'react'
import './Profile.css'
import Sidebar from '../../Components/Sidebar/Sidebar'
import headerimage from '../../assets/profile-header-image.png';
import profileimage from '../../assets/profile-picture.png';
import { deleteUserAccount } from '../../firebase'; 

// Included all tabs from tabs folder to be rendered under the profile section
import About from './Tabs/About'
import UserCalendar from './Tabs/UserCalendar'
import UsersPosts from './Tabs/UserPosts';
import Comments from './Tabs/Comments'
import UpVoted from './Tabs/UpVoted';
import DownVoted from './Tabs/DownVoted';



export const Profile = ({ sidebar }) => {
    
    const [activeTab, setActiveTab] = useState('About');

    // Connects the tab logic with the naming convention-
    // Change the Values to rename the tabs as displayed on the website
    const TABS = Object.freeze({
        ABOUT: 'About',
        USERCALENDAR: 'My Calendar',
        USERPOSTS: 'My Posts',
        COMMENTS: 'Comments',
        UPVOTED: 'Up Voted',
        DOWNVOTED: 'Down Voted'
      });

    // Basically: if statements that determine which tab to render given a button press
    function renderTab(tab) {
        switch (tab) {
            case TABS.ABOUT:
                return <About />;
            case TABS.USERCALENDAR:
                return <UserCalendar />;
            case TABS.USERPOSTS:
                return <UsersPosts/>
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


    const handleDeleteAccount = async () => {
        const confirmation = window.confirm(
            "Are you sure you want to delete your account? This action cannot be undone."
        );
        if (!confirmation) return;

        const result = await deleteUserAccount();
        if (result.success) {
            alert("Account deleted successfully.");
            window.location.href = '/'; // Redirect to home page or login page
        } else {
            alert(`Failed to delete account: ${result.error?.message || result.error}`);
        }
    };
  
    return (
        <>
            <Sidebar sidebar={sidebar} />
            <div className={`container ${sidebar ? "" : 'large-container'}`}>
                <div className="profile">
                <div className="section-header">
                    <div className="profile-header">
                        <div className="profile-banner">
                            <div className="profile-banner-sizer">
                                <img className="profile-banner-image" src={headerimage} alt=""></img>
                            </div>
                            <img className="profile-picture" src={profileimage} alt=""></img>
                        </div>
                        <div className="profile-header-content">
                            <div className="header-caption">
                                <div className="header-names">
                                    <h1>Freakbob</h1>
                                </div>
                                <div className="header-details">
                                    <h2><span>30</span> Friends</h2>
                                    <h2><span>30</span> Posts</h2>
                                </div>
                            </div>
                             <div className="profile-header-more">

                            <button 
                                className="button delete-account" 
                                onClick={handleDeleteAccount}>
                                     Delete Account
                            </button>
                            

                        </div>
                        </div>
                    </div>
                    <div className="profile-tabs">
                        {Object.entries(TABS).map(([tabKey, tabName]) => (
                        <button 
                            key={tabName} 
                            className={`tab-link ${activeTab === tabKey ? 'active' : ''}`} 
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
        </>

    )
}
