import React, { useState, useEffect } from 'react';
import UserData from '../../../utils/UserData'; // Adjust path if needed
import { auth } from '../../../firebase';
import './Notifications.css';
import sendNotificationPreferencesEmail from "../../../utils/emailTemplates";

function Notifications() {
    const [selectedOption, setSelectedOption] = useState("NotSubscribed");
    const [hasChanged, setHasChanged] = useState(false);
    const [customOptions, setCustomOptions] = useState({
        newFriendRequest: false,
        postLike: false,
        postComment: false,
        repliesToYourPosts: false,
        eventReminder: false,
        eventUpdates: false,
        mentionsInForums: false,
    });

    useEffect(() => {
        const loadSettings = async () => {
            if (!auth.currentUser) {
                console.error("User not authenticated");
                return;
            }

            try {
                const user = new UserData(auth.currentUser.uid);
                const userData = await user.getUserData();

                if (userData.notificationSettings) {
                    console.log("Fetched Notification Settings:", userData.notificationSettings);

                    setSelectedOption(userData.notificationSettings.subscriptionStatus || "NotSubscribed");

                    setCustomOptions((prevOptions) => ({
                        ...prevOptions,
                        ...userData.notificationSettings.customOptions
                    }));
                } else {
                    console.warn("No notification settings found for user.");
                }
            } catch (error) {
                console.error("Error fetching notification settings:", error.message);
            }
        };

        loadSettings();
    }, []);

    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);
        setHasChanged(true);
    };

    const handleCustomChange = (e) => {
        setCustomOptions((prevOptions) => ({
            ...prevOptions,
            [e.target.name]: e.target.checked
        }));
        setHasChanged(true);
    };

    const handleSave = async () => {
        if (!auth.currentUser) return;

        try {
            const user = new UserData(auth.currentUser.uid);
            await user.setUserData({
                notificationSettings: {
                    subscriptionStatus: selectedOption,
                    customOptions: customOptions
                }
            });

            setHasChanged(false); 
            alert("Notification settings saved!");
            await sendNotificationPreferencesEmail({
                subscriptionStatus: selectedOption,
                customOptions
              });
        } catch (error) {
            console.error("Error saving notification settings:", error.message);
            alert("Failed to save settings. Please try again.");
        }
    };

    const handleCancel = () => {
        setHasChanged(false);
    };

    return (
        <div className="notification-modal">
            <h2>Notification Settings</h2>

            <label className="radio-option">
                <input
                    type="radio"
                    name="notification"
                    value="NotSubscribed"
                    checked={selectedOption === "NotSubscribed"}
                    onChange={handleOptionChange}
                />
                <span>Not subscribed</span>
                <p>Only receive notifications from this request when you have participated or have been @mentioned.</p>
            </label>

            <label className="radio-option">
                <input
                    type="radio"
                    name="notification"
                    value="Subscribed"
                    checked={selectedOption === "Subscribed"}
                    onChange={handleOptionChange}
                />
                <span>Subscribed</span>
                <p>Receive all notifications from this request.</p>
            </label>

            <label className="radio-option">
                <input
                    type="radio"
                    name="notification"
                    value="Custom"
                    checked={selectedOption === "Custom"}
                    onChange={handleOptionChange}
                />
                <span>Custom</span>
                <p>You will only be notified for the events selected from the list below. If you participate or are @mentioned, you will be subscribed.</p>
            </label>

            {selectedOption === "Custom" && (
                <div className="custom-options">
                    <h3>Custom Notification Preferences</h3>
                    {Object.entries(customOptions).map(([key, value]) => (
                        <label key={key} className="checkbox-option">
                            <input
                                type="checkbox"
                                name={key}
                                checked={value}
                                onChange={handleCustomChange}
                            />
                            {key.replace(/([A-Z])/g, " $1")}
                        </label>
                    ))}
                </div>
            )}

            {hasChanged && (
                <div className="modal-buttons">
                    <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
                    <button className="save-btn" onClick={handleSave}>Save</button>
                </div>
            )}
        </div>
    );
}

export default Notifications;
