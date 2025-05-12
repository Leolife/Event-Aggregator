import React, { useState, useEffect } from 'react';
import './Interests.css';
import { auth, firestore } from '../../../firebase'; // Adjusted for your firebase.js location
import UserData from '../../../utils/UserData';

const user = auth.currentUser;
const userData = user ? new UserData(user.uid) : null;

function Interests() {
    const [interests, setInterests] = useState([]);
    const [newInterest, setNewInterest] = useState(""); // State for the input field
    const [formData, setFormData] = useState({
        eventType: '',
        travelDistance: '',
        timePreference: '',
        eventDuration: '',
        eventFeatures: []
    });
    const requiredFields = [
        "eventType",
        "travelDistance",
        "preferredDays",
        "duration",
        "eventFeatures"
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        const fetchInterests = async () => {
            const user = auth.currentUser;
            if (user) {
                const userData = new UserData(user.uid);
                const userInterests = await userData.getInterests();
                setInterests(userInterests);
            }
        };
        fetchInterests();
    }, []);

    const addInterest = async (e) => {
        console.log("Current User:", auth.currentUser);
        e.preventDefault(); // Prevent form refresh

        if (!newInterest.trim()) return; // Prevent empty submissions

        const updatedInterests = [...interests, newInterest.trim()]; //append new interest
        const user = auth.currentUser;
        if (user) {
            const userData = new UserData(user.uid);
            await userData.setInterests(updatedInterests); //update in Firebase
        }
        setInterests(updatedInterests); // update UI state
        setNewInterest(""); //clear input box
    };


    const addQuestionnaire = async (e) => {
        e.preventDefault(); // Prevent form refresh


        const user = auth.currentUser;
        if (user) {
            const userData = new UserData(user.uid);
            await userData.setQuestionnaire(formData); // Save to Firebase
        }

        console.log("Submitted Questionnaire:", formData);
    };


    const deleteInterest = async (indexToDelete) => {
        // Create a new array excluding the interest at the provided index
        const updatedInterests = interests.filter((_, index) => index !== indexToDelete);

        const user = auth.currentUser;
        if (user) {
            const userData = new UserData(user.uid);
            // Update the interests in Firebase
            await userData.setInterests(updatedInterests);
        }

        // Update the component state
        setInterests(updatedInterests);
    };

    return (
        <div className="Interests">
            <div>
                <h2 className="interests">Add your interests</h2>
                <p>Enter in Key Terms to help us tailor your experience!</p>
                <form onSubmit={addInterest}>
                    <div className="interest-input">
                        <div className="input-box-key-term">
                            <input
                                type="text"
                                size={50}
                                placeholder="Example: eSports, Anime, Movies..."
                                value={newInterest}
                                onChange={(e) => setNewInterest(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="interest-flex-div">
                        <button type="submit" className="interest-button">Submit</button>
                    </div>
                </form>

                <div>
                    {interests.map((interest, index) => (
                        <p key={index} className="interest-item">
                            <span className="interest-box">{interest}</span>
                            <button className="delete-button" onClick={() => deleteInterest(index)}>
                                Delete
                            </button>
                        </p>
                    ))}
                </div>
            </div>
            <form className='questionnaire' onSubmit={addQuestionnaire}>
                <h2>
                    Type of Events:
                    <select name="eventType" value={formData.eventType} onChange={handleChange} required>
                        <option value="" disabled>Select one</option>
                        <option value="esports">Esports tournaments</option>
                        <option value="concerts">Concert events</option>
                        <option value="community">Local community events</option>
                        <option value="international">International events</option>
                        <option value="sports">Sports events</option>
                    </select>
                </h2>

                <h2>
                    Travel Distance:
                    <select name="travelDistance" value={formData.travelDistance} onChange={handleChange} required>
                        <option value="" disabled>Select one</option>
                        <option value="local">Local only</option>
                        <option value="regional">Within the same state or region</option>
                        <option value="national">Nationally</option>
                        <option value="international">Internationally</option>
                    </select>
                </h2>

                <h2>
                    Time Preference:
                    <select name="timePreference" value={formData.timePreference} onChange={handleChange} required>
                        <option value="" disabled>Select one</option>
                        <option value="weekdays">Weekdays</option>
                        <option value="weekends">Weekends</option>
                        <option value="none">No preference</option>
                    </select>
                </h2>

                <h2>
                    Event Duration:
                    <select name="eventDuration" value={formData.eventDuration} onChange={handleChange} required>
                        <option value="" disabled>Select one</option>
                        <option value="short">Short (a few hours)</option>
                        <option value="day">Day-long events</option>
                        <option value="multi">Multi-day events</option>
                    </select>
                </h2>

                <div className='event-features'>
                    <h2> Event Features (Select all that Apply) </h2>
                    {[
                        { label: 'High-profile participants (teams/performers)', value: 'high-profile' },
                        { label: 'Popular locations', value: 'popular-location' },
                        { label: 'Networking opportunities', value: 'networking' },
                        { label: 'Family-friendly', value: 'family' },
                        { label: 'Accessibility', value: 'accessibility' }
                    ].map(({ label, value }) => (
                        <label key={value}>
                            <input
                                type="checkbox"
                                value={value}
                                checked={formData.eventFeatures.includes(value)}
                                onChange={(e) => {
                                    const checked = e.target.checked;
                                    setFormData(prev => ({
                                        ...prev,
                                        eventFeatures: checked
                                            ? [...prev.eventFeatures, value]
                                            : prev.eventFeatures.filter(v => v !== value)
                                    }));
                                }}
                            />
                            {label}
                        </label>
                    ))}
                </div>



                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default Interests;
