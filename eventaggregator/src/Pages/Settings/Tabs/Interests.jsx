import React, { useState, useEffect } from 'react';
import './Interests.css';
import { auth, firestore } from '../../../firebase'; // Adjusted for your firebase.js location
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import UserData from '../../../utils/UserData';

const userData = new UserData(sessionStorage.getItem("userUid"));

function Interests() {
    const [interests, setInterests] = useState([]);

    useEffect(() => {
        const fetchInterests = async () => {
            const userInterests = await userData.getInterests();
            setInterests(userInterests);
        };
        fetchInterests();
    }, []);

    return(
        <div className="Interests">
            <div>
                <h2>Interests</h2>
                <ul>
                    {interests.map((interest, index) => (
                        <li className="interest-box" key={index}>{interest}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Interests;