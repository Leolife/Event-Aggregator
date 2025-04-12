import React, { useState } from 'react';
import './Account.css';
import { ReactComponent as Logo } from '../../assets/calendar-icon.svg';
import { auth, firestore } from '../../firebase'; // Adjusted for your firebase.js location
import { createUserWithEmailAndPassword, sendEmailVerification  } from 'firebase/auth';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import Interests from '../../Pages/Settings/Tabs/Interests';


const Signup = ({ isOpen, onClose }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [dob, setDob] = useState('');
    const [error, setError] = useState('');

    // Function to handle form submission
    const handleSignup = async (e) => {
        e.preventDefault();

        try {
            // Create user with email and password in Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // Get the user UID from Firebase Authentication
            const user = userCredential.user;

            // Major change: document id is the same as the userid
            // before: adddoc(collection(...))
            await setDoc(doc(firestore, "users", user.uid), { //
                uid: user.uid,
                name: name,
                email: email,
                dob: dob,
                bio: "",
                profileBanner: "",
                profilePicture: "",
                interests: [],
                createdAt: new Date(), // Optionally, add a timestamp
            });

            // Send email verification
            await sendEmailVerification(user);
            alert('Signup successful! A verification email has been sent. Please check your inbox.');
            setName('');
            setEmail('');
            setPassword('');
            setDob('');
            setError('');
            onClose(); // Close the modal on success

        } catch (err) {
            setError(err.message); // Show error message if signup fails
        }
    };

    return (
        <div className="modal">
            <div className="modal-content signup">
                <button className="close-btn" onClick={onClose}>&times;</button>
                <div className="flex-div">
                    <Logo className="logo" />
                    <h2>Sign up to Event Aggregator</h2>
                </div>
                <form onSubmit={handleSignup}>
                    <div className="username">
                        <h4>Username</h4>
                        <div className="input-box username">
                            <input 
                                type="text" 
                                placeholder="Username" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="email">
                        <h4>Email</h4>
                        <div className="input-box username">
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="password">
                        <h4>Password</h4>
                        <div className="input-box password">
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="birthday">
                        <h4>Date of Birth</h4>
                        <div className="input-box username">
                            <input 
                                type="date" 
                                value={dob}
                                onChange={(e) => setDob(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="flex-div">
                        <button className="button sign-up">Sign Up</button>
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <div>
                        <label>Already have an account? Log in here</label>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;