import React, { useState, useEffect } from "react";
import { deleteUserAccount, auth } from "../../../firebase";
import { onAuthStateChanged, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import UserData from "../../../utils/UserData"; // Import the UserData class
import "./YourAccount.css";

const YourAccount = () => {
    const [userData, setUserData] = useState({});
    const [editMode, setEditMode] = useState(null);
    const [newData, setNewData] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
    const [user, setUser] = useState(null);

    // Initialize UserData instance when user is authenticated
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                const userDataInstance = new UserData(user.uid);
                fetchData(userDataInstance);
            }
        });

        return () => unsubscribe();
    }, []);

    // Fetch user data using UserData class
    const fetchData = async (userDataInstance) => {
        try {
            const data = await userDataInstance.getUserData();
            setUserData(data);
            setNewData(data);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    // Handle input change
    const handleChange = (field, value) => {
        setNewData((prev) => ({ ...prev, [field]: value }));
    };

    // Save updated user data
    const handleSave = async (field) => {
        if (!user) return console.error("User not authenticated.");

        if (!newData[field] || newData[field].trim() === "") {
            alert(`${field} cannot be empty!`);
            return;
        }

        try {
            const userDataInstance = new UserData(user.uid);
            await userDataInstance.setUserData({ [field]: newData[field] });
            setUserData((prev) => ({ ...prev, [field]: newData[field] }));
            alert(`${field} updated successfully!`);
            setEditMode(null);
        } catch (error) {
            console.error(`Error updating ${field}:`, error);
            alert(`Failed to update ${field}: ${error.message}`);
        }
    };

    // Validate and update password
    const handleSavePassword = async () => {
        if (!user) return console.error("User not authenticated.");

        if (!newData.oldPassword || !newData.newPassword || !newData.confirmPassword) {
            alert("All password fields must be filled!");
            return;
        }
        if (newData.newPassword !== newData.confirmPassword) {
            alert("New passwords do not match!");
            return;
        }
        try {
            const credential = EmailAuthProvider.credential(user.email, newData.oldPassword);
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newData.newPassword);
            alert("Password updated successfully!");
            setEditMode(null);
        } catch (error) {
            alert(`Failed to update password: ${error.message}`);
        }
    };

    // Delete account
    const handleDeleteAccount = async () => {
        if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) return;

        const result = await deleteUserAccount();
        if (result.success) {
            alert("Account deleted successfully.");
            window.location.href = "/";
        } else {
            alert(`Failed to delete account: ${result.error?.message || result.error}`);
        }
    };

    return (
        <div className="YourAccount">
            <h2>Account Settings</h2>

            <div className="personal-detail">
                <label>Name</label>
                {editMode === "name" ? (
                    <div>
                        <input type="text" value={newData.name || ""} onChange={(e) => handleChange("name", e.target.value)} />
                        <button onClick={() => handleSave("name")}>Save</button>
                        <button onClick={() => setEditMode(null)}>Cancel</button>
                    </div>
                ) : (
                    <div>
                        <span>{userData.name || "Not Provided"}</span>
                        <button onClick={() => setEditMode("name")}>Edit</button>
                    </div>
                )}
            </div>

            <div className="personal-detail">
                <label>Birthday</label>
                {editMode === "dob" ? (
                    <div>
                        <input type="date" value={newData.dob || ""} onChange={(e) => handleChange("dob", e.target.value)} />
                        <button onClick={() => handleSave("dob")}>Save</button>
                        <button onClick={() => setEditMode(null)}>Cancel</button>
                    </div>
                ) : (
                    <div>
                        <span>{userData.dob || "Not Provided"}</span>
                        <button onClick={() => setEditMode("dob")}>Edit</button>
                    </div>
                )}
            </div>

            <div className="personal-detail">
                <label>Email</label>
                <span>{userData.email || "Not Provided"}</span>
            </div>

            <div className="personal-detail">
                <label>Password</label>
                {editMode === "password" ? (
                    <div>
                        <input type="password" placeholder="Old Password" value={newData.oldPassword} onChange={(e) => handleChange("oldPassword", e.target.value)} />
                        <input type="password" placeholder="New Password" value={newData.newPassword} onChange={(e) => handleChange("newPassword", e.target.value)} />
                        <input type="password" placeholder="Confirm New Password" value={newData.confirmPassword} onChange={(e) => handleChange("confirmPassword", e.target.value)} />
                        <button onClick={handleSavePassword}>Save</button>
                        <button onClick={() => setEditMode(null)}>Cancel</button>
                    </div>
                ) : (
                    <div>
                        <span>********</span>
                        <button onClick={() => setEditMode("password")}>Edit</button>
                    </div>
                )}
            </div>

            <button className="button delete-account" onClick={handleDeleteAccount}>Delete Account</button>
        </div>
    );
};

export default YourAccount;