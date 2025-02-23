import React, { useState } from 'react';
import { ReactComponent as Logo } from '../../assets/calendar-icon.svg';
import { auth, firestore } from '../../firebase'; // Adjusted for your firebase.js location
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import UserData from '../../utils/UserData';
import { Profile } from '../../Pages/Profile/Profile';

const user = auth.currentUser;
const userData = user ? new UserData(user.uid) : null;
const SubmitProfilePicture = ({isOpen, onClose, onSubmit}) => {
    const [link, setLink] = useState('');

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        // call parent callback with the link
        onSubmit(link);
    };


    return (
        <div className="modal">
            <div className="modal-content link">
                <button className="close-btn" onClick={onClose}>&times;</button>
                <h2>Enter Link</h2>
                <p>Enter a link to a picture on the internet to set as your profile picture.</p>
                <form onSubmit={handleSubmit}>
                    <div className="input-box link">
                        <input 
                            type="text" 
                            placeholder="https://example.com" 
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex-div">
                        <button className="button-submit" type="submit">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SubmitProfilePicture;