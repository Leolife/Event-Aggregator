import React, { useState } from 'react'
import './Settings.css'
import Sidebar from '../../Components/Sidebar/Sidebar'
import { deleteUserAccount } from '../../firebase'; 
import { settings } from 'firebase/analytics';



export const Settings = ({ sidebar }) => {

    // Connects the tab logic with the naming convention-
    // Change the Values to rename the tabs as displayed on the website
    


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
                <div className="settings">
                    Hello
                </div>
            </div>
        </>

    )
}

export default Settings;