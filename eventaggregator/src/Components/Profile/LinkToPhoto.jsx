import React, { useState } from 'react';
import { ReactComponent as Logo } from '../../assets/calendar-icon.svg';
import { auth, firestore } from '../../firebase'; // Adjusted for your firebase.js location
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import UserData from '../../utils/UserData';
import { Profile } from '../../Pages/Profile/Profile';

const user = auth.currentUser;
const userData = user ? new UserData(user.uid) : null;
const LinkToPhoto = ({isOpen, onClose }) => {
    


    return (
        <div className="modal">
            <div className="modal-content link">
                <button className="close-btn" onClick={onClose}>&times;</button>
                <form>
                    <div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LinkToPhoto;