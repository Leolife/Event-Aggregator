import React, { useState } from 'react'
import './Settings.css'
import Sidebar from '../../Components/Sidebar/Sidebar'
import { deleteUserAccount } from '../../firebase'; 
import { settings } from 'firebase/analytics';

// Tab imports
import Interests from './Tabs/Interests';
import Privacy from './Tabs/Privacy';
import Security from './Tabs/Security';
import YourAccount from './Tabs/YourAccount';
import Notifications from './Tabs/Notifications';

export const Settings = ({ sidebar }) => {


    const [activeTab, setActiveTab] = useState('About');
    // Connects the tab logic with the naming convention-
    // Change the Values to rename the tabs as displayed on the website
    
    const TABS = Object.freeze({
        INTERESTS: 'Interests',
        NOTIFICATIONS: 'Notifications',
        PRIVACY: 'Privacy',
        SECURITY: 'Security',
        YOURACCOUNT: 'Your Account',
      });

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
    
    function renderTab(tab) {
        switch (tab) {
            case TABS.INTERESTS:
                return <Interests />;
            case TABS.NOTIFICATIONS:
                return <Notifications />;
            case TABS.PRIVACY:
                return <Privacy/>
            case TABS.SECURITY:
                return <Security />;
            case TABS.YOURACCOUNT:
                return <YourAccount />;
            default:
                return null; // or a default page
        }
      }
      
    return (
        <>
            <Sidebar sidebar={sidebar} />
            <div className={`container ${sidebar ? "" : 'large-container'}`}>
                <div className="settings">
                <div className="settings-tabs">
                        {Object.entries(TABS).map(([tabKey, tabName]) => (
                        <button 
                            key={tabName} 
                            className={`tab-link ${activeTab === tabKey ? 'active' : ''}`} 
                            onClick={() => setActiveTab(tabName)}
                        >
                            {tabName}
                        </button>
                        
                        ))}
                        <br/>
                        <hr />
                    </div>
                </div>
                <div className="section-content">
                    <div className="settings-content">
                        <div className="content-tabs">
                            {renderTab(activeTab)}
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default Settings;