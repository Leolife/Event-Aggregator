import React, { useState } from 'react';
import './Account.css';
import { ReactComponent as Logo } from '../../assets/calendar-icon.svg';
import { auth } from '../../firebase';
import { firestore } from '../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';

const Login = ({ isOpen, onClose }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            // First, look up the email associated with the username
            const usersRef = collection(firestore, "users");
            const q = query(usersRef, where("name", "==", username.toLowerCase()));
            const querySnapshot = await getDocs(q);
            
            if (querySnapshot.empty) {
                setError('Username not found.');
                return;
            }

            // Get the email associated with the username
            const userDoc = querySnapshot.docs[0];
            const email = userDoc.data().email;

            // Now sign in with the email
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log('Logged in user:', userCredential.user);
            onClose();
        } catch (error) {
            console.error('Login error:', error);
            switch (error.code) {
                case 'auth/user-disabled':
                    setError('This account has been disabled.');
                    break;
                case 'auth/user-not-found':
                    setError('Account not found.');
                    break;
                case 'auth/wrong-password':
                    setError('Incorrect password.');
                    break;
                default:
                    setError('An error occurred during login. Please try again.');
            }
        }
    };

    return (
        <div className="modal">
            <div className="modal-content login">
                <button className="close-btn" onClick={onClose}> &times; </button>
                <div className='flex-div'>
                    <Logo className="logo" />   
                    <h2>Login to Event Aggregator</h2>
                </div>
                <form onSubmit={handleLogin}>
                    {error && <div className="error-message" style={{color: 'red', textAlign: 'center', marginBottom: '10px'}}>{error}</div>}
                    <div className="username">
                        <div>
                            <h4>Username</h4>
                        </div>
                        <div className="input-box username">
                            <input 
                                type="text" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="password">
                        <div>
                            <h4>Password</h4>
                        </div>
                        <div className="input-box password">
                            <input 
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label>Forgot Username or Password?</label>
                    </div>
                    <div className="flex-div">
                        <button type="submit" className="button log-in">Log In</button>
                    </div>
                    <div>
                        <label>Don't have an account? Sign up here</label>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;