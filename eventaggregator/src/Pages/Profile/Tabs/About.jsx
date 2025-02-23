import { auth, firestore } from '../../../firebase'; // Adjusted for your firebase.js location
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import UserData from '../../../utils/UserData';
import { useState } from 'react';
import "./About.css"
const user = auth.currentUser;
const userData = user ? new UserData(user.uid) : null;

// import './About.css'
function About({ editMode, bio, setBio }) {
    
    const handleBioChange = (e) => {
        setBio(e.target.value);
    };

    return (
        <div className="About">
            <h2>About</h2>
            {editMode ? (
                <textarea className="userBioChange"
                    value={bio}
                    onChange={handleBioChange}
                    rows="5"
                    cols="50"
                />
            ) : (
                <p className="userBio">{bio}</p>
            )}
            <hr />
            <div className="profile-friends">
                <h2>Friends (30)</h2>
            </div>
        </div>
    );
}

export default About;