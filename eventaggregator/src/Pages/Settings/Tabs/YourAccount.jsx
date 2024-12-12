import React, { useState, useEffect } from 'react';
import { deleteUserAccount } from '../../../firebase'; 


// import './Security.css'

function YourAccount() {

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

    return(
        <div className="YourAccount">
            <button 
                className="button delete-account" 
                onClick={handleDeleteAccount}>
                    Delete Account
                </button>
            <p>Account Details</p>
        </div>
    );
}

export default YourAccount;