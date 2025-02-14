import React, { useState, useEffect } from 'react';
import './Interests.css';
import { auth, firestore } from '../../../firebase'; // Adjusted for your firebase.js location
import UserData from '../../../utils/UserData';

const user = auth.currentUser;
const userData = user ? new UserData(user.uid) : null;

function Interests() {
    const [interests, setInterests] = useState([]);
    const [newInterest, setNewInterest] = useState(""); // State for the input field

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

    return(
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
        </div>
    );
}

export default Interests;