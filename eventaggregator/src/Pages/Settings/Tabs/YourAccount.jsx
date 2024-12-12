import React, { useState, useEffect } from 'react';
import { deleteUserAccount } from '../../../firebase'; 
import { auth, firestore } from '../../../firebase';
import { updatePassword } from 'firebase/auth';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';


// import './Security.css'

function YourAccount() {

    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showUsernameModal, setShowUsernameModal] = useState(false);
    const [newUsername, setNewUsername] = useState('');

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        if (newPassword.length < 8) {  // follows NIST rules
            setError('New password must be at least 8 characters long');
            return;
        }

        try {
            const user = auth.currentUser;
            await updatePassword(user, newPassword);
            setSuccess('Password updated successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setTimeout(() => {
                setShowPasswordModal(false);
                setSuccess('');
            }, 2000);
        } catch (error) {
            console.error('Error updating password:', error);
            setError('Failed to update password. Please try again later.');
        }
    };

    const handleUsernameChange = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!newUsername) {
            setError('Username cannot be empty');
            return;
        }

        try {
            // Check if username already exists
            const usersRef = collection(firestore, "users");
            const q = query(usersRef, where("name", "==", newUsername.toLowerCase()));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                setError('Username already exists');
                return;
            }

            // Find current user's document and update username
            const user = auth.currentUser;
            const userQuery = query(usersRef, where("uid", "==", user.uid));
            const userDocs = await getDocs(userQuery);

            if (!userDocs.empty) {
                const userDoc = userDocs.docs[0];
                await updateDoc(userDoc.ref, {
                    name: newUsername.toLowerCase()
                });
                setSuccess('Username updated successfully!');
                setNewUsername('');
                setTimeout(() => {
                    setShowUsernameModal(false);
                    setSuccess('');
                }, 2000);
            }
        } catch (error) {
            console.error('Error updating username:', error);
            setError('Failed to update username. Please try again later.');
        }
    };

    return (
        <div className="YourAccount">
            <button 
                className="button change-password"
                onClick={() => setShowPasswordModal(true)}>
                Change Password
            </button>

            <button 
                className="button change-username"
                onClick={() => setShowUsernameModal(true)}>
                Change Username
            </button>

            <button 
                className="button delete-account" 
                onClick={handleDeleteAccount}>
                Delete Account
            </button>

            {showPasswordModal && (
                <div className="modal password-modal">
                    <div className="modal-content">
                        <button 
                            className="close-btn" 
                            onClick={() => setShowPasswordModal(false)}>
                            &times;
                        </button>
                        <h2>Change Password</h2>
                        <form onSubmit={handlePasswordChange}>
                            {error && <div className="error-message">{error}</div>}
                            {success && <div className="success-message">{success}</div>}
                            
                            <div className="container">
                                <h4>Current Password</h4>
                                <div className="input-box">
                                    <input 
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="container">
                                <h4>New Password</h4>
                                <div className="input-box">
                                    <input 
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="container">
                                <h4>Confirm New Password</h4>
                                <div className="input-box">
                                    <input 
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <button type="submit" className="update-password-btn">
                                Update Password
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {showUsernameModal && (
                <div className="modal username-modal">
                    <div className="modal-content">
                        <button 
                            className="close-btn" 
                            onClick={() => setShowUsernameModal(false)}>
                            &times;
                        </button>
                        <h2>Change Username</h2>
                        <form onSubmit={handleUsernameChange}>
                            {error && <div className="error-message">{error}</div>}
                            {success && <div className="success-message">{success}</div>}
                            
                            <div className="container">
                                <h4>New Username</h4>
                                <div className="input-box">
                                    <input 
                                        type="text"
                                        value={newUsername}
                                        onChange={(e) => setNewUsername(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <button type="submit" className="update-username-btn">
                                Update Username
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default YourAccount;