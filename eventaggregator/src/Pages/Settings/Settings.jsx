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
        YOURACCOUNT: 'Your Account',
        INTERESTS: 'Interests',
        NOTIFICATIONS: 'Notifications',
        PRIVACY: 'Privacy',
        SECURITY: 'Security',
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
            case TABS.YOURACCOUNT:
                return <YourAccount />;
            case TABS.INTERESTS:
                return <Interests />;
            case TABS.NOTIFICATIONS:
                return <Notifications />;
            case TABS.PRIVACY:
                return <Privacy/>
            case TABS.SECURITY:
                return <Security />;
            default:
                return null; // or a default page
        }
      }

const styles = {
  container: {
    display: 'flex',
    height: '100vh', // Full height container
  },
  buttonColumn: {
    width: '25%', // Left side takes up 25% of the space
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start', // Align buttons to the left
    padding: '20px',
    backgroundColor: '#f0f0f0', // Light background for distinction
    gap: '10px', // Space between buttons
  },
  button: {
    width: '100%', // Full width of button column
    padding: '10px 20px',
  },
  infoColumn: {
    width: '75%', // Right side takes up 75% of the space
    padding: '20px',
    backgroundColor: '#ffffff', // White background for the content area
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
};

    return (
        <>
            <Sidebar sidebar={sidebar} />
            <div className={`container ${sidebar ? "" : 'large-container'}`}>
                <div className="settings">



                    <div className="settings-tabs" style={styles.buttonColumn}>
                        {Object.entries(TABS).map(([tabKey, tabName]) => (
                        <button 
                            style={styles.button}
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
                        <div className="content-tabs" style={styles.infoColumn}>
                            {renderTab(activeTab)}
                        </div>
                    </div>
                </div>
            </div>
        </>

    )

    

}

export default Settings;