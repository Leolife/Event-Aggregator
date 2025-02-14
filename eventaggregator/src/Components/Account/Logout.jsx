import React, { useState } from 'react';
//import bcrypt from 'bcryptjs';  // commented until use
import './Account.css';
import { ReactComponent as Logo } from '../../assets/calendar-icon.svg';
import { auth } from '../../firebase';
import { signOut } from "firebase/auth";
import  "firebase/auth";



const Logout = ({ isOpen, onClose }) => {
    const [error, setError] = useState('');

    const handleButtonClick = () => {
        handleLogout();  // Calls the logout function
        onClose();  // Closes the modal
    };

    const handleLogout = () => {
            signOut(auth)
                .then(() => {
                    // Clear session storage
                    sessionStorage.removeItem("userEmail");
                    sessionStorage.removeItem("userName");
                    sessionStorage.removeItem("userDob");
                    sessionStorage.removeItem("userUid");
        
                    console.log("User logged out successfully");
                    // Optionally, redirect or refresh the UI
                })
                .catch((error) => {
                    console.error("Logout error:", error);
                });
        };
    

    return (
        <div className="modal">
            <div className="modal-content logout">
                <button className="close-btn" onClick={onClose}> &times; </button>
                <div className='flex-div'>
                    <Logo className="logo" />   
                    <h2>Are you sure you want to log out?</h2>
                </div>
                <div className="flex-div">
                    <button className="button-log-out" onClick={handleButtonClick}>Log Out</button>
                </div>
                
            </div>
        </div>
    );
};

export default Logout;