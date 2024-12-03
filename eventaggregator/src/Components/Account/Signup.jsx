import React from 'react'
import './Account.css';
import { ReactComponent as Logo } from '../../assets/calendar-icon.svg';

const Signup = ({ isOpen, onClose }) => {
    return (
        <div className="modal">
            <div className="modal-content signup">
                <button className="close-btn" onClick={onClose}> &times; </button>
                <div className='flex-div'>
                    <Logo className="logo" />   
                    <h2>Sign up to Event Aggregator</h2>
                </div>
                <form>
                    <div className="username">
                        <div>
                            <h4>Username</h4>
                        </div>
                        <div className="input-box username">
                            <input type="text" />
                        </div>
                    </div>
                    <div className="password">
                        <div>
                            <h4> Password </h4>
                        </div>
                        <div className="input-box password">
                            <input type="text" />
                        </div>
                    </div>
                    <div className="email">
                        <div>
                            <h4>Email</h4>
                        </div>
                        <div className="input-box username">
                            <input type="text" />
                        </div>
                    </div>
                    <div className="birthday">
                        <div>
                            <h4>Date of Birth</h4>
                        </div>
                        <div className="input-box username">
                            <input type="date" />
                        </div>
                    </div>
                    <div className="flex-div">
                        <button className="button sign-up"> Sign Up </button>
                    </div>
                    <div>
                        <label> Already have an account? Log in here </label>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Signup
